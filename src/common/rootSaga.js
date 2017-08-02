import { take, put, call, fork, race, cancelled, takeEvery } from 'redux-saga/effects';
import rootState from './rootState';
import { ADD_GLOBAL_ERROR} from './commonErrorState.js';

export const HOENIX_PREFIX='@@Hoenix/';

const watcherMap = Object.keys(rootState).filter(key=> typeof rootState[key].watcher !== 'undefined').reduce((pre,cur)=>{
		
	let _saga = rootState[cur].watcher;
	Object.keys(_saga).forEach(sKey=>{
		let _func = function*(){
			yield fork(_saga[sKey]);
		};
		pre.push(_func);
	});
	return pre;

}, []);


function generateWatcherMap(){
	return Object.keys(rootState).filter(key=> typeof rootState[key].watcher !== 'undefined').reduce((pre,cur)=>{

		let _saga = rootState[cur].watcher;
		Object.keys(_saga).forEach(sKey=>{
			let _func = function*(){
				yield fork(_saga[sKey]);
			};
			pre.push(_func);
		});
		return pre;

	}, []);
}

function withCatch(saga){
	return function*(...args){
		try{
			yield call(saga, ...args);
		}catch(error){
			if(args[0] && args[0].cb){
				args[0].cb(error)
			}

			console.log(error.name)
			if(error.name === 'ApplicationError'){
				yield put({type:ADD_GLOBAL_ERROR, error:error.message });	
			}else if(error.name==='SystemError'){
				yield put({type:ADD_GLOBAL_ERROR, error:"unknown error, please contact admin" });	
			}else{
				throw error;
			}
		}
	}
}

function generateSagaMap(){

	let aNamespace = [];

	return Object.keys(rootState).filter(key=>rootState[key].managedSaga).reduce((pre, key)=>{

		let namespace = rootState[key].managedSaga.sagaNamespace;
		if(!namespace){
			console.error(`sagaNamespace for ${key} managedSaga is missed`);
			throw new Error(`sagaNamespace for ${key} managedSaga is missed`);
		}	
		if(aNamespace.indexOf(namespace) >=0){
			console.error(`duplicated namespace for ${namespace}`);
			throw new Error(`duplicated namespace for ${namespace}`);
		}else{
			aNamespace.push(namespace);
		}
		Object.keys(rootState[key].managedSaga).map(_key=>{

			if(_key ===namespace )return;
			pre.push(function*(){

				function* tmp(){
					let pattern = `${namespace}/${_key}`;
					console.log(pattern)
					yield takeEvery(pattern, withCatch(rootState[key].managedSaga[_key]));
				}
				yield fork(tmp);
			});

		});
		return pre;
	}, []);
}



export default [
	...generateWatcherMap(),
	...generateSagaMap()
	/*  special saga should be add here   */
];


