define(['text!../html/noBind.html'],function(tpl){
	App.closeToast();
    var view = document.getElementById("views");
    view.innerHTML = tpl;
    var controller = function() {
        controller.onRouteChange = function() {
           
        }
    };
    return {
        controller: controller
    }
});