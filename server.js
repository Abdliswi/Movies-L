'use strict';

const express = require("express");

const app = express();

app.get ('/', hellpworldHandler);

function hellpworldHandler(request, response) {
        console.log(request);
}

app.listen(3000 , () => {

    console.log("listen on 3000")
    
});




