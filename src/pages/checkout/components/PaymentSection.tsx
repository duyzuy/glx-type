import React, { useCallback, useEffect, useState } from "react";
import OrderSummary from "./OrderSummary";
import { Image } from "semantic-ui-react";
import {
  BookingType,
  ChanelItemType,
  WalletName,
  OfferItemType,
} from "../../../models";
import { isEmpty } from "../../../utils/common";
import CountdownTimer from "../../../components/CountdownTimer";
import Button from "../../../components/Button";
import * as Icon from "react-feather";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { onSelectPaymentMethod, setChannelAndMethod } from "../actions";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { checkoutApi } from "../../../api/checkout";
type PropsType = {
  children?: JSX.Element;
  bookingInfo: BookingType;
  onSubmitPayment?: (args: { methodId: string; offer: OfferItemType }) => void;
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
    const deviceInfo = useAppSelector((state) => state.chanel.deviceInfo);
    const { paymentData } = bookingInfo;

    const [counter, setCounter] = useState(0);
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
              console.log("start count");
              const dateCount = new Date().getTime() + 1 * 20 * 1000;
              setCounter(() => dateCount);
            }
          },
          onmessage: async (data) => {
            // console.log(data);
          },
          onclose: async () => {
            console.log("closed");
          },
        }
      );
    };

    const handleSubmitPayment = async ({
      methodId,
      offer,
    }: {
      methodId: string;
      offer: OfferItemType;
    }) => {
      try {
        // const paymentResponse = await checkoutApi.makePayment({
        //   methodId,
        //   offer,
        // });
        // console.log({ paymentResponse });
      } catch (error) {
        console.log(error);
      }
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
    return (
      <div className="section section-payment" ref={ref}>
        <div className="section-header center">
          <h2 className="title white">Thanh toán</h2>
        </div>
        <div className="section-body">
          <OrderSummary account={profile} item={bookingInfo.comboItem} />
          <div className="payment-method">
            <div className="section-header center">
              <h2 className="title white">Phương thức thanh toán</h2>
            </div>
            <div className="col-body">
              <div className="channels">
                {(!isEmpty(channelAndMethodActive.chanel) && (
                  <div
                    className="channel-item"
                    key={channelAndMethodActive.chanel.id}
                    onClick={() =>
                      onSelectPayment(channelAndMethodActive.chanel)
                    }
                  >
                    <div className="icon">
                      <Image
                        src={channelAndMethodActive.chanel.ico}
                        className="method payment"
                      />
                    </div>
                  </div>
                )) || <></>}
              </div>
              <div className="payment-content">
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
                    <div className="data">
                      <Image src={paymentData.qrCodeUrl} />
                      <div className="counter">
                        <CountdownTimer targetDate={counter} />
                      </div>
                    </div>
                  )) || <></>}
                {(isEmpty(bookingInfo.chanelAndMethod.method) &&
                  isEmpty(paymentData) && (
                    <p className="white center">
                      Vui lòng bấm vào {channelType} để thanh toán
                    </p>
                  )) || <></>}
              </div>
              <div className="payment-note">
                <div className="box center white">
                  <div className="content">
                    <p className="text">
                      Bằng việc thanh toán, Quý khách đã đồng ý với Quy chế sử
                      dụng Dịch vụ của Galaxy Play và ủy quyền cho Galaxy Play
                      tự động gia hạn khi hết hạn sử dụng, cho đến khi bạn hủy
                      tự động gia hạn.
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
    );
  }
);

export default PaymentSection;
