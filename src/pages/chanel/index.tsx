import React, { useState, useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Container, Grid, Image } from "semantic-ui-react";

import { loginApi } from "../../api/login";
import "./style.scss";
import Modal from "../../components/Modal";
import ModalContent from "./components/ModalContent";
import { loginSchema } from "../../utils/validator";
import * as yup from "yup";
import { StorageKEY } from "../../models";
import { toast } from "../../libs/toast";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import LoginForm from "./components/LoginForm";
import UserProfile from "./components/UserProfile";
import {
  fetchUserInfo,
  makeLogin,
  forgotPassword,
  loginWithOtpCode,
  logout,
} from "../../reducer/user";
import {
  createAccount,
  fetchOffer,
  verifyPhoneNumber,
  createPassword,
} from "./actions";
import { fetchChanelName } from "./chanelSlice";
import { useNavigate } from "react-router-dom";
import { isPhoneNumber } from "../../utils/common";
import { RegisterKeyType, RegisterDataType, LoginActions } from "../../models";
interface PropsType {
  children?: JSX.Element;
}

const ChanelPage: React.FC<PropsType> = (props) => {
  const { chanelType } = useParams();
  const dispatch = useAppDispatch();
  const isLogedin = useAppSelector((state) => state.userInfo.isLogedin);
  const userData = useAppSelector((state) => state.userInfo.profile);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [loginData, setLoginData] = useState<RegisterDataType>({
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
    canResendOTP: boolean;
  }>({
    isShowPassword: false,
    isShowOTP: false,
    isShowModal: false,
    canResendOTP: true,
  });
  const [counter, setCounter] = useState<number>(0);
  const [errors, setErrors] = useState<{
    [RegisterKeyType.phoneNumber]?: string;
    [RegisterKeyType.password]?: string;
    [RegisterKeyType.otpCode]?: string;
  }>({});

  const onResetAll = () => {
    setLoginData((prevState) => ({
      ...prevState,
      phoneNumber: "",
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
      canResendOTP: true,
    });
    setErrors({});
  };
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    { key, value }: { key: string; value: string }
  ) => {
    if (
      key === RegisterKeyType.phoneNumber &&
      loginData.nextAction !== LoginActions.CheckAccount
    ) {
      onResetAll();
    }
    if (
      key === RegisterKeyType.phoneNumber &&
      loginData.nextAction === LoginActions.CheckAccount
    ) {
      if ((!isPhoneNumber(value) && value.length !== 0) || value.length > 10) {
        return;
      }
    }
    setLoginData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };
  const onForgotPassword = async () => {
    const response = await dispatch(
      forgotPassword(loginData.phoneNumber)
    ).unwrap();
    console.log({ response });

    if (response.data.statusCode === 400) {
      toast({ type: "error", message: response.data.message });
    } else {
      setLoginData((formData) => ({
        ...formData,
        password: "",
        otpCode: "",
        nextAction: LoginActions.ForgotPassword,
      }));
      setFormState(() => ({
        isShowOTP: true,
        isShowPassword: false,
        isShowModal: false,
        canResendOTP: false,
      }));
      setCounter(response.data.ttlResend);
    }
  };
  useEffect(() => {
    if (counter !== 0) {
      const timer = setTimeout(() => {
        setCounter((count) => count - 1);
        clearTimeout(timer);
      }, 1000);
    } else {
      setFormState((prevState) => ({
        ...prevState,
        canResendOTP: true,
      }));
    }
  }, [counter]);
  const onResendOTP = async () => {
    loginSchema
      .validate({ phoneNumber: loginData.phoneNumber }, { abortEarly: false })
      .then(async (dataSchema) => {
        console.log(dataSchema);
        const response = await loginApi.verifyPhoneNumber(
          dataSchema.phoneNumber
        );
        if (response.statusCode === 400) {
          toast({ type: "error", message: response.message });
        } else {
          setFormState((prevState) => ({
            ...prevState,
            canResendOTP: false,
          }));
          setCounter(60);
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
              const getOffer = await dispatch(
                fetchOffer({ phone: dataSchema.phoneNumber })
              ).unwrap();

              if (getOffer.error === 0 && getOffer.data.promotions) {
                //show password field
                setFormState((prevState) => ({
                  ...prevState,
                  isShowPassword: true,
                  isShowOTP: false,
                }));
                setLoginData((formData) => ({
                  ...formData,
                  nextAction: LoginActions.Login,
                }));
              } else {
                //Show popup Modal
                setFormState((prevState) => ({
                  ...prevState,
                  isShowModal: true,
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

              const response = await dispatch(
                verifyPhoneNumber(dataSchema.phoneNumber)
              ).unwrap();
              if (response.statusCode === 400) {
                setErrors(() => ({
                  phoneNumber: response.message,
                }));
              } else {
                setFormState((prevState) => ({
                  ...prevState,
                  isShowOTP: true,
                  isShowPassword: false,
                  canResendOTP: false,
                }));
                setCounter(response.ttlResend);
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
                const response = await dispatch(
                  createAccount({
                    phone: dataSchema.phoneNumber,
                    code: dataSchema.otpCode || "",
                  })
                ).unwrap();

                if (response?.data.statusCode === 400) {
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
                    token: response?.token || "",
                    rfToken: response?.rfToken || "",
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
                  password: loginData.password || "",
                  isLogin: true,
                },
                {
                  abortEarly: false,
                }
              )
              .then(async (dataSchema) => {
                const response = await dispatch(
                  createPassword({
                    password: dataSchema.password || "",
                    token: loginData.token || "",
                  })
                ).unwrap();
                //save token if create password success

                localStorage.setItem(
                  StorageKEY.authToken,
                  loginData.token || ""
                );
                localStorage.setItem(
                  StorageKEY.refreshToken,
                  loginData.rfToken || ""
                );
                dispatch(fetchUserInfo(loginData.token));
                navigate("./checkout");
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
                const response = await dispatch(
                  makeLogin({
                    phone: dataSchema.phoneNumber,
                    password: dataSchema.password || "",
                  })
                ).unwrap();

                if (response?.data?.statusCode === 400) {
                  setErrors(() => ({
                    password: response?.data?.message,
                  }));
                } else {
                  //login success
                  setErrors({});
                  onResetAll();
                  navigate("./checkout");
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
            loginSchema
              .validate(
                {
                  phoneNumber: loginData.phoneNumber,
                  otpCode: loginData.otpCode,
                  isVerifyAccount: true,
                },
                { abortEarly: false }
              )
              .then(async (dataSchema) => {
                const response = await dispatch(
                  loginWithOtpCode({
                    phone: dataSchema.phoneNumber,
                    code: dataSchema.otpCode || "",
                  })
                ).unwrap();

                if (response?.data?.statusCode === 400) {
                  console.log(response);
                } else {
                  setFormState((prevState) => ({
                    ...prevState,
                    isShowPassword: true,
                    isShowOTP: false,
                  }));
                  setLoginData((formData) => ({
                    ...formData,
                    password: "",
                    otpCode: "",
                    token: response.token,
                    nextAction: LoginActions.CreatePassword,
                  }));
                  setErrors({});
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
        }
      }
    },
    [loginData, formState]
  );
  // useEffect(() => {
  //   dispatch(fetchChanelName(chanelType));
  // }, []);
  return (
    <div className={`page ${chanelType}`}>
      <div className="inner-page">
        <Container>
          <div className="section section-chanel">
            <Grid verticalAlign="middle" centered>
              <Grid.Column
                mobile={16}
                tablet={8}
                computer={8}
                className="image-column"
              >
                <Image
                  src={`${process.env.PUBLIC_URL}/images/${chanelType}/channel-left.png`}
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
                      src={`${process.env.PUBLIC_URL}/images/${chanelType}/logo-glx-white.svg`}
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
                      src={`${process.env.PUBLIC_URL}/images/${chanelType}/logo-partner.png`}
                      alt="zaloPay logo"
                      className="logo"
                    />
                  </div>
                  {(isLogedin && (
                    <>
                      <UserProfile
                        data={userData}
                        onLogout={() => {
                          dispatch(logout());
                          onResetAll();
                        }}
                        onContinue={() => navigate("./checkout")}
                      />
                    </>
                  )) || (
                    <>
                      <LoginForm
                        onHandleSubmit={onHandleSubmit}
                        data={loginData}
                        errors={errors}
                        formState={formState}
                        onChange={onChange}
                        onForgotPassword={onForgotPassword}
                        counter={counter}
                        onChangePhoneNumber={onResetAll}
                        onResendOTP={onResendOTP}
                        ref={inputRef}
                      />
                    </>
                  )}
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
