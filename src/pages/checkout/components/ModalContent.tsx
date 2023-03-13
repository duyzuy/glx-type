import React, { memo } from "react";
type PropsType = {
  type: {
    isPaymentError: boolean;
    isPaymentFail: boolean;
    isTimeout: boolean;
    isStreammingFail: boolean;
    isPaymentSuccess: boolean;
  };
};

const ModalContent: React.FC<PropsType> = ({ type }) => {
  let message = "";
  if (type.isPaymentError) {
    message = `<p>Có lỗi trong quá trình chờ thanh toán</p>
      <p>Quý khách vui lòng kiểm tra lại các bước thực hiện thanh toán.</p>`;
  }

  if (type.isPaymentFail) {
    message = `<p>Giao dịch không thành công!</p>
      <p>Quý khách vui lòng kiểm tra lại các bước thực hiện thanh toán.</p>`;
  }

  if (type.isTimeout) {
    message = `<p>Phiên giao dịch của quý khách đã hết hạn, vui lòng bấm nút thử lại để tiến hành thanh toán.</p>`;
  }
  if (type.isStreammingFail) {
    message = `<p>Quá trình thực hiện thanh toán bị gián đoạn, vui lòng thử lại</p>`;
  }

  return (
    <div className="content" dangerouslySetInnerHTML={{ __html: message }} />
  );
};
export default memo(ModalContent);
