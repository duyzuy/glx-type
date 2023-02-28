import React from "react";
import { Container, Grid } from "semantic-ui-react";
import * as Icon from "react-feather";
const ContentBox: React.FC = () => {
  return (
    <Container>
      <Grid centered>
        <Grid.Column mobile={16} tablet={16} computer={14}>
          <div className="section-body">
            <div className="boxes white center">
              <div className="box">
                <div className="box-inner">
                  <span className="icon">
                    <Icon.CheckCircle size={36} />
                  </span>
                  <div className="content">
                    <p>
                      Sau khi thanh toán thành công, <strong>mã vé</strong> xem
                      phim tại rạp sẽ gửi đến cho bạn{" "}
                      <strong>qua tin nhắn SMS</strong>
                    </p>
                  </div>
                </div>
              </div>
              <div className="box">
                <div className="box-inner">
                  <span className="icon">
                    <Icon.CheckCircle size={36} />
                  </span>
                  <div className="content">
                    <p>
                      Nếu bạn cần hỗ trợ, vui lòng liên hệ{" "}
                      <strong>hotline 1800 9090 (miễn phí)</strong> để được hỗ
                      trợ nếu chưa nhận được mã vé
                    </p>
                  </div>
                </div>
              </div>
              <div className="box">
                <div className="box-inner">
                  <span className="icon">
                    <Icon.CheckCircle size={36} />
                  </span>
                  <div className="content">
                    <p>
                      <strong>Vé xem phim 2D</strong> áp dụng cho tất cả các
                      ngày trong tuần. Lễ tết sẽ có thêm một phần phụ phí nhỏ
                      bạn nhé!!!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Grid.Column>
      </Grid>
    </Container>
  );
};
export default ContentBox;
