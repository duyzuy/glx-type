import React, { useEffect } from "react";
import { useParams } from "react-router";
import { Container, Grid, Image } from "semantic-ui-react";
import SectionContent from "./components/SectionContent";
import { fetchChanelAndMethod, fetchVoucherType } from "./actions";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Cinema from "./components/Cinema";
import ContentBox from "./components/ContentBox";
import { VoucherItemType } from "../../models";
import { onSelectCinema, onSelectCombo } from "../../reducer/booking";
import "./style.scss";
import ComboItem from "./components/ComboItem";
import { TicketKeys, ComboItemType } from "../../models";
type ComboKeyType = keyof typeof TicketKeys;
const CheckoutPage = () => {
  const { chanelType = "" } = useParams();
  const dispatch = useAppDispatch();
  const voucherType = useAppSelector((state) => state.checkout.voucherType);
  const bookingInfo = useAppSelector((state) => state.booking);

  const channelAndMethod = useAppSelector(
    (state) => state.checkout.chanelAndMethod
  );

  const handleSelectCinema = (cinemaItem: VoucherItemType) => {
    dispatch(onSelectCinema(cinemaItem));
  };
  const handleSelectCombo = (comboItem: ComboItemType) => {
    dispatch(onSelectCombo(comboItem));
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
              {(bookingInfo.voucherType.id && (
                <>
                  {Object.keys(TicketKeys).map(
                    (key: ComboKeyType) =>
                      bookingInfo.voucherType[TicketKeys[key]] && (
                        <ComboItem
                          cinemaId={bookingInfo.voucherType.id}
                          ticketType={TicketKeys[key]}
                          data={bookingInfo.voucherType[TicketKeys[key]]}
                          onSelect={handleSelectCombo}
                        />
                      )
                  )}
                  {/* 
                  {bookingInfo.voucherType[TicketKeys.Third] && (
                    <ComboItem
                      cinemaId={bookingInfo.voucherType.id}
                      ticketType={TicketKeys.Third}
                      data={bookingInfo.voucherType[TicketKeys.Third]}
                      onSelect={handleSelectCombo}
                    />
                  )} */}
                </>
              )) || <></>}
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};
export default CheckoutPage;
