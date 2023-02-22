import React, { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Container, Grid, Image } from "semantic-ui-react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { loginApi } from "../../api/login";
import "./style.scss";
import Modal from "../../components/Modal";
import ModalContent from "./components/ModalContent";
import { loginSchema } from "../../utils/validator";
import * as yup from "yup";
import { StorageKEY } from "../../models";
import { FETCH_CAMPAIGN_INFOR, FETCH_USER_INFO } from "../../constants/actions";
import { useDispatch } from "../../provider/hooks";
interface Props {
  children?: JSX.Element;
}
enum RegisterKeys {
  phoneNumber = "phoneNumber",
  otpCode = "otpCode",
  password = "password",
  nextAction = "nextAction",
  token = "token",
  rfToken = "rfToken",
}
interface FormRegister {
  [RegisterKeys.phoneNumber]: string;
  [RegisterKeys.password]: string;
  [RegisterKeys.otpCode]: string;
  [RegisterKeys.token]: string;
  [RegisterKeys.rfToken]: string;
  [RegisterKeys.nextAction]: LoginActions;
}
enum LoginActions {
  CheckAccount = "CheckAccount",
  VerifyOTP = "VerifyOTP",
  Login = "Login",
  CreatePassword = "CreatePassword",
  ForgotPassword = "ForgotPassword",
}
const ChanelPage: React.FC<Props> = (props) => {
  const { chanelType } = useParams();
  const dispatch = useDispatch();
  const [loginData, setLoginData] = useState<FormRegister>({
    phoneNumber: "",
    otpCode: "",
    password: "",
    token: "",
    rfToken: "",
    nextAction: LoginActions.CheckAccount,
  });
  const [formState, setFormState] = useState<{
    isShowPassword: boolean;
    isShowOTP: boolean;
    isShowModal: boolean;
  }>({
    isShowPassword: false,
    isShowOTP: false,
    isShowModal: false,
  });
  const [errors, setErrors] = useState<{
    [RegisterKeys.phoneNumber]?: string;
    [RegisterKeys.password]?: string;
    [RegisterKeys.otpCode]?: string;
  }>({});

  const onResetAll = () => {
    setLoginData((prevState) => ({
      ...prevState,
      password: "",
      otpCode: "",
      token: "",
      rfToken: "",
      nextAction: LoginActions.CheckAccount,
    }));
    setFormState({
      isShowPassword: false,
      isShowOTP: false,
      isShowModal: false,
    });
    setErrors({});
  };
  const onChange = (key: string, value: string) => {
    console.log(key);
    if (key === RegisterKeys.phoneNumber) {
      onResetAll();
    }
    setLoginData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };
  const onHandleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (loginData.nextAction === LoginActions.CheckAccount) {
        loginSchema
          .validate(
            { phoneNumber: loginData.phoneNumber },
            { abortEarly: false }
          )
          .then(async (dataSchema) => {
            const checkAccount = await loginApi.checkAccount({
              phone: dataSchema.phoneNumber,
            });
            if (checkAccount.code === 0) {
              /**
               * is Registed
               * Next:
               * Check Promotions
               * Show password field (if valid)
               * Take user do the login action
               * Show popup Modal (no valid)
               */

              const getOffer = await loginApi.getOffer({
                phone: dataSchema.phoneNumber,
              });
              if (getOffer.error === 0 && getOffer.data.promotions) {
                //show password field
                setFormState(() => ({
                  isShowModal: false,
                  isShowOTP: false,
                  isShowPassword: true,
                }));
                setLoginData((formData) => ({
                  ...formData,
                  nextAction: LoginActions.Login,
                }));
              } else {
                //Show popup Modal
                setFormState(() => ({
                  isShowModal: true,
                  isShowOTP: false,
                  isShowPassword: false,
                }));
              }
              setErrors({});
            }
            if (checkAccount.code === 1) {
              /**
               * New user
               * Next:
               * Send OTP code then show OTP field
               * Take user do the verify OTP action
               */
              const response = await loginApi.verifyPhoneNumber(
                dataSchema.phoneNumber
              );
              if (response.statusCode === 400) {
                setErrors(() => ({
                  phoneNumber: response.message,
                }));
              } else {
                setFormState(() => ({
                  isShowModal: false,
                  isShowOTP: true,
                  isShowPassword: false,
                }));
                setErrors({});
                setLoginData((prevState) => ({
                  ...prevState,
                  nextAction: LoginActions.VerifyOTP,
                }));
              }
            }
          })
          .catch((errors) => {
            if (errors instanceof yup.ValidationError) {
              const errorMessage = errors.inner.reduce(
                (acc: object, current: any) => {
                  return {
                    ...acc,
                    [current.path]: current.message,
                  };
                },
                {}
              );
              setErrors(errorMessage);
            }
          });
      } else {
        switch (loginData.nextAction) {
          case LoginActions.VerifyOTP: {
            loginSchema
              .validate(
                {
                  phoneNumber: loginData.phoneNumber,
                  otpCode: loginData.otpCode,
                },
                {
                  abortEarly: false,
                }
              )
              .then(async (dataSchema) => {
                const response = await loginApi.createAccount({
                  phone: dataSchema.phoneNumber,
                  code: dataSchema.otpCode,
                });

                if (response.data.statusCode === 400) {
                  setErrors(() => ({
                    otpCode: response.data.message,
                  }));
                } else {
                  setFormState((formState) => ({
                    ...formState,
                    isShowOTP: false,
                    isShowPassword: true,
                  }));
                  setErrors({});
                  setLoginData((formData) => ({
                    ...formData,
                    token: response.token,
                    rfToken: response.rfToken,
                    nextAction: LoginActions.CreatePassword,
                  }));
                }
              })
              .catch((errors) => {
                if (errors instanceof yup.ValidationError) {
                  const errorMessage = errors.inner.reduce(
                    (acc: object, current: any) => {
                      return {
                        ...acc,
                        [current.path]: current.message,
                      };
                    },
                    {}
                  );
                  setErrors(errorMessage);
                }
              });
            break;
          }
          case LoginActions.CreatePassword: {
            loginSchema
              .validate(
                {
                  phoneNumber: loginData.phoneNumber,
                  password: loginData.password,
                  isLogin: true,
                },
                {
                  abortEarly: false,
                }
              )
              .then(async (dataSchema) => {
                const response = await loginApi.createPassword({
                  password: dataSchema.password || "",
                  token: loginData.token,
                });
                //save token if create password success

                localStorage.setItem(StorageKEY.authToken, loginData.token);
                localStorage.setItem(
                  StorageKEY.refreshToken,
                  loginData.rfToken
                );

                const userInfo = await loginApi.getUserInfor();
                dispatch({
                  type: FETCH_USER_INFO,
                  payload: {
                    ...userInfo,
                  },
                });

                //fetch userinfo
              })
              .catch((errors) => {
                if (errors instanceof yup.ValidationError) {
                  const errorMessage = errors.inner.reduce(
                    (acc: object, current: any) => {
                      return {
                        ...acc,
                        [current.path]: current.message,
                      };
                    },
                    {}
                  );
                  setErrors(errorMessage);
                }
              });
            break;
          }
          case LoginActions.Login: {
            loginSchema
              .validate(
                {
                  phoneNumber: loginData.phoneNumber,
                  password: loginData.password,
                  isLogin: true,
                },
                {
                  abortEarly: false,
                }
              )
              .then(async (dataSchema) => {
                const response = await loginApi.makeLogin({
                  phone: dataSchema.phoneNumber,
                  password: dataSchema.password,
                });

                console.log({ response });
                if (response.data.statusCode === 400) {
                  setErrors(() => ({
                    password: response.data.message,
                  }));
                } else if (response.data.Status === 1) {
                  //login success

                  localStorage.setItem(StorageKEY.authToken, response.token);
                  localStorage.setItem(
                    StorageKEY.refreshToken,
                    response.rfToken
                  );
                  const userInfo = await loginApi.getUserInfor();
                  console.log({ userInfo });
                  onResetAll();
                }
              })
              .catch((errors) => {
                if (errors instanceof yup.ValidationError) {
                  const errorMessage = errors.inner.reduce(
                    (acc: object, current: any) => {
                      return {
                        ...acc,
                        [current.path]: current.message,
                      };
                    },
                    {}
                  );
                  setErrors(errorMessage);
                }
              });
            break;
          }
          case LoginActions.ForgotPassword: {
            break;
          }
          case LoginActions.ForgotPassword: {
            break;
          }
        }
      }
    },
    [loginData, formState]
  );
  return (
    <div className="page">
      <div className="inner-page">
        <Container>
          <div className="section">
            <Grid verticalAlign="middle" centered>
              <Grid.Column
                mobile={16}
                tablet={8}
                computer={8}
                className="image-column"
              >
                <Image
                  src={`${process.env.PUBLIC_URL}/images/zalo/image-promotion-top.png`}
                  alt=""
                />
              </Grid.Column>
              <Grid.Column
                mobile={16}
                tablet={8}
                computer={8}
                className="register-column"
              >
                <div className="inner-column">
                  <div className="glx-section center">
                    <Image
                      src={`${process.env.PUBLIC_URL}/images/zalo/logo-glx-white.svg`}
                      alt="Galaxy play logo"
                      className="logo"
                    />
                    <p className="subtitle white">
                      Nền tảng xem phim online số 1 tại Việt Nam
                    </p>
                  </div>
                  <div className="partner-section center">
                    <p className="title upercase white">
                      <span>Đặc quyền</span>
                      <span>dành cho khách hàng</span>
                    </p>
                    <Image
                      src={`${process.env.PUBLIC_URL}/images/zalo/logo-zlpay.png`}
                      alt="zaloPay logo"
                      className="logo"
                    />
                  </div>
                  <p className="label white center">
                    Vui lòng nhập "SỐ ĐIỆN THOẠI" và nhấn "TIẾP TỤC"
                  </p>
                  <div className="form login-form">
                    <div className="form-inner">
                      <form onSubmit={onHandleSubmit}>
                        <Input
                          name="phoneNumber"
                          placeholder="Nhập số điện thoại"
                          value={loginData.phoneNumber}
                          maxLength={10}
                          onChange={(e) =>
                            onChange(RegisterKeys.phoneNumber, e.target.value)
                          }
                          error={errors.phoneNumber}
                        />
                        {(formState.isShowPassword && (
                          <>
                            <div className="password-fields">
                              <Input
                                name="password"
                                placeholder="Nhập mật khẩu"
                                value={loginData.password}
                                maxLength={10}
                                type="password"
                                onChange={(e) =>
                                  onChange(
                                    RegisterKeys.password,
                                    e.target.value
                                  )
                                }
                                error={errors.password}
                              />
                              <div className="forgot">
                                <Button variant="text">Quên mật khẩu?</Button>
                              </div>
                            </div>
                          </>
                        )) || <></>}
                        {(formState.isShowOTP && (
                          <Input
                            name="otpCode"
                            placeholder="Nhập mã xác thực"
                            value={loginData.otpCode}
                            maxLength={10}
                            type="password"
                            onChange={(e) =>
                              onChange(RegisterKeys.otpCode, e.target.value)
                            }
                            error={errors.otpCode}
                          />
                        )) || <></>}
                        <Button type="submit" color="primary">
                          Tiếp tục
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              </Grid.Column>
            </Grid>
          </div>
        </Container>
        <Modal
          title="Rất tiếc"
          isCenter={true}
          isOpen={formState.isShowModal}
          width={400}
          onClose={() =>
            setFormState((prevState) => ({ ...prevState, isShowModal: false }))
          }
          onCancel={() =>
            setFormState((prevState) => ({ ...prevState, isShowModal: false }))
          }
          render={() => <ModalContent />}
        />
      </div>
    </div>
  );
};
export default ChanelPage;
