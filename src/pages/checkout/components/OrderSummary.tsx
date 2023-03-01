import React, { memo, useMemo } from "react";

import { formatPrice } from "../../../utils/common";
import { Container, Grid } from "semantic-ui-react";
import * as Icon from "react-feather";
import { ProfileInfo, ComboItemType } from "../../../models";

interface PropType {
  account: ProfileInfo;
  item: ComboItemType;
}
const OrderSummary: React.FC<PropType> = ({ account, item }) => {
  const PLANID = {
    PLATINUM_ONE_MONTH: "glxplay_platinum_1_month",
    PREMIUM_ONE_MONTH: "glxplay_premium_1_month",
  };
  const plandTitle = useMemo(() => {
    switch (item?.planId) {
      case PLANID.PLATINUM_ONE_MONTH: {
        return "Gói Galaxy Play siêu việt 1 tháng";
      }
      case PLANID.PREMIUM_ONE_MONTH: {
        return "Gói Galaxy Play cao cấp 1 tháng";
      }
      default: {
        return "no plan";
      }
    }
  }, [item]);
  return (
    <div className="summary center">
      <div className="order-detail">
        <h3 className="pland-name">{plandTitle}</h3>
        <ul>
          <li>
            <p className="label">Số thiết bị xem cùng lúc:</p>
            <p className="value">4</p>
          </li>
          <li>
            <p className="label">Chất lượng hình ảnh:</p>
            <p className="value">4K</p>
          </li>
          <li>
            <p className="label">Chất lượng âm thanh:</p>
            <p className="value">Dolby 5.1</p>
          </li>
          <li>
            <p className="label">Thiết bị hỗ trợ:</p>
            <p className="value">Tất cả</p>
          </li>
          <li>
            <p className="label">Tải về thiết bị di động:</p>
            <p className="value"></p> <Icon.Check size={20} />
          </li>
          <li>
            <p className="label">Thời hạn sử dụng:</p>
            <p className="value">1 tháng</p>
          </li>
          {(item.planId === PLANID.PLATINUM_ONE_MONTH && (
            <li>
              <p className="label">Xem nội dung có phí:</p>
              <p className="value">Phim Việt + Châu Á</p>
            </li>
          )) || <></>}
        </ul>
      </div>
      <div className="account-detail">
        <ul>
          <li>
            <p className="label">Tài khoản</p>
            <p className="value">{account?.phone}</p>
          </li>
          <li>
            <p className="label">Đơn giá</p>
            <p className="value">
              {(item && formatPrice(item.price)) || <></>}
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default memo(OrderSummary);
