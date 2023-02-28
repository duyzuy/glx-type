import { BookingType } from "../models";
import { loginApi } from "../api/login";
import {
  createReducer,
  createAsyncThunk,
  createAction,
} from "@reduxjs/toolkit";
import { StorageKEY } from "../models";
import { toast } from "../libs/toast";
import { string } from "yup";
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
};

const bookingReducer = createReducer(initialState, (builder) => {});
export default bookingReducer;
