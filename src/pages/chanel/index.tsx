import React from "react";
import { useParams } from "react-router-dom";
import { Container, Grid, Image } from "semantic-ui-react";
import CustomInput from "../../components/CustomInput";
import Button from "../../components/Button";
import "./style.scss";
interface Props {
  children?: JSX.Element;
}
const ChanelPage: React.FC<Props> = (props) => {
  const { chanelType } = useParams();
  console.log(process.env.PUBLIC_URL);
  return (
    <div className="page">
      <div className="inner-page">
        <Container>
          <div className="section">
            <Grid>
              <Grid.Column mobile={16} tablet={8} computer={8}>
                <Image
                  src={`${process.env.PUBLIC_URL}/images/zalo/image-promotion-top.png`}
                  alt=""
                />
              </Grid.Column>
              <Grid.Column
                mobile={16}
                tablet={8}
                computer={8}
                className="register-column"
              >
                <div className="inner-column">
                  <Image
                    src={`${process.env.PUBLIC_URL}/images/zalo/logo-glx-white.svg`}
                    alt="Galaxy play logo"
                    className="glx-logo"
                  />
                  <p className="subtitle text-white">
                    Nền tảng xem phim online số 1 tại Việt Nam
                  </p>
                  <p className="title">
                    <span>Đặc quyền </span>
                    <span>dành cho khách hàng</span>
                  </p>
                  <Image
                    src={`${process.env.PUBLIC_URL}/images/zalo/logo-zlpay.png`}
                    alt="zalo pay logo"
                    className="logo-partner"
                  />
                  <p className="label">
                    Vui lòng nhập "SỐ ĐIỆN THOẠI" và nhấn "TIẾP TỤC"
                  </p>
                  <div className="form login-form">
                    <div className="form-inner">
                      <form onSubmit={(e) => e.preventDefault()}>
                        <CustomInput
                          name="phoneNumber"
                          placeholder="Nhập số điện thoại"
                          value={""}
                          maxLength={10}
                          onChange={(e) => console.log(e.target.value)}
                          onKeyUp={(e) => {
                            console.log(e.key);
                          }}
                          error={"asdf"}
                        />
                        <Button type="button">Tiếp tục</Button>
                      </form>
                    </div>
                  </div>
                </div>
              </Grid.Column>
            </Grid>
          </div>
        </Container>
      </div>
    </div>
  );
};
export default ChanelPage;
