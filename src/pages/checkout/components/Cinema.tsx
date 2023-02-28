import React, { memo } from "react";
import { Container } from "semantic-ui-react";

import CinemaItem from "./CinemaItem";
import { VoucherItemType } from "../../../models";
type PropsType = {
  lists: VoucherItemType[];
  onSelectCinema: () => void;
  bookingData: {};
};
const Cinema: React.FC<PropsType> = ({
  lists,
  onSelectCinema,
  bookingData,
}) => {
  return (
    <div className="section sec-cinema">
      <Container>
        <div className="section-header center">
          <h2 className="title white">Chọn rạp yêu thích</h2>
        </div>
        <div className="section-body">
          <div className="cinema-list">
            {lists?.map((item) => (
              <CinemaItem
                active={false}
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
