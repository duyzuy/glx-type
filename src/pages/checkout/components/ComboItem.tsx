import { memo, useMemo, useState } from "react";

import Button from "../../../components/Button";

const TYPE = {
  PREMIUM: "premium",
  PLATINUM: "platinum",
};
const COMBOKEY = {
  TWOD: "2d",
  THIRD: "3d",
};
interface PropType {
  data: any;
  onSelect: any;
  comboType: any;
  cinemaId: any;
  active: boolean;
}
const ComboItem: React.FC<PropType> = ({
  data,
  onSelect,
  comboType,
  cinemaId,
  active,
}) => {
  // console.log({ data, onSelect, comboType, cinemaId, active });
  //   const isSelecting = useMemo(() => {
  //     if (
  //       active?.data?.type === data.type &&
  //       active?.comboType === comboType &&
  //       cinemaId === active.cinemaId
  //     ) {
  //       return true;
  //     }
  //     return false;
  //   }, [active, comboType, data, cinemaId]);
  return (
    <div className="combo-item">
      <div className="item-inner">
        <div className="box-content">
          <div className="content top">
            <div className="content-inner">
              <p className="type">
                {data.type === TYPE.PREMIUM ? "Gói cao cấp" : "Gói siêu việt"}
              </p>
              <p className="month">1 tháng</p>
            </div>
          </div>
          <span className="and">&</span>
          <div className="content second">
            <div className="content-inner">
              <p className="title">Vé xem phim</p>
              <p className="combo">
                {comboType === COMBOKEY.TWOD ? "2D" : "3D"}
              </p>
            </div>
          </div>
        </div>
        <Button
          onClick={() => {
            onSelect({ comboType, data: data, cinemaId });
          }}
        >
          Chon mua
        </Button>
      </div>
    </div>
  );
};
export default memo(ComboItem);
