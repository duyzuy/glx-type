import React, { memo, useMemo } from "react";

import { ChannelItemType } from "../../../models";
import { Image } from "semantic-ui-react";
type PropsType = {
  onSelectPaymentChannel: (channelItem: ChannelItemType) => void;
  channel: ChannelItemType;
  isSelected: boolean;
};
const ChannelItem: React.FC<PropsType> = ({
  onSelectPaymentChannel,
  channel,
  isSelected,
}) => {
  const classes = useMemo(() => {
    let cls = "channel-item";

    if (isSelected) {
      cls = cls.concat(" ", "active");
    }
    return cls;
  }, [isSelected]);
  return (
    <div
      className={classes}
      key={channel.id}
      onClick={() => {
        if (isSelected) return;
        onSelectPaymentChannel(channel);
      }}
    >
      <div className="icon">
        <Image src={channel.ico} className="method payment" />
      </div>
    </div>
  );
};
export default memo(ChannelItem);
