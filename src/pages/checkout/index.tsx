import React, { useEffect, useMemo } from "react";
import { Container, Image } from "semantic-ui-react";
import { onSelectCinema, onSelectCombo } from "../../reducer/booking";
import {
  fetchChanelAndMethod,
  fetchVoucherType,
  onSelectPaymentMethod,
} from "./actions";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Cinema from "./components/Cinema";
import ContentBox from "./components/ContentBox";
import ComboItem from "./components/ComboItem";
import OrderSummary from "./components/OrderSummary";
import SectionContent from "./components/SectionContent";
import {
  TicketKeys,
  ComboItemType,
  BookingType,
  VoucherItemType,
  WalletName,
  ChanelItemType,
} from "../../models";

import "./style.scss";
import { checkoutApi } from "../../api/checkout";
import { isEmpty } from "../../utils/common";
const CheckoutPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const voucherType = useAppSelector<VoucherItemType[]>(
    (state) => state.checkout.voucherType
  );
  const bookingInfo = useAppSelector<BookingType>((state) => state.booking);
  const profile = useAppSelector((state) => state.userInfo.profile);
  const chanelType = useAppSelector((state) => state.chanel.chanelName);
  const deviceInfo = useAppSelector((state) => state.chanel.deviceInfo);
  const paymentData = useAppSelector((state) => state.booking.paymentData);
  const { channel, method } = useAppSelector(
    (state) => state.checkout.chanelAndMethod
  );

  const handleSelectCinema = (cinemaItem: VoucherItemType) => {
    dispatch(onSelectCinema(cinemaItem));
  };
  const handleSelectCombo = async (comboItem: ComboItemType) => {
    const response = await dispatch(
      onSelectCombo({ chanelType, comboItem })
    ).unwrap();
  };

  const isSelectedCinema = useMemo(() => {
    return bookingInfo.voucherType.id !== "";
  }, [bookingInfo]);
  const isComboSelected = useMemo(() => {
    return isSelectedCinema && !isEmpty(bookingInfo.comboItem);
  }, [isSelectedCinema, bookingInfo]);

  const channelsActive = useMemo(() => {
    let type = "";
    switch (chanelType) {
      case "zalo": {
        type = WalletName.ZALOPAY;
        break;
      }
      case "shopee": {
        type = WalletName.SHOPEEPAY;
        break;
      }
      case "momo": {
        type = WalletName.MOMO;
        break;
      }
      case "vnpay": {
        type = WalletName.VNPAY;
        break;
      }
      case "moca": {
        type = WalletName.MOCA;
        break;
      }
      case "fundin": {
        type = WalletName.FUNDIIN;
        break;
      }
      case "asiapay": {
        type = WalletName.ASIAPAY;
        break;
      }
    }
    return channel.filter((item) => item.active && item.type === type);
  }, [channel, chanelType]);

  const onSelectPayment = async (chanelItem: ChanelItemType) => {
    console.log(chanelItem);
    try {
      let paymentParams = {
        channelType: chanelType,
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
        onSelectPaymentMethod(paymentParams)
      ).unwrap();
      console.log({ response });
      /**
       * listen event hub
       */
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

  return (
    <div className={`page checkout ${chanelType}`}>
      <div className="inner-page">
        <Container>
          <section className="section-top">
            <Image
              src={`${process.env.PUBLIC_URL}/images/${chanelType}/combo-top.png`}
              alt="promotion checkout"
            />
          </section>
          <SectionContent chanel={chanelType} />
          <Cinema
            lists={voucherType}
            onSelectCinema={handleSelectCinema}
            selectedItem={bookingInfo.voucherType}
            channel={chanelType}
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
                    <div className="methods">
                      <>
                        {channelsActive?.map((item) => (
                          <div
                            className="method-item"
                            key={item.id}
                            onClick={() => onSelectPayment(item)}
                          >
                            <div className="icon">
                              <Image
                                src={item.ico}
                                className="method payment"
                              />
                            </div>
                          </div>
                        ))}
                      </>
                    </div>
                    <div className="payment-content">
                      {(paymentData && (
                        <div className="data">
                          <Image src={paymentData["qrcode_url"] || ""} />
                          <div className="countdown">
                            <p className="white center">
                              <span className="hours">0</span>
                              <span className="minute">0</span>
                              <span className="seconds">0</span>
                            </p>
                          </div>
                        </div>
                      )) || <></>}
                      <div className="">
                        <p className="white center">
                          Vui lòng bấm vào {chanelType} để thanh toán
                        </p>
                      </div>
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
