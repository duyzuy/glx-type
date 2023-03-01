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
    <div className="summary">
      <div className="order-detail">
        <h3>Thông tin sản phẩm</h3>
        <ul>
          <li>{plandTitle}</li>
          <li>Số thiết bị xem cùng lúc: 4</li>
          <li>Chất lượng hình ảnh: 4K</li>
          <li>Chất lượng âm thanh: Dolby 5.1</li>
          <li>Thiết bị hỗ trợ: Tất cả</li>
          <li>
            Tải về thiết bị di động: <Icon.Check size={20} />
          </li>
          <li>Thời hạn sử dụng: 1 tháng</li>
          {(item.planId === PLANID.PLATINUM_ONE_MONTH && (
            <li>Xem nội dung có phí: Phim Việt + Châu Á</li>
          )) || <></>}
        </ul>
      </div>
      <div className="account-detail">
        <h3>Tài khoản</h3>
        <p>{account?.phone}</p>
      </div>
      <div>
        <p>Đơn giá</p>
        <p>{(item && formatPrice(item.price)) || <></>}</p>
      </div>
    </div>
  );
};
export default memo(OrderSummary);
