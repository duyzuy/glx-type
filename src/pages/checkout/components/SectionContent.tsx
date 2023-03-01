import { Container, Grid, Image } from "semantic-ui-react";
import * as Icon from "react-feather";

type PropsType = {
  children?: React.ReactNode;
  chanel: string;
};
const SectionContent: React.FC<PropsType> = ({ chanel }) => {
  return (
    <div className="section sec-content second">
      <div className="section-body content-block">
        <Grid className="block-first" centered verticalAlign="middle">
          <Grid.Column mobile={16} computer={9}>
            <Image
              src={`${process.env.PUBLIC_URL}/images/${chanel}/goi-cao-cap.png`}
            />
          </Grid.Column>
          <Grid.Column mobile={16} computer={7}>
            <div className="box-content white">
              <ul className="list highligh">
                <li>
                  <span className="icon">
                    <Icon.CheckCircle size={24} />
                  </span>
                  <div className="content">
                    <p>Xem được toàn bộ phim trong danh mục gói cao cấp</p>
                  </div>
                </li>
                <li>
                  <span className="icon">
                    <Icon.CheckCircle size={24} />
                  </span>
                  <div className="content">
                    <p>Sử dụng cùng lúc trên cả 4 thiết bị</p>
                  </div>
                </li>
                <li>
                  <span className="icon">
                    <Icon.CheckCircle size={24} />
                  </span>
                  <div className="content">
                    <p>Chất lượng hình ảnh 4K</p>
                  </div>
                </li>
                <li>
                  <span className="icon">
                    <Icon.CheckCircle size={24} />
                  </span>
                  <div className="content">
                    <p>Chất lượng âm thanh Dolby 5.1</p>
                  </div>
                </li>
              </ul>
            </div>
          </Grid.Column>
        </Grid>
        <Grid className="block-second" centered verticalAlign="middle">
          <Grid.Column mobile={16} computer={9}>
            <Image
              src={`${process.env.PUBLIC_URL}/images/${chanel}/goi-sieu-viet.png`}
            />
          </Grid.Column>
          <Grid.Column mobile={16} computer={7}>
            <div className="box-content white">
              <ul className="list">
                <li>
                  <span className="icon">
                    <Icon.CheckCircle size={24} />
                  </span>
                  <div className="content">
                    <p>Xem không giới hạn nội dung phim thuê Việt Nam</p>
                  </div>
                </li>
                <li>
                  <span className="icon">
                    <Icon.CheckCircle size={24} />
                  </span>
                  <div className="content">
                    <p> Xem được toàn bộ các phim trong danh mục gói cao cấp</p>
                  </div>
                </li>
                <li>
                  <span className="icon">
                    <Icon.CheckCircle size={24} />
                  </span>
                  <div className="content">
                    <p>Sử dụng cùng lúc trên cả 4 thiết bị</p>
                  </div>
                </li>
                <li>
                  <span className="icon">
                    <Icon.CheckCircle size={24} />
                  </span>
                  <div className="content">
                    <p> Chất lượng hình ảnh 4K</p>
                  </div>
                </li>
                <li>
                  <span className="icon">
                    <Icon.CheckCircle size={24} />
                  </span>
                  <div className="content">
                    <p> Chất lượng âm thanh Dolby 5.1</p>
                  </div>
                </li>
              </ul>
            </div>
          </Grid.Column>
        </Grid>
      </div>
    </div>
  );
};
export default SectionContent;
