import React from "react";
import { loginApi } from "../../api/login";
import { StorageKEY } from "../../models";
import client from "../../api/client";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchDeviceInfo = createAsyncThunk(
  "chanel/fetchDeviceInfo",
  async (deviceInfor: any) => {
    let data = { token: "", ipAddress: "", device: {} };
    const bodyParams = {
      app_version: "2.0.0",
      modelId: deviceInfor.browser,
      modelName: "108",
      os: deviceInfor.os,
      os_version: deviceInfor.osVer,
      partner: deviceInfor.partner,
      platform: "web",
    };
    const deviceToken = localStorage.getItem(StorageKEY.deviceToken);
    const ipAddress = localStorage.getItem(StorageKEY.ipAddress) || "";

    if (deviceToken) {
      data = {
        token: deviceToken,
        ipAddress: ipAddress,
        device: bodyParams,
      };
    } else {
      try {
        const response: {
          headers: Headers;
          data: { [keyName: string]: any };
          status: number;
        } = await client.post(`account/device/new`, {
          body: {
            ...bodyParams,
          },
        });

        if (response.status === 200) {
          const token = response.headers.get("x-fim-gtoken") || "";
          localStorage.setItem(StorageKEY.ipAddress, response.data.ip);
          localStorage.setItem(StorageKEY.deviceToken, token);
          data = {
            token: token,
            ipAddress: response.data.ip,
            device: bodyParams,
          };
        }
      } catch (error) {
        console.log(error);
      }
    }
    return data;
  }
);

export const fetchCampaignInfo = createAsyncThunk(
  "chanel/fetchCampaignInfo",
  async ({ token = "" }: { token: string }) => {
    try {
      const response = await client.post(`promotion/v2/checkCampaignAcitve`, {
        body: {
          campaignId: [process.env.REACT_APP_CAMPAIGN_ID],
          eventPage: process.env.REACT_APP_EVENT_PAGE,
        },
        headers: {
          "access-token": token,
        },
      });

      localStorage.setItem(
        StorageKEY.campaignStatus,
        JSON.stringify({ isActive: response.data.data })
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const createAccount = createAsyncThunk(
  "chanel/createAccount",
  async ({ phone = "", code = "" }: { phone: string; code: string }) => {
    try {
      const response = await loginApi.createAccount({
        phone,
        code,
      });

      return response;
    } catch (error) {
      console.log(error);
    }
  }
);

export const fetchOffer = createAsyncThunk(
  "chanel/fetchOffer",
  async ({ phone }: { phone: string | undefined }) => {
    try {
      const getOffer = await loginApi.getOffer({
        phone: phone,
      });
      return getOffer;
    } catch (error) {
      console.log(error);
    }
  }
);

export const verifyPhoneNumber = createAsyncThunk(
  "chanel/verifyPhoneNumber",
  async (phone: string) => {
    try {
      const response = await loginApi.verifyPhoneNumber(phone);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
);

export const createPassword = createAsyncThunk(
  "chanel/createPassword",
  async ({ password, token }: { password: string; token: string }) => {
    try {
      const response = await loginApi.createPassword({
        password,
        token,
      });

      return response;
    } catch (error) {
      console.log(error);
    }
  }
);
