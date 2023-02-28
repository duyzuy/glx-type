import React, { memo } from "react";
import { Container } from "semantic-ui-react";
import CinemaItem from "./CinemaItem";
import { VoucherItemType } from "../../../models";
type PropsType = {
  lists: VoucherItemType[];
  onSelectCinema: (data: VoucherItemType) => void;
  selectedItem: VoucherItemType;
  channel: string;
};
const Cinema: React.FC<PropsType> = ({
  lists,
  onSelectCinema,
  selectedItem,
  channel,
}) => {
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
                channel={channel}
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
