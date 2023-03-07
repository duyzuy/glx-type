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
  setChannelAndMethod,
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
  async (args: { channelType: string; comboItem: ComboItemType }, thunkApi) => {
    const { channelType, comboItem } = args;
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
      switch (channelType) {
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
    };
  });
  builder.addCase(setChannelAndMethod, (state, action) => {
    return {
      ...state,
      chanelAndMethod: {
        chanel: { ...action.payload.channel },
        method: { ...action.payload.method },
      },
    };
  });
});
export default bookingReducer;
