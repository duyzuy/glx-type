import React from "react";
import {
  MethodItemType,
  OfferItemType,
  PaymentDataType,
} from "../../../models";
import { isEmpty } from "../../../utils/common";
import { Image } from "semantic-ui-react";
import Button from "../../../components/Button";
import CountdownTimer from "../../../components/CountdownTimer";
import * as Icon from "react-feather";
import { DeviceType } from "../../../models";
import Skeleton from "../../../components/Skeleton";
type PropsType = {
  isDesktop?: boolean;
  children?: JSX.Element;
  onSubmitPayment: ({
    methodId,
    offer,
  }: {
    methodId: string;
    offer: OfferItemType;
  }) => void;
  channelType: string;
  onSubmitPaymentWebview: (url: string) => void;
  currentMethod: MethodItemType;
  offer: OfferItemType;
  paymentData: PaymentDataType;
  onTimeoutQrcode: () => void;
  counterStart: number;
  isLoading?: boolean;
};
const PaymentMethodContainer: React.FC<PropsType> = ({
  isDesktop,
  onSubmitPayment,
  channelType,
  onSubmitPaymentWebview,
  currentMethod,
  offer,
  paymentData,
  onTimeoutQrcode,
  counterStart,
  isLoading = false,
}) => {
  return (
    <div className="payment-content center">
      {(!isEmpty(currentMethod) && (
        <>
          <div className="methods">
            <div className="method-item" key={currentMethod.methodId}>
              <div className="icon">
                <Image src={currentMethod.ico} className="method payment" />
              </div>
              <div className="content">
                <p className="name">{currentMethod.channelName}</p>
                <span className="icon-check">
                  <Icon.Check size={12} />
                </span>
              </div>
            </div>
          </div>
          <Button
            color="primary"
            className="payment-button"
            onClick={() =>
              onSubmitPayment({
                methodId: currentMethod.methodId || "",
                offer: offer,
              })
            }
          >
            Thanh toán ngay
          </Button>
        </>
      )) ||
        (!isDesktop && (
          <div className="payment-webview">
            <Button
              color="primary"
              className="payment-button"
              onClick={() => onSubmitPaymentWebview("")}
            >
              Thanh toán ngay
            </Button>
          </div>
        )) ||
        (isLoading && (
          <div className="qrcode-loading">
            <div className="skeleton-qrcode">
              <Skeleton width={200} height={200} padding={30} />
              <div className="sk-time">
                <Skeleton width={40} height={40} />
                <Skeleton width={40} height={40} />
                <Skeleton width={40} height={40} />
              </div>
            </div>
          </div>
        )) || (
          <div className="payment-qrcode">
            <div className="qrcode">
              <Image src={paymentData.qrCodeUrl} />
            </div>
            <div className="counter">
              <CountdownTimer
                targetDate={counterStart}
                onExpire={onTimeoutQrcode}
              />
            </div>
          </div>
        )}
    </div>
  );
};
export default PaymentMethodContainer;
