import * as yup from "yup";

interface LoginSchema {
  phoneNumber: string;
  isLogin?: boolean;
  isVerifyAccount?: boolean;
  password?: string;
  otpCode?: string;
}
export const loginSchema: yup.Schema<LoginSchema> = yup.object().shape({
  phoneNumber: yup.string().required("Số điện thoại không được bỏ trống"),
  isLogin: yup.boolean().required().default(false),
  isVerifyAccount: yup.boolean().required().default(false),
  password: yup.string().when("isLogin", {
    is: true,
    then: (schema) =>
      schema
        .required("Vui lòng nhập mật khẩu")
        .min(6, "Mật khẩu ít nhất 6 ký tự"),
  }),
  otpCode: yup.string().when("isVerifyAccount", {
    is: true,
    then: (schema) => schema.required("Vui lòng nhập mã xác thực"),
  }),
});
