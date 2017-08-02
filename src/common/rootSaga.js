import { take, put, call, fork, race, cancelled, takeEvery } from 'redux-saga/effects';
import rootState from './rootState';
//import { Button, Card, Col, Row, Table, Tabs, Form, Popover, Collapse } from 'antd';

export const HOENIX_PREFIX='@@Hoenix/';
export const ADD_GLOBAL_ERROR = `${HOENIX_PREFIX}add_global_error`;
export const REMOVE_GLOBAL_ERROR = `${HOENIX_PREFIX}remove_global_error`;

const sagaMap = Object.keys(rootState).filter(key=> typeof rootState[key].watcher !== 'undefined').reduce((pre,cur)=>{
		
	let _saga = rootState[cur].watcher;
	Object.keys(_saga).forEach(sKey=>{
		let _func = function*(){
			yield fork(_saga[sKey]);
		};
		pre.push(_func);
	});
	return pre;

}, []);

export default [
	...sagaMap
	/*  special saga should be add here   */
];


