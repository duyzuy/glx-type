import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import OrderSummary from "./OrderSummary";
import { Image } from "semantic-ui-react";
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
import CountdownTimer from "../../../components/CountdownTimer";
import Button from "../../../components/Button";
import * as Icon from "react-feather";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { onSelectPaymentMethod, setChannelAndMethod } from "../actions";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { checkoutApi } from "../../../api/checkout";
import Modal from "../../../components/Modal";
import ModalContent from "./ModalContent";
import { useNavigate } from "react-router";
import { IconScan } from "../../../assets/icons";
import ChannelItem from "./ChannelItem";

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
    const channelAndMethodActive = useAppSelector(
      (state) => state.booking.chanelAndMethod
    );
    const navigate = useNavigate();
    const deviceInfo = useAppSelector((state) => state.chanel.deviceInfo);

    const { paymentData, offer } = bookingInfo;
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
    const onSelectPayment = useCallback(
      async (chanelItem: ChanelItemType) => {
        try {
          const methodActive = method.find(
            (item) => item.channelName === chanelItem.type
          );
          if (methodActive) {
            console.log("method is connected");
          } else {
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
              onSelectPaymentMethod({
                ...paymentParams,
              })
            ).unwrap();
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
        } catch (error) {
          console.log(error);
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
                      method.channelId === channelAndMethodActive.chanel.id
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

      const currChannel = channel.find(
        (item) => item.active && item.type === channelName
      );
      const currMethod = method.find(
        (item) => item.channelName === channelName
      );
      dispatch(
        setChannelAndMethod({
          method: currMethod || {},
          channel: currChannel || {},
        })
      );
    }, [channel, channelType, method]);

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
          const { method } = channelAndMethodActive;
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
    }, [channelAndMethodActive]);

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
      onSelectPayment(chanelItem);

      // await onlistenHubPayment({
      //   channelType: channelType,
      //   token: response.syncData.token || "",
      //   offer: bookingInfo.offer,
      // });
    };
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
                chanelItem: channelAndMethodActive.chanel,
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
                    {(!isEmpty(channelAndMethodActive.chanel) && (
                      <ChannelItem
                        onSelectPayment={onSelectPayment}
                        channel={channelAndMethodActive.chanel}
                      />
                      // <div
                      //   className="channel-item"
                      //   key={channelAndMethodActive.chanel.id}
                      //   onClick={() =>
                      //     onSelectPayment(channelAndMethodActive.chanel)
                      //   }
                      // >
                      //   <div className="icon">
                      //     <Image
                      //       src={channelAndMethodActive.chanel.ico}
                      //       className="method payment"
                      //     />
                      //   </div>
                      // </div>
                    )) || <></>}
                  </div>
                  <div className="payment-content center">
                    {(!isEmpty(channelAndMethodActive.method) && (
                      <>
                        <div className="methods">
                          <div
                            className="method-item"
                            key={channelAndMethodActive.method.methodId}
                            onClick={() =>
                              onSelectPayment(channelAndMethodActive.method)
                            }
                          >
                            <div className="icon">
                              <Image
                                src={channelAndMethodActive.method.ico}
                                className="method payment"
                              />
                            </div>
                            <div className="content">
                              <p className="name">
                                {channelAndMethodActive.method.channelName}
                              </p>
                              <span className="icon-check">
                                <Icon.Check size={12} />
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          color="primary"
                          className="payment-button"
                          onClick={() =>
                            handleSubmitPayment({
                              methodId:
                                channelAndMethodActive.method.methodId || "",
                              offer: bookingInfo.offer,
                            })
                          }
                        >
                          Thanh toán ngay
                        </Button>
                      </>
                    )) ||
                      (!isEmpty(paymentData) && (
                        <div className="payment-data">
                          <div className="qrcode">
                            <Image src={paymentData.qrCodeUrl} />
                          </div>
                          <div className="counter">
                            <CountdownTimer
                              targetDate={counterStart}
                              onExpire={onExpiredPaymentQr}
                            />
                          </div>
                        </div>
                      )) || <></>}
                    {(isEmpty(bookingInfo.chanelAndMethod.method) &&
                      isEmpty(paymentData) && (
                        <p className="content">
                          Vui lòng bấm vào {channelType} để thanh toán
                        </p>
                      )) || <></>}
                  </div>
                </div>
                <div className="payment-note">
                  <div className="box">
                    <div className="content">
                      <div className="content-qrstep">
                        <p>Bước 1: Mở ứng dụng và đăng nhập ZaloPay</p>
                        <p>
                          Bước 2: Bấm chọn icon
                          <img
                            src={IconScan}
                            width={12}
                            className="ico-scan"
                            style={{ marginLeft: "3px", marginRight: "3px" }}
                          />
                          ở góc phải phía trên màn hình để quét QR Code
                        </p>
                        <p>Bước 3: Bấm chọn “Xác nhận” để thanh toán</p>
                      </div>
                      <div className="content-note">
                        <p className="text center">
                          Bằng việc thanh toán, Quý khách đã đồng ý với Quy chế
                          sử dụng Dịch vụ của Galaxy Play và ủy quyền cho Galaxy
                          Play tự động gia hạn khi hết hạn sử dụng, cho đến khi
                          bạn hủy tự động gia hạn.
                        </p>
                        <div className="secures">
                          <div className="icon">
                            <Image
                              src={`${process.env.PUBLIC_URL}/images/shopee/ssl-secured.png`}
                              width={100}
                              className="img-sc"
                            />
                          </div>
                          <div className="icon">
                            <Image
                              src={`${process.env.PUBLIC_URL}/images/shopee/DSS-PCI.png`}
                              width={100}
                              className="img-sc"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
);

export default PaymentSection;
