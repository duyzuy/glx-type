import React, { memo, forwardRef, ForwardedRef } from "react";
import { RegisterKeys } from "../../../models";
import Input from "../../../components/Input";
import Button from "../../../components/Button";

type PropsType = {
  onHandleSubmit: (e: React.FormEvent) => void;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    { key, value }: { key: string; value: string }
  ) => void;
  data: { [key: string]: any };
  errors: { [key: string]: string };
  onForgotPassword: () => void;
  formState: any;
  counter?: number;
  onChangePhoneNumber: () => void;
  onResendOTP?: () => void;
};
const LoginForm = forwardRef<HTMLInputElement, PropsType>((props, ref) => {
  const {
    onHandleSubmit,
    data,
    onChange,
    errors,
    onForgotPassword,
    formState,
    counter,
    onChangePhoneNumber,
    onResendOTP,
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
            onChange={(e) =>
              onChange(e, {
                key: RegisterKeys.phoneNumber,
                value: e.target.value,
              })
            }
            error={errors.phoneNumber}
            ref={ref}
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
                    onChange(e, {
                      key: RegisterKeys.password,
                      value: e.target.value,
                    })
                  }
                  ref={ref}
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
            <>
              <Input
                name="otpCode"
                placeholder="Nhập mã xác thực"
                value={data.otpCode}
                maxLength={10}
                onChange={(e) =>
                  onChange(e, {
                    key: RegisterKeys.otpCode,
                    value: e.target.value,
                  })
                }
                error={errors.otpCode}
                ref={ref}
              />
              <div className="otp-options">
                <div className="otp-resend">
                  {(formState.canResendOTP && (
                    <>
                      <p className="btn-resend white" onClick={onResendOTP}>
                        Gửi lại mã xác nhận
                      </p>
                    </>
                  )) || (
                    <p className="text white">
                      Gửi lại mã xác nhận sau:{" "}
                      <span className="count">{`${counter}s`}</span>
                    </p>
                  )}
                </div>
                <div
                  className="change-phone white"
                  onClick={onChangePhoneNumber}
                >
                  Đổi số điện thoại
                </div>
              </div>
            </>
          )) || <></>}
          <Button type="submit" color="primary">
            Tiếp tục
          </Button>
        </form>
      </div>
    </div>
  );
});
export default memo(LoginForm);
