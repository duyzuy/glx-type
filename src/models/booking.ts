import {
  ChannelItemType,
  VoucherItemType,
  ComboItemType,
  PaymentDataType,
  MethodItemType,
} from "./common";
import { OfferItemType } from "./offer";

export interface BookingType {
  channelAndMethod: {
    channel: ChannelItemType;
    method: MethodItemType;
  };
  voucherType: VoucherItemType;
  comboItem: ComboItemType;
  offer: OfferItemType;
  paymentData: PaymentDataType;
}
