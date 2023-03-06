import { BookingType, OfferItemType } from "../models";

import { VoucherItemType, ComboItemType } from "../models";
import {
  createReducer,
  createAsyncThunk,
  createAction,
} from "@reduxjs/toolkit";
import {
  fetchPromotionsOffer,
  onSelectPaymentMethod,
} from "../pages/checkout/actions";
import { WalletName } from "../models";

export const onSelectCinema = createAction(
  "booking/onSelectCinema",
  (cinemaItem: VoucherItemType) => {
    return {
      payload: { ...cinemaItem },
    };
  }
);
export const onSelectCombo = createAsyncThunk(
  "booking/onSelectCombo",
  async (args: { chanelType: string; comboItem: ComboItemType }, thunkApi) => {
    const { chanelType, comboItem } = args;
    let data: { comboItem: ComboItemType; offer: OfferItemType } = {
      comboItem,
      offer: {},
    };
    const response = await thunkApi
      .dispatch(
        fetchPromotionsOffer({
          cinemaBranch: comboItem.cinemaId || "",
          cinemaPackageType: comboItem.type || "",
          cinemaType: comboItem.ticketType || "",
        })
      )
      .unwrap();

    if (response.error === 0) {
      const { nonPromotionOffers } = response.data;

      const offer = nonPromotionOffers.svod[comboItem.type || ""];
      switch (chanelType) {
        case "zalo": {
          data.offer = offer[WalletName.ZALOPAY][0];
          break;
        }
        case "shopee": {
          data.offer = offer[WalletName.SHOPEEPAY][0];
          break;
        }
        case "vnpay": {
          data.offer = offer[WalletName.VNPAY][0];
          break;
        }
        case "moca": {
          data.offer = offer[WalletName.MOCA][0];
          break;
        }
      }
    }
    return data;
  }
);

const initialState: BookingType = {
  chanelAndMethod: {
    chanel: {},
    method: {},
  },
  voucherType: {},
  comboItem: {},
  offer: {},
  paymentData: {},
};

const bookingReducer = createReducer(initialState, (builder) => {
  builder.addCase(onSelectCinema, (state, action) => {
    return {
      ...state,
      voucherType: {
        ...action.payload,
      },
    };
  });
  builder.addCase(onSelectCombo.fulfilled, (state, action) => {
    return {
      ...state,
      comboItem: {
        ...action.payload.comboItem,
      },
      offer: {
        ...action.payload.offer,
      },
    };
  });
  builder.addCase(onSelectPaymentMethod.fulfilled, (state, action) => {
    return {
      ...state,
      paymentData: {
        ...action.payload.syncData,
      },
      chanelAndMethod: {
        method: { ...action.payload.method },
        chanel: { ...action.payload.channel },
      },
    };
  });
});
export default bookingReducer;
