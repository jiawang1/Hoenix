
export const ADD_GLOBAL_ERROR = `add_global_error`;
export const REMOVE_GLOBAL_ERROR = `remove_global_error`;


export class ApplicationError extends Error{

	constructor(){
		super(...arguments);
		this.name = 'ApplicationError';
	}

}

export class SystemError extends Error{
	constructor(){
		super(...arguments);
		this.name = 'SystemError';

	}

}
var __errorCode = 0;

const initialState = {

};

export default {

	reducer: (state = initialState, action)=>{

		switch (action.type){
			case ADD_GLOBAL_ERROR:
				var _aError = (state.aGlobalError)?state.aGlobalError.slice():[];
				_aError.push({
					key: ++__errorCode,
					description: action.error
				});

				return {
					...state,
					aGlobalError:_aError
				};

			case REMOVE_GLOBAL_ERROR:

				if(!state.aGlobalError){
					return state;

				}else{

					var errors = state.aGlobalError.slice();
					var newError = errors.filter(error=> error.key !== action.key);
					return {
						...state,
						aGlobalError: newError
					};
				}
			default:
				return {
					...state
				};
		}
	}
}

