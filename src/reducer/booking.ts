import { BookingType } from "../models";
import { loginApi } from "../api/login";
import { VoucherItemType, ComboItemType } from "../models";
import {
  createReducer,
  createAsyncThunk,
  createAction,
} from "@reduxjs/toolkit";
import { fetchPromotionsOffer } from "../pages/checkout/actions";
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
  async (args: { chanelType: any; comboItem: ComboItemType }, thunkApi) => {
    const { chanelType, comboItem } = args;
    let data = { comboItem, offer: {} };
    const response = await thunkApi
      .dispatch(
        fetchPromotionsOffer({
          cinemaBranch: comboItem.cinemaId,
          cinemaPackageType: comboItem.type,
          cinemaType: comboItem.ticketType,
        })
      )
      .unwrap();
    console.log({ response, chanelType });
    if (response.error === 0) {
      const { nonPromotionOffers } = response.data;

      const offer = nonPromotionOffers.svod[comboItem.type];
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
      console.log(offer);
    }
    return data;
  }
);
const initialState: BookingType = {
  chanelAndMethod: {
    chanel: {},
    method: {},
  },
  voucherType: {
    id: "",
    ["2d"]: {
      name: "",
      price: 0,
      type: "",
      planId: "",
    },
    ["3d"]: { name: "", price: 0, type: "", planId: "" },
  },
  comboItem: {
    name: "",
    price: 0,
    planId: "",
    type: "",
    cinemaId: "",
    ticketType: "",
  },
  offer: {},
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
});
export default bookingReducer;
