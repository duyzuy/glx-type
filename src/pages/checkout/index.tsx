import React, { useEffect, useMemo, useRef } from "react";
import { Container, Image } from "semantic-ui-react";
import {
  fetchChanelAndMethod,
  fetchVoucherType,
  onSelectCombo,
  onSelectCinema,
  onResetComboSelect,
  onResetPaymentData,
} from "./actions";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { ComboItemType, BookingType, VoucherItemType } from "../../models";
import { isEmpty } from "../../utils/common";
import ComboSection from "./components/ComboSection";
import PaymentSection from "./components/PaymentSection";
import Cinema from "./components/Cinema";
import ContentBox from "./components/ContentBox";
import SectionContent from "./components/SectionContent";
import "./style.scss";
const CheckoutPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const voucherType = useAppSelector<VoucherItemType[]>(
    (state) => state.checkout.voucherType
  );
  const bookingInfo = useAppSelector<BookingType>((state) => state.booking);
  const channelType = useAppSelector((state) => state.chanel.chanelName);

  const controlRef = useRef<AbortController>();
  const comboSectionRef = useRef<HTMLDivElement>(null);
  const paymentSectionRef = useRef<HTMLDivElement>(null);

  const handleSelectCinema = (cinemaItem: VoucherItemType) => {
    dispatch(onSelectCinema(cinemaItem));
    dispatch(onResetComboSelect());
    dispatch(onResetPaymentData());

    const timeOut = setTimeout(() => {
      comboSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      clearTimeout(timeOut);
    });
    controlRef.current?.abort();
  };
  const handleSelectCombo = async (comboItem: ComboItemType) => {
    const response = await dispatch(
      onSelectCombo({ channelType, comboItem })
    ).unwrap();

    if (response.error === 0) {
      dispatch(onResetPaymentData());
      paymentSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    controlRef.current?.abort();
  };

  const isSelectedCinema = useMemo(() => {
    return !isEmpty(bookingInfo.voucherType);
  }, [bookingInfo]);
  const isComboSelected = useMemo(() => {
    return isSelectedCinema && !isEmpty(bookingInfo.comboItem);
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
          {(isSelectedCinema && (
            <ComboSection
              ref={comboSectionRef}
              bookingInfo={bookingInfo}
              onleSelectCombo={handleSelectCombo}
            />
          )) || <></>}
          {(isComboSelected && (
            <PaymentSection
              bookingInfo={bookingInfo}
              channelType={channelType}
              ref={paymentSectionRef}
              controlRef={controlRef}
            />
          )) || <></>}
        </Container>
      </div>
    </div>
  );
};
export default CheckoutPage;
