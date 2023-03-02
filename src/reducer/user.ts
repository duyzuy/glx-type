import { UserInfoType } from "../models";
import { loginApi } from "../api/login";
import {
  createReducer,
  createAsyncThunk,
  createAction,
} from "@reduxjs/toolkit";
import { StorageKEY } from "../models";
import { toast } from "../libs/toast";
const initialState: UserInfoType = {
  profile: {},
  token: "",
  isLogedin: false,
};
const logout = createAction("chanel/userLogout", () => {
  localStorage.removeItem(StorageKEY.authToken);
  localStorage.removeItem(StorageKEY.refreshToken);
  return {
    payload: {
      token: "",
      profile: {},
      isLogedin: false,
    },
  };
});

const forgotPassword = createAsyncThunk(
  "user/forgotPassowrd",
  async (phone: string) => {
    let dataResponse: { data: { [key: string]: any } } = { data: {} };
    try {
      const response = await loginApi.forgotPassword({ phone });

      dataResponse = {
        ...dataResponse,
        data: response.data,
      };
    } catch (error) {
      console.log(error);
    }

    return dataResponse;
  }
);
const fetchUserInfo = createAsyncThunk(
  "user/fetchUserInfo",
  async (token: string, thunkAPI) => {
    let userData: {
      token: string;
      data: { [key: string]: any };
      isLogedin: boolean;
    } = { token: "", data: {}, isLogedin: false };
    try {
      const response = await loginApi.getUserInfor(token);

      if (
        response.errorCode &&
        (response.errorCode === 498 || response.errorCode === 9000)
      ) {
        //498 token expired
        //9000 no valid token
        userData.data = response;
        // toast({
        //   type: "error",
        //   message: response.reason,
        // });
        thunkAPI.dispatch(logout());
      } else {
        //logedin
        userData = {
          ...userData,
          isLogedin: true,
          token: token,
          data: response,
        };
      }
    } catch (error) {
      console.log(error);
    }

    return userData;
  }
);

const makeLogin = createAsyncThunk(
  "user/makeLogin",
  async ({ phone, password }: { phone: string; password: string }) => {
    let loginData: {
      token?: string;
      data?: { [key: string]: any };
      isLogedin: boolean;
    } = {
      token: "",
      data: {},
      isLogedin: false,
    };
    try {
      const response = await loginApi.makeLogin({
        phone,
        password,
      });
      if (response.data.statusCode === 400) {
        loginData = {
          token: "",
          data: response.data,
          isLogedin: false,
        };
      } else {
        const userInfo = await loginApi.getUserInfor(response.token);
        localStorage.setItem(StorageKEY.authToken, response.token);
        localStorage.setItem(StorageKEY.refreshToken, response.rfToken);

        loginData = {
          token: response.token,
          data: userInfo,
          isLogedin: true,
        };
      }
    } catch (error) {
      console.log(error);
    }

    return loginData;
  }
);

const loginWithOtpCode = createAsyncThunk(
  "user/loginWithOtpCode",
  async ({ phone, code }: { phone: string; code: string }) => {
    let loginData: { token: string; data?: { [key: string]: any } } = {
      token: "",
      data: {},
    };
    try {
      const response = await loginApi.makeLogin({
        phone,
        code,
      });
      if (response.data.Status === 1) {
        loginData.token = response.token;
        loginData.data = response.data;
        toast({
          type: "success",
          message: "Xác thực thành công, vui lòng nhập mật khẩu mới",
        });
      }
      if (response.data.statusCode === 400) {
        toast({
          type: "error",
          message: response.data.message,
        });
        loginData.data = response.data;
      }
    } catch (error) {
      console.log(error);
    }

    return loginData;
  }
);

const userReducer = createReducer(initialState, (builder) => {
  builder.addCase(loginWithOtpCode.fulfilled, (state, action) => {
    return {
      ...state,
      token: action?.payload?.token,
    };
  });
  builder.addCase(logout, (state, action) => {
    return {
      ...action.payload,
    };
  });
  builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
    return {
      ...state,
      token: action.payload.token,
      profile: { ...action.payload.data },
      isLogedin: action.payload.isLogedin,
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
      isLogedin: action.payload.isLogedin,
    };
  });
});
export default userReducer;
export { fetchUserInfo, makeLogin, logout, forgotPassword, loginWithOtpCode };
