import React from "react";
import { Image } from "semantic-ui-react";
import { IconScan } from "../../../assets/icons";
type PropsType = {
  children?: JSX.Element;
};
const PaymentNote: React.FC<PropsType> = () => {
  return (
    <div className="payment-note">
      <div className="box">
        <div className="content">
          <div className="content-qrstep">
            <p>Bước 1: Mở ứng dụng và đăng nhập ZaloPay</p>
            <p>
              Bước 2: Bấm chọn icon
              <img
                src={IconScan}
                width={12}
                className="ico-scan"
                style={{ marginLeft: "3px", marginRight: "3px" }}
              />
              ở góc phải phía trên màn hình để quét QR Code
            </p>
            <p>Bước 3: Bấm chọn “Xác nhận” để thanh toán</p>
          </div>
          <div className="content-note">
            <p className="text center">
              Bằng việc thanh toán, Quý khách đã đồng ý với Quy chế sử dụng Dịch
              vụ của Galaxy Play và ủy quyền cho Galaxy Play tự động gia hạn khi
              hết hạn sử dụng, cho đến khi bạn hủy tự động gia hạn.
            </p>
            <div className="secures">
              <div className="icon">
                <Image
                  src={`${process.env.PUBLIC_URL}/images/shopee/ssl-secured.png`}
                  width={100}
                  className="img-sc"
                />
              </div>
              <div className="icon">
                <Image
                  src={`${process.env.PUBLIC_URL}/images/shopee/DSS-PCI.png`}
                  width={100}
                  className="img-sc"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PaymentNote;
