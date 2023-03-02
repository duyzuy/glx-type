import { ChanelItemType, VoucherItemType, ComboItemType } from "./common";
import { OfferItemType } from "./offer";
export interface BookingType {
  chanelAndMethod: {
    chanel: ChanelItemType;
    method: {};
  };
  voucherType: VoucherItemType;
  comboItem: ComboItemType;
  offer: OfferItemType;
  paymentData: { [key: string]: any };
}
