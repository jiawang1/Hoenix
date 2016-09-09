"use strict";
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');



https.createServer(
{
	 key: fs.readFileSync(path.normalize("/Users/i054410/Documents/develop/self-cert/key.pem")),
	 cert: fs.readFileSync(path.normalize("/Users/i054410/Documents/develop/self-cert/cert.pem"))
 }
 ,(req,res)=>{

	console.log(`request come`);

	res.writeHeader(200,{
		'Content-Type': 'application/json'
	});
		const data = [];
		for(let i = 0; i < 100 ; i++){
		
			data.push({
				channel: `srore ${i}`,
				attributeGroup: `group ${Math.ceil(i/10)}`,
				attrbuteCode: `code ${i}`,
				attributeName: `attribute${i}`,
				attributeType: `type${i}`,
				empty: i%2===0?'Yes':'No',
				createTime: new Date().toString(),
				effect:i%2===0?'Yes':'No',
			});
		}

	res.end(JSON.stringify(data));

}).listen(8088, 'localhost');

console.log(`listen to 8088`);
