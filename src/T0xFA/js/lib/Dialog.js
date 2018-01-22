
var MyDialog = (function($){
    var createEl = function(className,id,children){
        return "<div id='"+id+"' class='"+className+"'>"+children+"<\/div>";
    };
    var Dialog = function(){};
    var DialogAll = {
        createDialog:function(type,args){
            var dialog;
            switch (type){
                case "confirm":
                    dialog = new Confirm(args);
                    break;
                case "Toast":
                    dialog = new Toast(args);
                    break;
            }
            return dialog;
        }
    };
    Dialog.prototype = {
        dialog:function(type,args){
            var newDialog = DialogAll.createDialog(type,args);
            newDialog.insertWrap();
        }
    };
    function InsertDialog(id,args){
        var title,content,btn="",btns,wrap,mask,contentWrap,contentClass;
        if(args.hasOwnProperty("title")){
            title = createEl("dialogTit","ConfirmTit",args.title);
            contentClass = "Content";
        } else{
            title = "";
            contentClass = "contentFull";
        }
        if(args.hasOwnProperty("btn")){
            if(typeof args.btn === 'string'){
                btn = createEl("dialogBtn","FirstBtn",args.btn);
                btns = createEl("OneBtn","BtnWrap",btn);
            }else if(typeof args.btn === 'object'){
                for(var b in args.btn){
                    btn += createEl("btn","btn"+b,args.btn[b]);
                }
                btns = createEl("Btn"+args.btn.length,"BtnWrap",btn);
            }else{
                btn = "";
            }
        }else{
            btns = "";
            contentClass = "contentFullScreen";
        }
        content = createEl(contentClass,"ContentConfirm","<div class='txt'>"+(args.content || '')+"<\/div>");
        mask = createEl("dialogMask","MaskConfirm","");
        contentWrap = createEl(args.class || "dialogContent animated " + (args.animate || 'bounceIn'),"contentWrap",title+content+btns);
        wrap = createWrapEl(id,mask+contentWrap);
        return wrap;
    }
    function createWrapEl(id,content){
        var wrap = document.createElement("div");
        wrap.id = "Dialog"+id;
        wrap.className = "dialogWrap";
        wrap.classList.add("animated");
        wrap.innerHTML = content;
        return wrap;
    }
    function AnimationHandle(name){
        $("#contentWrap").on("webkitAnimationEnd",function(e){
            switch (e.animationName){
                case 'bounceIn':
                    $(this).removeClass(name);
                    break;
                case 'bounceOut':
                    $(".dialogWrap").hide();
                    break;
            }
            e.preventDefault();
        });
    }
    function insertElToBody(els,args){
        $(function(){
            try{
                $(".dialogWrap").remove();
            }catch (e){

            }
            document.body.appendChild(els);
            AnimationHandle(args.animate || 'bounceIn');
            try{
                var btnTap = function(el,index){
                    $(el).on("click touchstart",function(e){
                        args.callback(index);
                        e.preventDefault();
                    });
                };
                if(args.hasOwnProperty("btn")){
                    $(".btn").each(function(index){
                        btnTap(this,index);
                    });
                }else{
                    if(args.type !== "loading"){
                        setTimeout(function(){
                            $("#contentWrap").addClass("bounceOut").parent().hide();
                        },1000);
                    }
                }

            }catch(e){

            }
        });
    }
    function Confirm(args){
        var defaultArgs = {
            title:'my title',
            content:"this is a dialog",
            btn:["cancel","confirm"]
        };
        args = args || defaultArgs;
        this.insertWrap = function(){
            insertElToBody(InsertDialog("Confirm",args),args);
        };
    }
    function Toast(args){
        this.insertWrap = function(){
            var el = InsertDialog("Toast",args);
            insertElToBody(el,args);
        };
    }
    return Dialog;
})($);

