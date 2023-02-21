import React, { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Container, Grid, Image } from "semantic-ui-react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { LoginUser } from "../../models";
import { loginApi } from "../../api/login";
import "./style.scss";
import Modal from "../../components/Modal";
interface Props {
  children?: JSX.Element;
}

interface FormRegister extends LoginUser {
  nextAction: any;
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
    phone: "",
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
        const checkAccount = await loginApi.checkAccount({
          phone: loginData.phone,
        });

        if (checkAccount.code === 0) {
          /**
           * is Registed
           * Next:
           * Check Promotions
           * @if valid
           * Show password field
           * Take user do the login action
           * @else
           * Show popup Modal;
           * Take user do the login with another phone number
           */

          const getOffer = await loginApi.getOffer({ phone: loginData.phone });
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
      } else {
        switch (loginData.nextAction) {
          case LoginActions.VerifyOTP: {
            const response = await loginApi.createAccount({
              phone: loginData.phone,
              code: loginData.otpCode,
            });
            if (response.data.statusCode === 400) {
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
            <Grid>
              <Grid.Column mobile={16} tablet={8} computer={8}>
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
                    <p className="title white">
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
                          value={loginData.phone}
                          maxLength={10}
                          onChange={(e) => onChange("phone", e.target.value)}
                          onKeyUp={(e) => {
                            console.log(e.key);
                          }}
                          error={"asdf"}
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
                                error={"asdf"}
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
          title="Thong bao"
          isShow={formState.isShowModal}
          render={() => {
            return "asdf";
          }}
        />
      </div>
    </div>
  );
};
export default ChanelPage;
