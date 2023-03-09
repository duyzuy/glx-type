import React from "react";
import { BookingType, ComboItemType, VoucherItemType } from "../../../models";
import ComboItem from "./ComboItem";
import { ticketKeys } from "../../../constants/common";
type PropsType = {
  bookingInfo: BookingType;
  onleSelectCombo: (item: ComboItemType) => void;
};
const ComboSection = React.forwardRef<HTMLDivElement, PropsType>(
  ({ bookingInfo, onleSelectCombo }, ref) => {
    return (
      <div className="section section-combo" ref={ref}>
        <div className="commbo-list">
          {ticketKeys.map(
            (key) =>
              bookingInfo.voucherType[
                key as keyof Omit<VoucherItemType, "id">
              ] && (
                <ComboItem
                  key={key}
                  cinemaId={bookingInfo.voucherType.id || ""}
                  ticketType={key as keyof VoucherItemType}
                  data={
                    bookingInfo.voucherType[
                      key as keyof Omit<VoucherItemType, "id">
                    ] || {}
                  }
                  onSelect={onleSelectCombo}
                  itemSelected={bookingInfo.comboItem}
                />
              )
          )}
        </div>
      </div>
    );
  }
);
export default ComboSection;
