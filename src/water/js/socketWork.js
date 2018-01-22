'use strict';
importScripts('ajax.js');
self.onmessage = function (event) {
    setInterval(function(){
    	Ajax({
    		url:event.data.url+"purification/purificationInfo",
    		type:"POST",
			data:{clientId:event.data.clientId},
    		success:function(res){
    			postMessage(res);
    		}
    	});
    },60000);
};


