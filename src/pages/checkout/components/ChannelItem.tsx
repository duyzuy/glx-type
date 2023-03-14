import React, { memo } from "react";

import { ChannelItemType } from "../../../models";
import { Image } from "semantic-ui-react";
type PropsType = {
  onSelectPaymentChannel: (channelItem: ChannelItemType) => void;
  channel: ChannelItemType;
};
const ChannelItem: React.FC<PropsType> = ({
  onSelectPaymentChannel,
  channel,
}) => {
  return (
    <div
      className="channel-item"
      key={channel.id}
      onClick={() => onSelectPaymentChannel(channel)}
    >
      <div className="icon">
        <Image src={channel.ico} className="method payment" />
      </div>
    </div>
  );
};
export default memo(ChannelItem);
