import {
  STOCK_FREEZE_EDIT_TEST_ACTION,
} from './constants';

const initialState = {
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case STOCK_FREEZE_EDIT_TEST_ACTION:
      return {
        ...state,
      };

    default:
      return state;
  }
}

