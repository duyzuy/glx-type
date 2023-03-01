import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router";
import { Container, Grid, Image } from "semantic-ui-react";
import SectionContent from "./components/SectionContent";
import { fetchChanelAndMethod, fetchVoucherType } from "./actions";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Cinema from "./components/Cinema";
import ContentBox from "./components/ContentBox";
import { onSelectCinema, onSelectCombo } from "../../reducer/booking";
import "./style.scss";
import ComboItem from "./components/ComboItem";
import OrderSummary from "./components/OrderSummary";
import {
  TicketKeys,
  ComboItemType,
  BookingType,
  VoucherItemType,
} from "../../models";

const CheckoutPage = () => {
  const { chanelType = "" } = useParams();
  const dispatch = useAppDispatch();
  const voucherType = useAppSelector<VoucherItemType[]>(
    (state) => state.checkout.voucherType
  );
  const bookingInfo = useAppSelector<BookingType>((state) => state.booking);
  const profile = useAppSelector((state) => state.userInfo.profile);

  const channelAndMethod = useAppSelector(
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
    return isSelectedCinema && bookingInfo.comboItem.planId !== "";
  }, [isSelectedCinema, bookingInfo]);
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
                      cinemaId={bookingInfo.voucherType.id}
                      ticketType={TicketKeys.Two}
                      data={bookingInfo.voucherType[TicketKeys.Two]}
                      onSelect={handleSelectCombo}
                      itemSelected={bookingInfo.comboItem}
                    />
                  )}
                  {bookingInfo.voucherType[TicketKeys.Third] && (
                    <ComboItem
                      cinemaId={bookingInfo.voucherType.id}
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
                      <div className="method-item">
                        <div className="icon">
                          <Image
                            src={`${process.env.PUBLIC_URL}/images/${chanelType}/logo-partner.svg`}
                            className="method payment"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="white center">
                      <p> Vui lòng bấm vào để thanh toán</p>
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
