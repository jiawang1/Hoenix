import {generateGetService, generatePostService} from '../../common/commonService';


export const retrievePageMeta = generateGetService('fsproduct/productInfoMeta');

export const searchProductInfo = generatePostService('fsproduct/searchProductInfo');
	
export const queryCategoryAttribute = generateGetService('/category/getCategoryAttributes');

export const queryCity = generateGetService('productShelf/cities');

export const queryPointOfService = generateGetService('productShelf/pointOfServices');
	
export const getProductDetail=generateGetService('/fsproduct/productInfoDetail'); 

export const getProductStockList = generateGetService('/fsproduct/searchProductStockList');

export const retrieveProductDetailPublishList =generatePostService('/publishinfo/search');
