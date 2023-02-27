import React from "react";
import * as Icon from "react-feather";
import Button from "../../../components/Button";
type PropsType = {
  children?: JSX.Element;
  data: { [key: string]: any };
  onLogout?: () => void;
  onContinue?: () => void;
};
const UserProfile: React.FC<PropsType> = (props) => {
  const { onLogout, data, onContinue } = props;
  return (
    <>
      <div className="user-info">
        <div className="avatar">
          <span className="icon">
            <Icon.User size={60} />
          </span>
        </div>
        <div className="infor">
          <p className="phone">{data.phone}</p>
        </div>
        <div className="actions ">
          <div className="buttons inline">
            <Button variant="outlined" onClick={onLogout}>
              Đăng xuất
            </Button>
            <Button color="primary" onClick={onContinue}>
              Tiếp tục
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
export default UserProfile;
