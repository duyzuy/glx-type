import { Action } from "../models";
import { FETCH_DEVICE } from "../constants/actions";

const deviceState = {};

const deviceReducer = (state: object, action: Action) => {
  switch (action.type) {
    case FETCH_DEVICE: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
};

export default deviceReducer;
export { deviceState };
