import React, { useEffect } from "react";
import { useParams } from "react-router";
import { Container, Grid, Image } from "semantic-ui-react";
import SectionContent from "./components/SectionContent";
import { fetchChanelAndMethod, fetchVoucherType } from "./actions";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Cinema from "./components/Cinema";
import ContentBox from "./components/ContentBox";
import { VoucherItemType } from "../../models";
import { onSelectCinema } from "../../reducer/booking";
import "./style.scss";

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
              src={`${process.env.PUBLIC_URL}/images/${chanelType}/image-checkout-top.png`}
              alt="zalo promotion checkout"
            />
          </section>
          <SectionContent chanel={chanelType} />
          <Cinema
            lists={voucherType}
            onSelectCinema={handleSelectCinema}
            selectedItem={bookingInfo.voucherType}
          />
          <ContentBox />
        </Container>
      </div>
    </div>
  );
};
export default CheckoutPage;
