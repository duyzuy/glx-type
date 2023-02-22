import { loginApi } from "../../api/login";
import { FETCH_USER_INFO } from "../../constants/actions";
export const getUserInfo = async (dispatch?: any) => {
  try {
    const userInfo = await loginApi.getUserInfor();
    console.log(userInfo);
    dispatch({
      type: FETCH_USER_INFO,
      payload: userInfo,
    });
  } catch (error) {
    console.log(error);
  }
};
