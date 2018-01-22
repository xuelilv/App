
require('./sass/main.scss');
require('es6-promise').polyfill();
import Vue from 'vue';
import Router from 'vue-router';
import touch from "vue-touch";
import VueI18n from "vue-i18n";
import {configRouter} from './routeConfig';
import {App} from "./pages/app";
import store from "./store";
import i18nZh from "./i18n/zh";
import i18nEn from "./i18n/en";

Vue.use(Router);
Vue.use(touch);
Vue.use(VueI18n);

Vue.config.debug = false;
var debug = false;
var router = new Router();
configRouter(router);

// set lang
Vue.config.lang = mdSmart.FA_P03.language();

// set locales
Vue.locale("zh",i18nZh);
Vue.locale("en",i18nEn);

//title
mdSmart.FA_P03.getCardTit(function(message){
	store.actions.setDeviceName(message);
});

//status
mdSmart.FA_P03.showStatusByJson = function(json){
    console.log("function:mdSmart.FA_P03.showStatusByJson");
    store.actions.setStatusJson(json);
};

// 设置风类型 
// 0x01 正常风 | 0x02 自然风 | 0x04 睡眠风 | 0x08 舒适风 
mdSmart.FA_P03.cmdControlWindType = function(type) {
    console.log("function:mdSmart.FA_P03.cmdControlWindType");
    return new Promise(function(resolve, reject){
        var cmdBytes = mdSmart.FA_P03.message.cmdControlWindType(type);
        mdSmart.FA_P03.beforeSendCmd(cmdBytes);
        var cmdId = bridge.startCmdProcess(cmdBytes,function(data){
            mdSmart.FA_P03.showStatus(cmdBytes,data);
            resolve(true);
        });
        mdSmart.FA_P03.afterSendCmd(cmdId,cmdBytes);        
    });
};

//修正场景控制---同步

//设置场景 + 档位
mdSmart.FA_P03.cmdControlSceneAndGear = function(type,gear) {
    console.log("function:mdSmart.FA_P03.cmdControlSceneAndGear"+gear);
    return new Promise(function(resolve, reject){
        var cmdBytes = mdSmart.FA_P03.message.cmdControlSceneAndGear(type,gear);
        mdSmart.FA_P03.beforeSendCmd(cmdBytes);
        var cmdId = bridge.startCmdProcess(cmdBytes,function(data){
            mdSmart.FA_P03.showStatus(cmdBytes,data);
            resolve(true);
        });
        mdSmart.FA_P03.afterSendCmd(cmdId,cmdBytes);   
    }); 
};

//设置场景 + 摇头
mdSmart.FA_P03.cmdControlSceneAndShake = function(type,shake) {
    console.log("function:mdSmart.FA_P03.cmdControlSceneAndShake");
    return new Promise(function(resolve, reject){
        var cmdBytes = mdSmart.FA_P03.message.cmdControlSceneAndShake(type,shake);
        mdSmart.FA_P03.beforeSendCmd(cmdBytes);
        var cmdId = bridge.startCmdProcess(cmdBytes,function(data){
            mdSmart.FA_P03.showStatus(cmdBytes,data);
            resolve(true);
        });
        mdSmart.FA_P03.afterSendCmd(cmdId,cmdBytes);           
    });

};
//设置场景 + 关闭摇头
mdSmart.FA_P03.cmdControlSceneAndCloseShake = function(type) {
    console.log("function:mdSmart.FA_P03.cmdControlSceneAndCloseShake");
    return new Promise(function(resolve, reject){
        var cmdBytes = mdSmart.FA_P03.message.cmdControlSceneAndCloseShake(type);
        mdSmart.FA_P03.beforeSendCmd(cmdBytes);
	    var cmdId = bridge.startCmdProcess(cmdBytes,function(data){
	        mdSmart.FA_P03.showStatus(cmdBytes,data);
	        resolve(true);
	    });
	    mdSmart.FA_P03.afterSendCmd(cmdId,cmdBytes);    	
    });

};
//设置场景+定时关
mdSmart.FA_P03.cmdControlSceneAndBookTime = function(type,pHour,pMinutes) {
    console.log("function:mdSmart.FA_P03.cmdControlSceneAndBookTime");
    return new Promise(function(resolve, reject){
        var cmdBytes = mdSmart.FA_P03.message.cmdControlSceneAndBookTime(type,pHour,pMinutes);
        mdSmart.FA_P03.beforeSendCmd(cmdBytes);
        var cmdId = bridge.startCmdProcess(cmdBytes,function(data){
            mdSmart.FA_P03.showStatus(cmdBytes,data);
            resolve(true);
        });
        mdSmart.FA_P03.afterSendCmd(cmdId,cmdBytes);           
    });

};
//设置场景+关闭定时关
mdSmart.FA_P03.cmdControlSceneAndCloseBookTime = function(type) {
    console.log("function:mdSmart.FA_P03.cmdControlSceneAndCloseBookTime");
    return new Promise(function(resolve, reject){
        var cmdBytes = mdSmart.FA_P03.message.cmdControlSceneAndCloseBookTime(type);
        mdSmart.FA_P03.beforeSendCmd(cmdBytes);
	    var cmdId = bridge.startCmdProcess(cmdBytes,function(data){
	        mdSmart.FA_P03.showStatus(cmdBytes,data);
	        resolve(true);
	    });
	    mdSmart.FA_P03.afterSendCmd(cmdId,cmdBytes);    	
    });

};

//家电信息查询
mdSmart.FA_P03.cmdRequestHomeApplianceInfo = function() {
    console.log("function:mdSmart.FA_P03.cmdRequestHomeApplianceInfo");
    return new Promise(function(resolve, reject){
        var cmdBytes = mdSmart.FA_P03.message.cmdRequestHomeApplianceInfo();
        mdSmart.FA_P03.beforeSendCmd(cmdBytes);
        var cmdId = bridge.startCmdProcess(cmdBytes,function(data){
            console.log(data[12],"data[12]");
            var type = data[12];
            store.actions.setDeviceInfo(parseInt(type,10));//data[12]
            resolve(true);
        });
        mdSmart.FA_P03.afterSendCmd(cmdId,cmdBytes);

        if(debug){
            store.actions.setDeviceInfo(4);//data[12]
            resolve(true);
        }       
    });

}; 
//设置风速 1-26档
mdSmart.FA_P03.cmdControlGear = function(gear) {
    console.log("function:mdSmart.FA_P03.cmdControlGear" + gear);
    return new Promise(function(resolve, reject){
        var cmdBytes = mdSmart.FA_P03.message.cmdControlGear(gear);
        mdSmart.FA_P03.beforeSendCmd(cmdBytes);
        var cmdId = bridge.startCmdProcess(cmdBytes, function(messageBack) {
            mdSmart.FA_P03.showStatus(cmdBytes, messageBack);
            resolve(true);
        });
        mdSmart.FA_P03.afterSendCmd(cmdId, cmdBytes);
    });

};
mdSmart.FA_P03.getUserApplianceList(function(res){
    for(var i in res){
        var type = res[i].type;
        if(type == -84 || type == "AC"){//空调 -84
            store.actions.setAirDeviceList({
                'applicationId':res[i].applianceId,
                'name':res[i].name
            });
        }
    }
});

document.body.addEventListener("touchmove",function(ev){
    ev.preventDefault();
},false);
document.body.addEventListener("touchstart",function(ev){
    if(ev.target.nodeName !== "INPUT"){
        $("#defineSceneName").blur();
    }
},false);

router.start(App, '#pages');
