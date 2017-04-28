import {batchGetJson, createAction,getContent, getJson, generateGetThunk} from '../common/commonAction.js';

const UPDATE_CURRENT_USER_INFO = 'UPDATE_CURRENT_USER_INFO',
	  UPDATE_AUTHORIZATION = 'UPDATE_AUTHORIZATION';

	  //const initAuthContext = () => (dispatch) =>{
	  //	  
	  //	return batchGetJson([{url:'/currentUser'},{url:'/authorization'}]).then((aResults)=>{
	  //		if(aResults[0].status ==='success' ){
	  //			dispatch(updateCurrentUser(getContent(aResults[0])));
	  //		}
	  //		if(aResults[1].status ==='success') {
	  //			dispatch(updateAuthorization(getContent(aResults[1])));
	  //		}
	  //
	  //	}).catch(error=>{
	  //		//TODO
	  //	});
	  //};

const updateCurrentUser = createAction(UPDATE_CURRENT_USER_INFO);
const updateAuthorization = createAction(UPDATE_AUTHORIZATION);
const getAuthorization = generateGetThunk(updateAuthorization, '/authorization');
const getCurrentUser = generateGetThunk(updateCurrentUser, '/currentUser');


export const actions = {
	getCurrentUser,
	getAuthorization
};

//  reducer
export default function contextStateReducer(state = {}, action = {}) {
  switch (action.type) {
	  case UPDATE_CURRENT_USER_INFO:
		return {
			...state,
			currentUser: action.data
		};

    case UPDATE_AUTHORIZATION:
		return {
			...state,
			auth: action.data
		};

    default:
      return state;
  }
}
