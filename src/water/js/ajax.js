var Ajax = function(args){
    var xhr = function(){
        if(typeof XMLHttpRequest !="undefined"){
            xhr = function(){
                return new XMLHttpRequest();
            };
        }else if(typeof ActiveXObject !="undefined"){
            xhr = function(){
                return new ActiveXObject("Microsoft.XMLHTTP");
            };
        }else{
            xhr = function(){
                throw new Error("NOT SUPPORT");
            };
        }
        return xhr();
    };
    if(typeof args =="object"){
        var init = xhr();
        var successBack = args.success;
        var errorBack = args.error;
        init.onreadystatechange = function(){
            if(init.readyState == 4){
                if((init.status >=200 && init.status <300) || init.status == 304){
                    return successBack(init.responseText);
                }else{
                    return errorBack(init.status);
                }
            }
        };
        init.open(args.type,args.url,args.async);
        if(args.type == "POST"){
            init.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            init.send(args.data);
        }else{
            init.send(null);
        }

    }
};