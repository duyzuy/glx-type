import React, {
  useEffect,
  useMemo,
  useRef,
  useCallback,
  useState,
} from "react";
import { Container, Image } from "semantic-ui-react";
import { onSelectCinema, onSelectCombo } from "../../reducer/booking";
import {
  fetchChanelAndMethod,
  fetchVoucherType,
  onSelectPaymentMethod,
  onlistenHubPayment,
  setChannelAndMethod,
} from "./actions";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Cinema from "./components/Cinema";
import ContentBox from "./components/ContentBox";
import ComboItem from "./components/ComboItem";
import OrderSummary from "./components/OrderSummary";
import SectionContent from "./components/SectionContent";
import Button from "../../components/Button";
import {
  TicketKeys,
  ComboItemType,
  BookingType,
  VoucherItemType,
  WalletName,
  ChanelItemType,
  OfferItemType,
} from "../../models";

import "./style.scss";
import { isEmpty } from "../../utils/common";
import { checkoutApi } from "../../api/checkout";
import * as Icon from "react-feather";
import CountdownTimer from "../../components/CountdownTimer";
const CheckoutPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const voucherType = useAppSelector<VoucherItemType[]>(
    (state) => state.checkout.voucherType
  );
  const bookingInfo = useAppSelector<BookingType>((state) => state.booking);
  const profile = useAppSelector((state) => state.userInfo.profile);
  const channelType = useAppSelector((state) => state.chanel.chanelName);
  const deviceInfo = useAppSelector((state) => state.chanel.deviceInfo);
  const paymentData = useAppSelector((state) => state.booking.paymentData);
  const controlRef = useRef();
  const [counter, setCounter] = useState(0);
  const { channel, method } = useAppSelector(
    (state) => state.checkout.chanelAndMethod
  );
  const channelAndMethodActive = useAppSelector(
    (state) => state.booking.chanelAndMethod
  );
  const handleSelectCinema = (cinemaItem: VoucherItemType) => {
    dispatch(onSelectCinema(cinemaItem));
  };
  const handleSelectCombo = async (comboItem: ComboItemType) => {
    const response = await dispatch(
      onSelectCombo({ channelType, comboItem })
    ).unwrap();
  };

  const isSelectedCinema = useMemo(() => {
    return bookingInfo.voucherType.id !== "";
  }, [bookingInfo]);
  const isComboSelected = useMemo(() => {
    return isSelectedCinema && !isEmpty(bookingInfo.comboItem);
  }, [isSelectedCinema, bookingInfo]);

  const onSelectPayment = useCallback(
    async (chanelItem: ChanelItemType) => {
      try {
        const methodActive = method.find(
          (item) => item.channelName === chanelItem.type
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
        const dateCount = new Date().getTime() + 1 * 60 * 1000;
        setCounter(() => dateCount);
        const response = await dispatch(
          onSelectPaymentMethod({
            ...paymentParams,
          })
        ).unwrap();
        /**
         * listen event hub
         */
        if (!methodActive) {
          await dispatch(
            onlistenHubPayment({
              channelType: channelType,
              token: response.syncData.token || "",
              offer: bookingInfo.offer,
            })
          );
        }
      } catch (error) {
        console.log(error);
      }
    },
    [channelType, profile, deviceInfo, bookingInfo]
  );
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
    (async () => {
      Promise.all([
        await dispatch(fetchChanelAndMethod()),
        await dispatch(fetchVoucherType()),
      ]);
    })();
  }, []);

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
    const currMethod = method.find((item) => item.channelName === channelName);
    dispatch(
      setChannelAndMethod({
        method: currMethod || {},
        channel: currChannel || {},
      })
    );
  }, [channel, channelType, method]);
  return (
    <div className={`page checkout ${channelType}`}>
      <div className="inner-page">
        <Container>
          <section className="section-top">
            <Image
              src={`${process.env.PUBLIC_URL}/images/${channelType}/combo-top.png`}
              alt="promotion checkout"
            />
          </section>
          <SectionContent chanel={channelType} />
          <Cinema
            lists={voucherType}
            onSelectCinema={handleSelectCinema}
            selectedItem={bookingInfo.voucherType}
            channel={channelType}
          />
          <ContentBox />
          <div className="section section-combo">
            <div className="commbo-list">
              {(isSelectedCinema && (
                <>
                  {bookingInfo.voucherType[TicketKeys.Two] && (
                    <ComboItem
                      cinemaId={bookingInfo.voucherType.id || ""}
                      ticketType={TicketKeys.Two}
                      data={bookingInfo.voucherType[TicketKeys.Two]}
                      onSelect={handleSelectCombo}
                      itemSelected={bookingInfo.comboItem}
                    />
                  )}
                  {bookingInfo.voucherType[TicketKeys.Third] && (
                    <ComboItem
                      cinemaId={bookingInfo.voucherType.id || ""}
                      ticketType={TicketKeys.Third}
                      data={bookingInfo.voucherType[TicketKeys.Third]}
                      onSelect={handleSelectCombo}
                      itemSelected={bookingInfo.comboItem}
                    />
                  )}
                </>
              )) || <></>}
            </div>
          </div>
          {(isComboSelected && (
            <div className="section section-payment">
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
                      <>
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
                      </>
                    </div>
                    <div className="payment-content">
                      {(!isEmpty(paymentData) && (
                        <div className="data">
                          <Image src={paymentData.qrCodeUrl} />
                          <div className="counter">
                            <CountdownTimer targetDate={counter} />
                          </div>
                        </div>
                      )) || <></>}
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
                          <div className="buttons">
                            <Button
                              color="primary"
                              onClick={() =>
                                handleSubmitPayment({
                                  methodId:
                                    channelAndMethodActive.method.methodId ||
                                    "",
                                  offer: bookingInfo.offer,
                                })
                              }
                            >
                              Thanh toan
                            </Button>
                          </div>
                        </>
                      )) || <></>}
                      {isEmpty(bookingInfo.chanelAndMethod.method) ||
                        (isEmpty(paymentData) && (
                          <p className="white center">
                            Vui lòng bấm vào {channelType} để thanh toán
                          </p>
                        )) || <></>}
                    </div>
                    <div className="payment-note">
                      <div className="box center white">
                        <div className="content">
                          <p className="text">
                            Bằng việc thanh toán, Quý khách đã đồng ý với Quy
                            chế sử dụng Dịch vụ của Galaxy Play và ủy quyền cho
                            Galaxy Play tự động gia hạn khi hết hạn sử dụng, cho
                            đến khi bạn hủy tự động gia hạn.
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
          )) || <></>}
        </Container>
      </div>
    </div>
  );
};
export default CheckoutPage;
