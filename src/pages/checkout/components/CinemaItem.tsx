import React, { useMemo, memo } from "react";
import { Image } from "semantic-ui-react";

type PropsType = {
  data: any;
  onSelectCinema: (data: any) => void;
  active: boolean;
};
const CinemaItem: React.FC<PropsType> = (props) => {
  const { data, onSelectCinema, active } = props;

  const dataFilter = useMemo(() => {
    switch (data?.id) {
      case "cgv": {
        return {
          title: "Chọn rạp CGV",
          src: `${process.env.PUBLIC_URL}/images/zalo/cinema-cgv.png`,
          notAvaiable: !data["2d"] && !data["3d"] ? true : false,
        };
      }

      case "glxcinema": {
        return {
          title: "Chọn rạp Galaxy",
          src: `${process.env.PUBLIC_URL}/images/zalo/cinema-galaxy.png`,
          notAvaiable: !data["2d"] && !data["3d"] ? true : false,
        };
      }

      case "lotte": {
        return {
          title: "Chọn rạp Lotte",
          src: `${process.env.PUBLIC_URL}/images/zalo/cinema-lotte.png`,
          notAvaiable: !data["2d"] && !data["3d"] ? true : false,
        };
      }
      case "bhd": {
        return {
          title: "Chọn rạp BHD",
          src: `${process.env.PUBLIC_URL}/images/zalo/cinema-bhd.png`,
          notAvaiable: !data["2d"] && !data["3d"] ? true : false,
        };
      }
      case "cinestar": {
        return {
          title: "Chọn rạp Cinestar",
          src: `${process.env.PUBLIC_URL}/images/zalo/cinema-cinestar.png`,
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
    if (dataFilter.notAvaiable) {
      clss = clss.concat(" ", "disabled");
    }
    // if (active?.id === data.id) {
    //   clss = clss.concat(" ", "active");
    // }

    return clss;
  }, [data, active, dataFilter]);
  return (
    <>
      <div className={classes}>
        <div className="item-inner" onClick={() => onSelectCinema(data)}>
          <Image src={dataFilter.src} alt={dataFilter.title} />
          <div className="content">
            <p className="label-text">{dataFilter.title}</p>
          </div>
        </div>
      </div>
    </>
  );
};
export default memo(CinemaItem);
