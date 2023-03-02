import { memo, useMemo } from "react";
import Button from "../../../components/Button";
import { TicketKeys, TicketType } from "../../../models";
import { formatPrice } from "../../../utils/common";
import { ComboItemType } from "../../../models";
import * as Icon from "react-feather";
interface PropType {
  data: any;
  onSelect: (data: ComboItemType) => void;
  ticketType: string;
  cinemaId: string;
  itemSelected?: ComboItemType;
}
const ComboItem: React.FC<PropType> = ({
  data,
  onSelect,
  ticketType,
  cinemaId,
  itemSelected,
}) => {
  const isActiveItem = useMemo(() => {
    return (
      itemSelected?.cinemaId === cinemaId &&
      itemSelected.ticketType === ticketType
    );
  }, [itemSelected, ticketType, cinemaId]);
  const classes = useMemo(() => {
    let cls = "combo-item";

    if (data.type) {
      cls = cls.concat(" ", data.type);
    }
    if (isActiveItem) {
      cls = cls.concat(" ", "active");
    }
    return cls;
  }, [data, isActiveItem]);

  return (
    <div className={classes}>
      <div className="inner-item">
        <div className="item-content">
          <div className="box-content">
            {(isActiveItem && (
              <span className="icon">
                <Icon.CheckCircle size={24} />
              </span>
            )) || <></>}
            <div className="content top">
              <div className="content-inner">
                <p className="type">
                  {data.type === TicketType.Premium
                    ? "Gói cao cấp"
                    : "Gói siêu việt"}
                </p>
                <p className="month">1 tháng</p>
              </div>
            </div>
            <span className="and">&</span>
            <div className="content second">
              <div className="content-inner">
                <p className="name">Vé xem phim</p>
                <p className="combo">
                  {ticketType === TicketKeys.Two ? "2D" : "3D"}
                </p>
              </div>
            </div>
          </div>
          <div className="box-price">
            <p className="price">{formatPrice(data.price)}</p>
          </div>
          <Button
            color="secondary"
            onClick={() => {
              if (isActiveItem) return;
              onSelect({ cinemaId, ...data, ticketType });
            }}
          >
            {(isActiveItem && "Đã chọn") || "Chọn mua"}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default memo(ComboItem);
