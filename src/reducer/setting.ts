import { FETCH_DEVICE } from "../constants/actions";

interface State {}
interface ActionReducer {
  type: string;
  payload: object;
}
const settingState = {};

const settingReducer = (state: State, action: ActionReducer) => {
  switch (action.type) {
    case FETCH_DEVICE: {
      return {
        ...state,
        ...action.payload,
      };
    }
  }
};

export { settingReducer, settingState };
