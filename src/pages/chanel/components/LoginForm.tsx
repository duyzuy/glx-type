import React, { memo } from "react";
import { RegisterKeys } from "../../../models";
import Input from "../../../components/Input";
import Button from "../../../components/Button";

type PropsType = {
  onHandleSubmit: (e: React.FormEvent) => void;
  onChange: (key: string, value: string) => void;
  data: { [key: string]: any };
  errors: { [key: string]: string };
  onForgotPassword: () => void;
  formState: any;
};
const LoginForm: React.FC<PropsType> = (props) => {
  const {
    onHandleSubmit,
    data,
    onChange,
    errors,
    onForgotPassword,
    formState,
  } = props;
  return (
    <div className="form login-form">
      <p className="label white center">
        Vui lòng nhập "SỐ ĐIỆN THOẠI" và nhấn "TIẾP TỤC"
      </p>
      <div className="form-inner">
        <form onSubmit={onHandleSubmit}>
          <Input
            name="phoneNumber"
            placeholder="Nhập số điện thoại"
            value={data.phoneNumber}
            maxLength={10}
            onChange={(e) => onChange(RegisterKeys.phoneNumber, e.target.value)}
            error={errors.phoneNumber}
          />
          {(formState.isShowPassword && (
            <>
              <div className="password-fields">
                <Input
                  name="password"
                  placeholder="Nhập mật khẩu"
                  value={data.password}
                  maxLength={10}
                  type="password"
                  onChange={(e) =>
                    onChange(RegisterKeys.password, e.target.value)
                  }
                  error={errors.password}
                />
                <div className="forgot">
                  <Button variant="text" onClick={onForgotPassword}>
                    Quên mật khẩu?
                  </Button>
                </div>
              </div>
            </>
          )) || <></>}
          {(formState.isShowOTP && (
            <Input
              name="otpCode"
              placeholder="Nhập mã xác thực"
              value={data.otpCode}
              maxLength={10}
              type="password"
              onChange={(e) => onChange(RegisterKeys.otpCode, e.target.value)}
              error={errors.otpCode}
            />
          )) || <></>}
          <Button type="submit" color="primary">
            Tiếp tục
          </Button>
        </form>
      </div>
    </div>
  );
};
export default memo(LoginForm);
