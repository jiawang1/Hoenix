import 'whatwg-fetch';

//export const getJson = (oQuery)=>{}

var rootContext = null;

(()=>{
	if(window &&window.document){
	rootContext = document.getElementById("context-root").getAttribute('value');
	
}})();


export const getJson = ((_ops)=>(option)=>{

		let ops = Object.assign({},_ops,option);

		if(rootContext){
			ops.url = rootContext + ( ops.url.charAt(0)==='.'?ops.url.slice(1): ops.url );
		}
		return fetch(ops.url,ops);
	})({
		mode:'no-cors', 
		credentials: 'same-origin',
		headers: {
			'Accept': 'application/json',
			
		}
	});

	console.log(`try to check context root :  ${rootContext}`);
