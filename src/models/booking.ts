import {
  ChanelItemType,
  VoucherItemType,
  ComboItemType,
  PaymentDataType,
  MethodItemType,
} from "./common";
import { OfferItemType } from "./offer";
export interface BookingType {
  chanelAndMethod: {
    chanel: ChanelItemType;
    method: MethodItemType;
  };
  voucherType: VoucherItemType;
  comboItem: ComboItemType;
  offer: OfferItemType;
  paymentData: PaymentDataType;
}
