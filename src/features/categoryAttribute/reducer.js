import {
  DEMO_COUNT,
  RESET_COUNT,
QUERY_ATTRIBUTE,
RECEIEVE_ATTRIBUTE
} from './constants';

const initialState = {
  count: 0,
  record: {},
  title:'',
  visible:false,
  aData:[]

};

export default function reducer(state = initialState, action) {

  switch (action.type) {

    case DEMO_COUNT:
      return {
        ...state,
        count: state.count + 1,
      };

    case RESET_COUNT:
      return {
        ...state,
        count: 0,
      };

  case QUERY_ATTRIBUTE:
	  return {
		...state,
		aData: action.aData,
	  
	  };

  case RECEIEVE_ATTRIBUTE:

	  return {
	  	...state,
		aData: action.data
	  }

    default:
      return state;
  }
}
