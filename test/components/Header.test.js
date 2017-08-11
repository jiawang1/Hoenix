import { render, mount,shallow } from 'enzyme';
import Header from '../../src/components/Header.js';
import React from 'React';
import {assert, expect} from 'chai';

describe('Component Header test',()=>{
	it('header should render user name',()=>{
		let handlerCalled = false;
		const testHandler = ()=>{handlerCalled = true;};
		const userName = 'test';
		const header = shallow(<Header clickHandler={testHandler} userName={userName} />);
		expect(header.find('.user').text()).to.include(userName);
				
	});
});
