import React, { memo } from "react";
import { Container } from "semantic-ui-react";
import CinemaItem from "./CinemaItem";
import { VoucherItemType } from "../../../models";
type PropsType = {
  lists: VoucherItemType[];
  onSelectCinema: (data: VoucherItemType) => void;
  selectedItem: VoucherItemType;
};
const Cinema: React.FC<PropsType> = ({
  lists,
  onSelectCinema,
  selectedItem,
}) => {
  console.log(selectedItem);
  return (
    <div className="section sec-cinema">
      <Container>
        <div className="section-header center">
          <h2 className="title white">Chọn rạp yêu thích</h2>
        </div>
        <div className="section-body">
          <div className="cinema-list">
            {lists?.map((item: VoucherItemType) => (
              <CinemaItem
                active={selectedItem.id === item.id}
                key={item.id}
                data={item}
                onSelectCinema={onSelectCinema}
              />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};
export default memo(Cinema);
