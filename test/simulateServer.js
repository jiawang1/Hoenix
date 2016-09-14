"use strict";
const express = require('express');
const path = require('path');
const fs = require('fs');

var app = express();
app.use('/fivestarstorefront/_admin/', (req,res )=>{

let options ={
	root: "./../build"
};


var fileName = '';

if(req.url === '/'){

fileName = 'index.html';
}else{
fileName = req.url;

}

res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', fileName);
    }
  });
		

});

app.listen(3000, function(){

	console.log('simulation app listening on port 3000!');
});
