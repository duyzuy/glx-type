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

interface Props {
  children?: JSX.Element;
}

interface FormRegister {
  phoneNumber: string;
  otpCode: string;
  password: string;
  nextAction: LoginActions;
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

  const [loginData, setLoginData] = useState<FormRegister>({
    phoneNumber: "",
    otpCode: "",
    password: "",
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
  const [errors, setErrors] = useState<
    Partial<Pick<FormRegister, "phoneNumber" | "otpCode" | "password">>
  >({});

  const onChange = (key: string, value: string) => {
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
          .then(async (data) => {
            const checkAccount = await loginApi.checkAccount({
              phone: data.phoneNumber,
            });
            if (checkAccount.code === 0) {
              /**
               * is Registed
               * Next:
               * Check Promotions
               *
               * Show password field
               * Take user do the login action
               * #
               * Show popup Modal;
               * Take user do the login with another phone number
               */

              const getOffer = await loginApi.getOffer({
                phone: loginData.phoneNumber,
              });
              if (getOffer.error === 0 && getOffer.data.promotions) {
                //show password field
                setFormState(() => ({
                  isShowModal: false,
                  isShowOTP: false,
                  isShowPassword: true,
                }));
                setLoginData((prevState) => ({
                  ...prevState,
                  nextAction: LoginActions.Login,
                }));
                return;
              } else {
                //Show popup Modal
                setFormState(() => ({
                  isShowModal: true,
                  isShowOTP: false,
                  isShowPassword: false,
                }));
                return;
              }
            }
            if (checkAccount.code === 1) {
              /**
               * New user
               * Next:
               * Send OTP code then show OTP field
               * Take user do the verify OTP action
               */
              setFormState(() => ({
                isShowModal: false,
                isShowOTP: true,
                isShowPassword: false,
              }));
              setLoginData((prevState) => ({
                ...prevState,
                nextAction: LoginActions.VerifyOTP,
              }));
              return;
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
            const response = await loginApi.createAccount({
              phone: loginData.phoneNumber,
              code: loginData.otpCode,
            });
            console.log({ response });
            if (response.data.statusCode === 400) {
            } else {
            }
            break;
          }
          case LoginActions.CreatePassword: {
            break;
          }
          case LoginActions.ForgotPassword: {
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
                            onChange("phoneNumber", e.target.value)
                          }
                          onKeyUp={(e) => {
                            console.log(e.key);
                          }}
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
                                  onChange("password", e.target.value)
                                }
                                onKeyUp={(e) => {
                                  console.log(e.key);
                                }}
                                error={errors.password}
                              />
                              <div className="forgot">
                                <button>Quên mật khẩu</button>
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
                              onChange("otpCode", e.target.value)
                            }
                            onKeyUp={(e) => {
                              console.log(e.key);
                            }}
                            error={"asdf"}
                          />
                        )) || <></>}
                        <Button type="button" color="primary">
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
