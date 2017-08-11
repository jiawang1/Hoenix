import { render, mount, shallow } from 'enzyme';
import {ProductInfoPage} from '../../../src/features/productInfo/ProductInfoPage.js';
import React from 'React';
import { expect } from 'chai';


const productJson = '{"productInfoMeta":{"channel":[{"code":"001","name":"titi"}],"lifecycle":[{"code":"001","name":"cycle1"}],"fsSeller":[{"code":"001","name":"seller1"}]},"aData":{"results":[{"fsSeller":"ss1","code":"FSP900000000001","name":"test","productBrand":"www","lifecycle":"name","categoryName":"uuu","channel":"changhun","region":"dfdfdf","pointOfservice":"hehe","productAttribute":"sprcial","costPrice":"1002","listPrice":"110.11","salesPrice":"1119","channelCostPrice":"2836","published":"true","auditStatus":"ceshijian","supplierCode":"eee01","supplierName":"uuuuu"}],"pagination":{"numberOfPages":10,"totalNumberOfResults":100}}}';
const location = {
    query:{
        productCategoryCode:'001',
        productCategoryName:'test'
    }
};
describe("test productInfo page", () => {

    let oPage = mount(<ProductInfoPage productInfo={ JSON.parse(productJson)} location={location} />);
    let tr = oPage.find('.ant-table-row');
    expect(tr).to.not.be.null;
    expect(tr.find()).to.equal('FSP900000000001');

});