import { UserInfo } from "../models";
import { loginApi } from "../api/login";
import { createReducer, createAsyncThunk } from "@reduxjs/toolkit";
import { StorageKEY } from "../models";
const initialState: UserInfo = {
  profile: {
    phone: "",
    email: "",
  },
  token: "",
};

const fetchUserInfo = createAsyncThunk(
  "chanel/fetchUserInfo",
  async (token: string) => {
    const response = await loginApi.getUserInfor(token);
    return response;
  }
);

const makeLogin = createAsyncThunk(
  "chanel/makeLogin",
  async ({ phone, password }: { phone: string; password: string }) => {
    try {
      const response = await loginApi.makeLogin({
        phone,
        password,
      });
      if (response.data.statusCode === 400) {
        return {
          token: "",
          data: { ...response.data },
        };
      } else {
        const userInfo = await loginApi.getUserInfor(response.token);
        localStorage.setItem(StorageKEY.authToken, response.token);
        localStorage.setItem(StorageKEY.refreshToken, response.rfToken);
        return {
          token: response.token,
          data: userInfo,
        };
      }
    } catch (error) {
      console.log(error);
    }
  }
);

const userReducer = createReducer(initialState, (builder) => {
  builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
    return {
      ...state,
      profile: { ...action.payload },
    };
  });
  builder.addCase(makeLogin.fulfilled, (state, action) => {
    return {
      ...state,
      profile: {
        ...state.profile,
        ...action?.payload?.data,
      },
      token: action?.payload?.token || "",
    };
  });
});
export default userReducer;
export { fetchUserInfo, makeLogin };
