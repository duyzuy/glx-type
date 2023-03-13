import React from "react";
type PropsType = {
  errorType: {
    paymentError: boolean;
    paymentFail: boolean;
    timeout: boolean;
    streamFail: boolean;
  };
};
const ModalErrorContent: React.FC<PropsType> = ({ errorType }) => {
  let message = "";
  if (errorType.paymentError) {
    message = `<p>Có lỗi trong quá trình chờ thanh toán</p>
    <p>Quý khách vui lòng kiểm tra lại các bước thực hiện thanh toán.</p>`;
  }

  if (errorType.paymentFail) {
    message = `<p>Giao dịch không thành công!</p>
    <p>Quý khách vui lòng kiểm tra lại các bước thực hiện thanh toán.</p>`;
  }

  if (errorType.timeout) {
    message = `<p>Phiên giao dịch đã hết hạn</p>`;
  }
  if (errorType.streamFail) {
    message = `<p>Quá trình thanh toán bị gián đoạn</p><p>vui lòng thử lại</p>`;
  }

  return (
    <div
      className="expired"
      style={{
        color: "#0077c8",
        fontSize: "18px",
        fontWeight: "bold",
        padding: "15px 0",
        lineHeight: 1.3,
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: message }} />
    </div>
  );
};
export default ModalErrorContent;
