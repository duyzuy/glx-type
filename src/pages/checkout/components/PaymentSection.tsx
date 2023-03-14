import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import OrderSummary from "./OrderSummary";
import {
  BookingType,
  ChanelItemType,
  WalletName,
  OfferItemType,
  MethodItemType,
  StorageKEY,
  DeviceType,
} from "../../../models";
import { isEmpty } from "../../../utils/common";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { fetchPaymentChannelData, setChannelAndMethod } from "../actions";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { checkoutApi } from "../../../api/checkout";
import Modal from "../../../components/Modal";
import ModalContent from "./ModalContent";
import { useNavigate } from "react-router";
import ChannelItem from "./ChannelItem";
import PaymentNote from "./PaymentNote";
import PaymentMethodContainer from "./PaymentMethodContainer";
type PropsType = {
  children?: JSX.Element;
  bookingInfo: BookingType;
  channelType: string;
  controlRef: React.MutableRefObject<AbortController | undefined>;
};
const PaymentSection = React.forwardRef<HTMLDivElement, PropsType>(
  ({ bookingInfo, channelType, controlRef }, ref) => {
    const dispatch = useAppDispatch();
    const { channel, method } = useAppSelector(
      (state) => state.checkout.chanelAndMethod
    );
    const profile = useAppSelector((state) => state.userInfo.profile);
    const bookingChannelMethod = useAppSelector(
      (state) => state.booking.chanelAndMethod
    );
    const navigate = useNavigate();
    const deviceInfo = useAppSelector((state) => state.chanel.deviceInfo);

    const [searchParams] = useSearchParams();
    const [modal, setModal] = useState({
      isShowModal: false,
      title: "",
      type: {
        isPaymentFail: false,
        isTimeout: false,
        isPaymentSuccess: false,
        isStreammingFail: false,
        isPaymentError: false,
      },
    });
    const [counterStart, setCounterStart] = useState(new Date().getTime());
    const [isLoadingQr, setLoadingQr] = useState(false);
    const channelCampaign = useMemo(() => {
      let channelName = "";
      switch (channelType) {
        case "zalo": {
          channelName = WalletName.ZALOPAY;
          break;
        }
        case "shopee": {
          channelName = WalletName.SHOPEEPAY;
          break;
        }
        case "momo": {
          channelName = WalletName.MOMO;
          break;
        }
        case "vnpay": {
          channelName = WalletName.VNPAY;
          break;
        }
        case "moca": {
          channelName = WalletName.MOCA;
          break;
        }
        case "fundin": {
          channelName = WalletName.FUNDIIN;
          break;
        }
        case "asiapay": {
          channelName = WalletName.ASIAPAY;
          break;
        }
      }
      return (
        channel.find((item) => item.active && item.type === channelName) || {}
      );
    }, [channel]);
    const onSelectPaymentChannel = useCallback(
      async (chanelItem: ChanelItemType) => {
        let channelAndMethod: {
          channel: ChanelItemType;
          method: MethodItemType;
        } = { channel: chanelItem, method: {} };

        const currentMethod = method.find(
          (item) => item.channelId === channelCampaign.id
        );
        setLoadingQr(true);
        if (currentMethod) {
          console.log("method is connected");
          channelAndMethod = {
            ...channelAndMethod,
            method: currentMethod,
          };

          dispatch(
            setChannelAndMethod({
              ...channelAndMethod,
            })
          );
        } else {
          dispatch(
            setChannelAndMethod({
              ...channelAndMethod,
            })
          );

          let paymentParams = {
            channelType: channelType,
            clientId: profile.id || "",
            returnUrl: window.location.href,
          };

          if (deviceInfo.partner === "mobile") {
            paymentParams = {
              ...paymentParams,
              returnUrl: `${window.location.href}?productId=${bookingInfo.offer.productId}`,
            };
          }

          const response = await dispatch(
            fetchPaymentChannelData({
              ...paymentParams,
            })
          ).unwrap();
          setLoadingQr(false);
          /**
           * listen event hub
           */
          if (response.error === 0) {
            await onlistenHubPayment({
              channelType: channelType,
              token: response.syncData.token || "",
              offer: bookingInfo.offer,
            });
          }
        }
      },
      [channelType, profile, deviceInfo, bookingInfo]
    );

    /**
     * @param args
     * channelType, token, offer
     * listen on hub then make payment when user scan qrcode
     */
    const handleSubmitPayment = async ({
      methodId,
      offer,
    }: {
      methodId: string;
      offer: OfferItemType;
    }) => {
      try {
        const response = await checkoutApi.makePayment({
          methodId: "11111",
          offer,
        });

        if (response.error === 0) {
          navigate("/thankyou");
        } else {
          console.log("fail payment", response);

          setModal((prevModal) => ({
            isShowModal: true,
            title: "Thanh toán thất bại",
            type: {
              ...prevModal.type,
              isPaymentFail: true,
            },
          }));
        }
      } catch (error) {
        console.log({ error });
      }
    };

    /**
     * for QRScan payment
     */
    const onlistenHubPayment = async (args: {
      channelType: string;
      token: string;
      offer: OfferItemType;
    }) => {
      const { channelType, token } = args;
      let inputUrl = "";
      switch (channelType) {
        case "zalo": {
          inputUrl = "zalopay";
          break;
        }
        case "shopee": {
          inputUrl = "shopeepay";
          break;
        }
      }
      controlRef.current = new AbortController();
      await fetchEventSource(
        `${process.env.REACT_APP_API_HUB_URL}/${inputUrl}`,
        {
          method: "GET",
          headers: {
            accept: "text/event-stream",
            "access-token": token,
            "content-type": "text/event-stream",
          },
          signal: controlRef.current.signal,
          openWhenHidden: true,
          onopen: async (response) => {
            if (response.status === 200) {
              console.log("counting...");
              const dateCount = new Date().getTime() + 10 * 60 * 1000;
              setCounterStart(dateCount);
            }
          },
          onmessage: async (ev) => {
            // console.log(data);
            if (ev.data) {
              const parsedData = JSON.parse(ev.data);

              if (parsedData && parsedData.status === 1) {
                //fetch to get paymentmethod
                const response = await checkoutApi.fetchChanelAndMethod();

                if (response.error === 0) {
                  const method = response.data.method?.find(
                    (method) =>
                      method.channelId === bookingChannelMethod.chanel.id
                  );
                  /**
                   * SUBMIT PAYMENT
                   */
                  await handleSubmitPayment({
                    methodId: method?.methodId || "",
                    offer: bookingInfo.offer,
                  });
                }
                /**
                 * CLOSE HUB
                 */
                controlRef.current?.abort();
              } else {
                console.log("sync payment fail", ev.data);
                setModal((prevModal) => ({
                  ...prevModal,
                  isShowModal: true,
                  type: {
                    ...prevModal.type,
                    isPaymentError: true,
                  },
                }));
              }
            }
          },
          onclose: async () => {
            console.log("closed");
          },
        }
      );
    };

    useEffect(() => {
      (async () => {
        const status = searchParams.get("status") || "0";
        const bindingId = searchParams.get("binding_id") || "";
        const bookInfor = JSON.parse(
          localStorage.getItem(StorageKEY.booking) || `{}`
        );
        /**
         * case is zalo type
         */
        if (!isEmpty(bookInfor) && status === "1") {
          const { method } = bookingChannelMethod;
          /**
           * SUBMIT PAYMENT
           */
          if (!isEmpty(method)) {
            await handleSubmitPayment({
              methodId: method.methodId || "",
              offer: bookInfor.data.offer,
            });
          }
        }
      })();
    }, [bookingChannelMethod]);

    const onExpiredPaymentQr = () => {
      /**
       * Stop listen stream
       * Show Modal
       */
      controlRef.current?.abort();
      setModal((prevModal) => ({
        isShowModal: true,
        title: "Phiên giao dịch hết hạn",
        type: {
          ...prevModal.type,
          isTimeout: true,
        },
      }));
    };
    const onRetryPaymentQrcode = ({
      chanelItem,
    }: {
      chanelItem: ChanelItemType;
    }) => {
      setModal({
        isShowModal: false,
        title: "",
        type: {
          isTimeout: false,
          isPaymentFail: false,
          isStreammingFail: false,
          isPaymentSuccess: false,
          isPaymentError: false,
        },
      });
      onSelectPaymentChannel(chanelItem);

      // await onlistenHubPayment({
      //   channelType: channelType,
      //   token: response.syncData.token || "",
      //   offer: bookingInfo.offer,
      // });
    };
    const handlePaymentWebview = () => {};
    return (
      <>
        <Modal
          isOpen={modal.isShowModal}
          width={550}
          isShowCloseIcon={false}
          title={modal.title}
          render={() => <ModalContent type={modal.type} />}
          onSubmit={() => {
            if (modal.type.isPaymentFail || modal.type.isPaymentError) {
              navigate("/");
            } else {
              onRetryPaymentQrcode({
                chanelItem: bookingChannelMethod.chanel,
              });
            }
          }}
        />
        <div className="section section-payment" ref={ref}>
          <div className="section-header center">
            <h2 className="title white">Thanh toán</h2>
          </div>
          <div className="section-body">
            <OrderSummary account={profile} item={bookingInfo.comboItem} />
            <div className="payment-method col-chanel-method">
              <div className="col-header">
                <h3 className="col-title">Phương thức thanh toán</h3>
              </div>
              <div className="col-body">
                <div className="payment-top">
                  <div className="channels">
                    {!isEmpty(channelCampaign) && (
                      <ChannelItem
                        onSelectPaymentChannel={onSelectPaymentChannel}
                        channel={channelCampaign}
                      />
                    )}
                  </div>
                  {(!isEmpty(bookingChannelMethod.chanel) && (
                    <PaymentMethodContainer
                      counterStart={counterStart}
                      offer={bookingInfo.offer}
                      onTimeoutQrcode={onExpiredPaymentQr}
                      paymentData={bookingInfo.paymentData}
                      currentMethod={bookingChannelMethod.method}
                      onSubmitPaymentWebview={handlePaymentWebview}
                      onSubmitPayment={handleSubmitPayment}
                      channelType={channelType}
                      isDesktop={deviceInfo.partner === DeviceType.PC}
                      isLoading={isLoadingQr}
                    />
                  )) || (
                    <div className="empty-channel">
                      <p className="content center">
                        Vui lòng bấm vào {channelType} để thanh toán
                      </p>
                    </div>
                  )}
                </div>
                <PaymentNote />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
);

export default PaymentSection;
