import React, { memo } from "react";

import { ChanelItemType } from "../../../models";
import { Image } from "semantic-ui-react";
type PropsType = {
  onSelectPayment: (channelItem: ChanelItemType) => void;
  channel: ChanelItemType;
};
const ChannelItem: React.FC<PropsType> = ({ onSelectPayment, channel }) => {
  return (
    <div
      className="channel-item"
      key={channel.id}
      onClick={() => onSelectPayment(channel)}
    >
      <div className="icon">
        <Image src={channel.ico} className="method payment" />
      </div>
    </div>
  );
};
export default memo(ChannelItem);
