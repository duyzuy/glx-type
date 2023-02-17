import React, { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Container, Grid, Image } from "semantic-ui-react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { LoginUser } from "../../models";
import { loginApi } from "../../api/login";
import "./style.scss";
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
  }>({
    isShowPassword: false,
    isShowOTP: false,
  });
  const onChange = (key: string, value: string) => {
    setLoginData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };
  const onHandleSubmit = useCallback(async () => {
    if (loginData.nextAction === LoginActions.CheckAccount) {
      const response = await loginApi.checkAccount({
        phone: Number(loginData.phone),
      });
      console.log({ response });
    } else {
      switch (loginData.nextAction) {
        case LoginActions.CreatePassword: {
          break;
        }
        case LoginActions.ForgotPassword: {
          break;
        }
      }
    }
  }, [loginData, formState]);
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
                      <form onSubmit={(e) => e.preventDefault()}>
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
                        <Button
                          type="button"
                          color="primary"
                          onClick={onHandleSubmit}
                        >
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
      </div>
    </div>
  );
};
export default ChanelPage;
