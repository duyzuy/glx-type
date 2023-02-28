import React, { useMemo, memo } from "react";
import { Image } from "semantic-ui-react";
import { VoucherItemType } from "../../../models";
type PropsType = {
  data: VoucherItemType;
  onSelectCinema: (data: any) => void;
  active: boolean;
  channel: string;
};
const CinemaItem: React.FC<PropsType> = (props) => {
  const { data, onSelectCinema, active, channel } = props;

  const item = useMemo(() => {
    switch (data?.id) {
      case "cgv": {
        return {
          title: "Chọn rạp CGV",
          src: `${process.env.PUBLIC_URL}/images/${channel}/cinema-cgv.png`,
          notAvaiable: !data["2d"] && !data["3d"] ? true : false,
        };
      }

      case "glxcinema": {
        return {
          title: "Chọn rạp Galaxy",
          src: `${process.env.PUBLIC_URL}/images/${channel}/cinema-galaxy.png`,
          notAvaiable: !data["2d"] && !data["3d"] ? true : false,
        };
      }

      case "lotte": {
        return {
          title: "Chọn rạp Lotte",
          src: `${process.env.PUBLIC_URL}/images/${channel}/cinema-lotte.png`,
          notAvaiable: !data["2d"] && !data["3d"] ? true : false,
        };
      }
      case "bhd": {
        return {
          title: "Chọn rạp BHD",
          src: `${process.env.PUBLIC_URL}/images/${channel}/cinema-bhd.png`,
          notAvaiable: !data["2d"] && !data["3d"] ? true : false,
        };
      }
      case "cinestar": {
        return {
          title: "Chọn rạp Cinestar",
          src: `${process.env.PUBLIC_URL}/images/${channel}/cinema-cinestar.png`,
          notAvaiable: !data["2d"] && !data["3d"] ? true : false,
        };
      }
      default: {
        return {
          title: "",
          src: "",
          notAvaiable: true,
        };
      }
    }
  }, [data]);

  const classes = useMemo(() => {
    let clss = "cinema-item";
    if (item.notAvaiable) {
      clss = clss.concat(" ", "disabled");
    }
    if (active) {
      clss = clss.concat(" ", "active");
    }

    return clss;
  }, [data, active, item]);
  return (
    <>
      <div className={classes}>
        <div className="item-inner" onClick={() => onSelectCinema(data)}>
          <Image src={item.src} alt={item.title} />
          <div className="content">
            <p className="label-text">{item.title}</p>
          </div>
        </div>
      </div>
    </>
  );
};
export default memo(CinemaItem);
