(function(mdSmart) {
    var bDebug = true;

    mdSmart.FA_P03 = mdSmart.FA_P03 || {};
    mdSmart.FA_COM = mdSmart.FA_COM || {};

    mdSmart.FA_P03.message = mdSmart.FA_COM.message = mdSmart.FA_COM.message != undefined ? mdSmart.FA_COM.message : (new mdSmart.msg0xFA());
    $(document).bind('recieveMessage', {}, function(event, message) {
        mdSmart.FA_P03.showStatus("", message);
    });
    //安卓本地存储
    mdSmart.FA_P03.setStorage = function(key,val){
        bridge.setterValToStorage(key,val);
    };
    mdSmart.FA_P03.getStorage = function(key,callbackSucc,callbackFail){
        bridge.getterValFromStorage(key,function(val){
            callbackSucc(val);
        },function(error){
           callbackFail(error); 
        });
    };
    /**
     * 转换json 存入安卓本地
     * @param  {String} jsonStr json序列化的字符
     * @return {String}         格式化的字符
     */
    mdSmart.FA_P03.escapeStr = function(jsonStr){
        try{
            var jsonObj = JSON.parse(jsonStr);
            var str = jsonStr.replace(/(\[|\]|\{|\}|\")/g,function(str){
                var srcStr = ["[","]","{","}","\""], replaceStr = ["(",")","<",">","\&"]; 
                return replaceStr[srcStr.indexOf(str)];
            });
            return str; 
        } catch (e){

        }
    };
    /**
     * 转换格式化的字符 - json序列化的字符
     * @param  {String} escapeStr 格式化的字符
     * @return {String}           json序列化的字符
     */
    mdSmart.FA_P03.unescapeStr = function(escapeStr){
        var str = escapeStr.replace(/(\(|\)|\<|\>|\&)/g,function(str){
            var srcStr = ["(",")","<",">","\&"], replaceStr = ["[","]","{","}","\""]; 
            return replaceStr[srcStr.indexOf(str)];
        });
        return str;
    };
    //判断是否为安卓
    mdSmart.FA_P03.isAndroid = function(){
        var u = navigator.userAgent, app = navigator.appVersion;
        return u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
    };
    /**
     * 获取浏览器语言
     * @return {String} zh | en
     */
    mdSmart.FA_P03.language = function(){
        //bridge.getLangCode()
        if(window.navigator.hasOwnProperty("language")){
            var language = window.navigator.language.split("-");
            return language[0];
        }else{
            return "zh";
        }
    };
    //跳转卡片页
    mdSmart.FA_P03.gotoCardPage = function() {
        console.log("function:mdSmart.FA_P03.gotoCardPage");
        if (mdSmart.common.isOperationLock() == true) {
            return false;
        }
        if (mdSmart.common.isPopupLock() == true) {
            return false;
        }
        bridge.goBack();
    };
    //获取卡片标题
    mdSmart.FA_P03.getCardTit = function(callBack) {
        bridge.getCardTitle(function(message) {
            callBack(message);
        });
    };
    //获取设备SN码
    mdSmart.FA_P03.CurrentApplianceID = function() {
        var sn = bridge.getCurrentApplianceID();
        if (sn == "") {
            return 0;
        }
        return sn;
    };
    //获取用户信息
    mdSmart.FA_P03.getUserInfo = function(callback) {
        bridge.getUserInfo(function(messageBack) {
            callback(messageBack);
        });
    };
    //获取家电列表
    mdSmart.FA_P03.getUserApplianceList = function(callback) {
        bridge.getUserApplianceList(function(messageBack) {
            callback(messageBack);
        });
    };
    //请求空调联动
    mdSmart.FA_P03.getAirLinkInfo = function(callback) {
        var functionParamers = {
            queryStrings: {"serviceUrl": "/linkage/queryLinkage"},
            transmitData: {"fanId": mdSmart.FA_P03.CurrentApplianceID()},
            type:"0xAC"
        };
        bridge.requestDataTransmit(functionParamers, function(messageBack) {
            callback(messageBack);
        });
        if(bDebug){
            var testJson = {"errorCode":"0","errMsg":"","result":{"returnData":{"result":{"fanId":"222","acId":"123","status":0,"createTime":"2012-10-20"}}}};
            callback(testJson);    
        }

    };
    //设置空调联动
    mdSmart.FA_P03.setAirLinkInfo = function(acId,status,callback) {
        var functionParamers = {
            queryStrings: {"serviceUrl": "/linkage/reportLinkage"},
            transmitData: {"fanId": mdSmart.FA_P03.CurrentApplianceID(),"acId":acId,"status":status},
            type:"0xAC"
        };
        bridge.requestDataTransmit(functionParamers, function(messageBack) {
            callback(messageBack);
        });
        if(bDebug){
            var testJson = {"errorCode":"0","errMsg":"","result":{"returnData":{"result":"0"}}};
            callback(testJson);
        }

    };
    mdSmart.FA_P03.getSleepChart = function(callback){

        var functionParamers = {
            queryStrings: { "serviceUrl": "/sleepCurve/getSleepCurveInfo"},
            transmitData: {"applianceId": mdSmart.FA_P03.CurrentApplianceID()},
            type:"0xFA"
        };
        bridge.requestDataTransmit(functionParamers, function(messageBack) {
            callback(messageBack);
        });
        if(bDebug){
            var testJson = { 
                "errorCode": "0",
                "result": { 
                    "returnData": { 
                        "result": "1",
                        "sleepCurve": [{ 
                            "id": 0, 
                            "applianceId": 123, 
                            "curveName": "", 
                            "startTime": "",
                            "status":1, 
                            "value0": 23, 
                            "value1": 12, 
                            "value2": 12, 
                            "value3": 13, 
                            "value4": 13, 
                            "value5": 14, 
                            "value6": 14, 
                            "value7": 15, 
                            "value8": 15, 
                            "value9": 15, 
                            "value10": 18, 
                            "value11": 18 
                        }] 
                    } 
                } 
            }
            callback(testJson);
        }

    };

    mdSmart.FA_P03.setSleepChart = function(sleepCurveId,sleepCurveArr,callback){
        var data = {};
        data['sleepCurveId'] = sleepCurveId;
        data['applianceId'] = mdSmart.FA_P03.CurrentApplianceID();
        for(var i=0;i<sleepCurveArr.length;i++){
            data["value"+i] = sleepCurveArr[i];
        }

        var functionParamers = {
            queryStrings: { "serviceUrl": "/sleepCurve/updateSleepCurve"},
            transmitData: data,
            type:"0xFA"
        };
        bridge.requestDataTransmit(functionParamers, function(messageBack) {
            callback(messageBack);
        });
        if(bDebug){
            var testJson = { 
                "errorCode": "0",
                "result": { 
                    "returnData": { 
                        "result": "1",
                        "sleepCurve": [{ 
                            "id": 0, 
                            "applianceId": 123, 
                            "curveName": "", 
                            "startTime": "",
                            "status":2, 
                            "value0": 23, 
                            "value1": 12, 
                            "value2": 12, 
                            "value3": 13, 
                            "value4": 13, 
                            "value5": 14, 
                            "value6": 14, 
                            "value7": 15, 
                            "value8": 15, 
                            "value9": 15, 
                            "value10": 18, 
                            "value11": 18 
                        }] 
                    } 
                } 
            };
            callback(testJson);
        }

    };
    mdSmart.FA_P03.startSleepChart = function(sleepCurveId,callback){
        var functionParamers = {
            queryStrings: { "serviceUrl": "/sleepCurve/startSleepCurve"},
            transmitData: {'sleepCurveId':sleepCurveId,'applianceId':mdSmart.FA_P03.CurrentApplianceID()},
            type:"0xFA"
        };
        bridge.requestDataTransmit(functionParamers, function(messageBack) {
            callback(messageBack);
        }); 
        if(bDebug){
            var testJson = {"errorCode":"0","result":{"returnData":{"result":"1"}}};
            callback(testJson);
        }

    };
    mdSmart.FA_P03.closeSleepChart = function(sleepCurveId,callback){
        var functionParamers = {
            queryStrings: { "serviceUrl": "/sleepCurve/closeSleepCurve"},
            transmitData: {'sleepCurveId':sleepCurveId,'applianceId':mdSmart.FA_P03.CurrentApplianceID()},
            type:"0xFA"
        };
        bridge.requestDataTransmit(functionParamers, function(messageBack) {
            callback(messageBack);
        }); 
        if(bDebug){
            var testJson = {"errorCode":"0","result":{"returnData":{"result":"1"}}};
            callback(testJson);
        }

    };
    mdSmart.FA_P03.getDefineInfo = function(callback){
        var getData = function(localStatus){
            var hasError = (localStatus != null && localStatus !== "") ? false : true;
            var json = {
                "errorCode":hasError ? "400" : "0",
                "msg":hasError ? "无法获取自定义内容" : "0",
                "result":hasError ? "null" : JSON.parse(localStatus)
            };
            return json;  
        };
        var iosData = function(){
            var localStatus = window.localStorage.getItem("FA_define_"+mdSmart.FA_P03.CurrentApplianceID());
            callback(getData(localStatus));
        };
        var androidData = function(){
            var keyPre = "FA_define_"+mdSmart.FA_P03.CurrentApplianceID();
            mdSmart.FA_P03.getStorage(keyPre,function(val){
                var unescapeStr = mdSmart.FA_P03.unescapeStr(val);
                try {
                    var json = JSON.parse(unescapeStr);
                    callback(getData(JSON.stringify(json)));
                } catch (e){

                }
            },function(res){
                callback(getData(res));
            });
        };
        mdSmart.FA_P03.isAndroid() ? androidData() : iosData();

        if(bDebug){
            var testJson = {"errorCode":"0","msg":"","result":{"currDefineId":"","defineData":[{"defineId":"","name":"dd","gear":17,"shake":60,"hour":0,"min":0}]}};
            callback(testJson);
        }
    };
    mdSmart.FA_P03.setDefineInfo = function(json,callback){
        var androidData = function(){
            var jsonStr = JSON.stringify(json),
                escapeStr = mdSmart.FA_P03.escapeStr(jsonStr);
            mdSmart.FA_P03.setStorage("FA_define_"+mdSmart.FA_P03.CurrentApplianceID(),escapeStr);
        };
        var iosData = function(){
            window.localStorage.setItem("FA_define_"+mdSmart.FA_P03.CurrentApplianceID(),JSON.stringify(json))
        };
        mdSmart.FA_P03.isAndroid() ? androidData() : iosData();
        mdSmart.FA_P03.getDefineInfo(callback);

        if(bDebug){
            var testJson = {"errorCode":"0","msg":"","result":{"currDefineId":"","defineData":[{"defineId":"","name":"dd","gear":17,"shake":60,"hour":0,"min":0}]}};
            callback(testJson);
        }
    };
    mdSmart.FA_P03.showLoading = function() {
        bridge.showProgress();
    };
    mdSmart.FA_P03.closeLoading = function() {
        bridge.closeProgress();
    };
    // 家电信息页
    mdSmart.FA_P03.gotoInfoPage = function() {
        console.log("function:mdSmart.FA_P03.gotoInfoPage");
        if (mdSmart.common.isOperationLock() == true) {
            return false;
        }
        if (mdSmart.common.isPopupLock() == true) {
            return false;
        }
    };

    // 设备SN读取-请求
    mdSmart.FA_P03.cmdRequestReadDevSn = function() {
        console.log("function:mdSmart.FA_P03.cmdRequestReadDevSn");
        var workingStatusMessage = mdSmart.FA_P03.message.getDevSnBack();
        // For Debug
        if (bDebug == true) {
            if (workingStatusMessage == undefined) {
                var cmdRequest = mdSmart.FA_P03.message.cmdRequestReadDevSn();
                var cmdId = bridge.startCmdProcess(cmdRequest, function(messageBack) {
                    mdSmart.FA_P03.showStatus(cmdRequest, messageBack);
                });
                var messageBody = mdSmart.message.createMessageBody(32);
                for (var i = 0; i < 29; i++) {
                    mdSmart.message.setByte(messageBody, i, 0x01);
                }
                var message = mdSmart.message.createMessage(0xFA, 0x07, messageBody);
                var bridgeMessage = mdSmart.message.converMessageToBridgePStr(message);
                bridge.callbackFunction(cmdId, bridgeMessage);
            } else {
                mdSmart.FA_P03.showStatus("-------------------", workingStatusMessage);
            }
        } else {
            var cmdRequest = mdSmart.FA_P03.message.cmdRequestReadDevSn();
            var cmdId = bridge.startCmdProcess(cmdRequest, function(messageBack) {
                mdSmart.FA_P03.showStatus(cmdRequest, messageBack);
            });
        }
    };
    // 查询设备状态
    mdSmart.FA_P03.cmdRequestStatus = function() {
        console.log("function:mdSmart.FA_P03.cmdRequestStatus");
        if (mdSmart.common.isOperationLock() == true) {
            return false;
        }
        if (mdSmart.common.isPopupLock() == true) {
            return false;
        }
        var cmdBytes = mdSmart.FA_P03.message.cmdRequestStatus();
        mdSmart.FA_P03.beforeSendCmd(cmdBytes);
        var cmdId = bridge.startCmdProcess(cmdBytes, function(data) {
            mdSmart.FA_P03.showStatus(cmdBytes, data);
        });
        mdSmart.FA_P03.afterSendCmd(cmdId, cmdBytes);
    };

    //设置场景-无
    mdSmart.FA_P03.cmdControlScene = function(type) {
        console.log("function:mdSmart.FA_P03.cmdControlScene");
        if (mdSmart.common.isOperationLock() == true) {
            return false;
        }
        if (mdSmart.common.isPopupLock() == true) {
            return false;
        }
        var cmdBytes = mdSmart.FA_P03.message.cmdControlScene(type);
        mdSmart.FA_P03.beforeSendCmd(cmdBytes);
        var cmdId = bridge.startCmdProcess(cmdBytes, function(data) {
            mdSmart.FA_P03.showStatus(cmdBytes, data);
        });
        mdSmart.FA_P03.afterSendCmd(cmdId, cmdBytes);
    };

    //睡眠风开演示
    mdSmart.FA_P03.cmdControlTestOn = function() {
        console.log("function:mdSmart.FA_P03.cmdControlTestOn");
        if (mdSmart.common.isOperationLock() == true) {
            return false;
        }
        if (mdSmart.common.isPopupLock() == true) {
            return false;
        }
        var cmdBytes = mdSmart.FA_P03.message.cmdControlTestOn();
        mdSmart.FA_P03.beforeSendCmd(cmdBytes);
        var cmdId = bridge.startCmdProcess(cmdBytes, function(data) {
            mdSmart.FA_P03.showStatus(cmdBytes, data);
        });
        mdSmart.FA_P03.afterSendCmd(cmdId, cmdBytes);
    };

    //睡眠风关演示
    mdSmart.FA_P03.cmdControlTestOff = function() {
        console.log("function:mdSmart.FA_P03.cmdControlTestOff");
        if (mdSmart.common.isOperationLock() == true) {
            return false;
        }
        if (mdSmart.common.isPopupLock() == true) {
            return false;
        }
        var cmdBytes = mdSmart.FA_P03.message.cmdControlTestOff();
        mdSmart.FA_P03.beforeSendCmd(cmdBytes);
        var cmdId = bridge.startCmdProcess(cmdBytes, function(data) {
            mdSmart.FA_P03.showStatus(cmdBytes, data);
        });
        mdSmart.FA_P03.afterSendCmd(cmdId, cmdBytes);
    };

    // 打开摇头
    mdSmart.FA_P03.cmdControlShakeSwitchOn = function() {
        console.log("function:mdSmart.FA_P03.cmdControlShakeSwitchOn");
        if (mdSmart.common.isOperationLock() == true) {
            return false;
        }
        if (mdSmart.common.isPopupLock() == true) {
            return false;
        }
        var cmdBytes = mdSmart.FA_P03.message.cmdControlShakeSwitchOn();
        mdSmart.FA_P03.beforeSendCmd(cmdBytes);
        var cmdId = bridge.startCmdProcess(cmdBytes, function(messageBack) {
            mdSmart.FA_P03.showStatus(cmdBytes, messageBack);
        });
        mdSmart.FA_P03.afterSendCmd(cmdId, cmdBytes);
    };
    mdSmart.FA_P03.cmdControlGearAndWindType = function(){
        console.log("function:mdSmart.FA_P03.cmdControlGearAndWindType");
        if (mdSmart.common.isOperationLock() == true) {
            return false;
        }
        if (mdSmart.common.isPopupLock() == true) {
            return false;
        }
        var cmdBytes = mdSmart.FA_P03.message.cmdControlGearAndWindType();
        mdSmart.FA_P03.beforeSendCmd(cmdBytes);
        var cmdId = bridge.startCmdProcess(cmdBytes, function(messageBack) {
            mdSmart.FA_P03.showStatus(cmdBytes, messageBack);
        });
        mdSmart.FA_P03.afterSendCmd(cmdId, cmdBytes);
    };
    // 关闭摇头
    mdSmart.FA_P03.cmdControlShakeSwitchOff = function() {
        console.log("function:mdSmart.FA_P03.cmdControlShakeSwitchOff");
        if (mdSmart.common.isOperationLock() == true) {
            return false;
        }
        if (mdSmart.common.isPopupLock() == true) {
            return false;
        }
        var cmdBytes = mdSmart.FA_P03.message.cmdControlShakeSwitchOff();
        mdSmart.FA_P03.beforeSendCmd(cmdBytes);
        var cmdId = bridge.startCmdProcess(cmdBytes, function(messageBack) {
            mdSmart.FA_P03.showStatus(cmdBytes, messageBack);
        });
        mdSmart.FA_P03.afterSendCmd(cmdId, cmdBytes);
    };
    // 设置摇头（摆风）角度 | 1 30° | 2 60° | 3 90° | 4 120° | 5 180° | 6 360°
    mdSmart.FA_P03.cmdControlShakeAngle = function(angle) {

        console.log("function:mdSmart.FA_P03.cmdControlShakeAngle");
        if (mdSmart.common.isOperationLock() == true) {
            return false;
        }
        if (mdSmart.common.isPopupLock() == true) {
            return false;
        }
        var cmdBytes = mdSmart.FA_P03.message.cmdControlShakeAngle(angle);
        mdSmart.FA_P03.beforeSendCmd(cmdBytes);
        var cmdId = bridge.startCmdProcess(cmdBytes, function(messageBack) {
            mdSmart.FA_P03.showStatus(cmdBytes, messageBack);
        });
        mdSmart.FA_P03.afterSendCmd(cmdId, cmdBytes);
    };
    // 设备立刻开机,定时关机
    mdSmart.FA_P03.cmdPowerOnAndTimerPowerOffHourAndMinutesFunction = function(h, m) {
        console.log("function:mdSmart.FA_P03.cmdPowerOnAndTimerPowerOffHourAndMinutesFunction");
        if (mdSmart.common.isOperationLock() == true) {
            return false;
        }
        if (mdSmart.common.isPopupLock() == true) {
            return false;
        }
        var cmdBytes = mdSmart.FA_P03.message.cmdPowerOnAndTimerPowerOffHourAndMinutesFunction(h, m);
        mdSmart.FA_P03.beforeSendCmd(cmdBytes);
        var cmdId = bridge.startCmdProcess(cmdBytes, function(messageBack) {
            mdSmart.FA_P03.showStatus(cmdBytes, messageBack);
        });
        mdSmart.FA_P03.afterSendCmd(cmdId, cmdBytes);
    };
    // 设备立刻关机，定时开机
    mdSmart.FA_P03.cmdPowerOffAndTimerPowerOnHourAndMinutesFunction = function(h, m) {
        console.log("function:mdSmart.FA_P03.cmdPowerOffAndTimerPowerOnHourAndMinutesFunction");
        if (mdSmart.common.isOperationLock() == true) {
            return false;
        }
        if (mdSmart.common.isPopupLock() == true) {
            return false;
        }
        var cmdBytes = mdSmart.FA_P03.message.cmdPowerOffAndTimerPowerOnHourAndMinutesFunction(h, m);
        var cmdId = bridge.startCmdProcess(cmdBytes, function(messageBack) {
            mdSmart.FA_P03.showStatus(cmdBytes, messageBack);
        });
        mdSmart.FA_P03.afterSendCmd(cmdId, cmdBytes);
    };
    // 取消定时关机
    mdSmart.FA_P03.cmdControlCancelTimerPowerOff = function() {
        console.log("function:mdSmart.FA_P03.cmdControlCancelTimerPowerOff");
        if (mdSmart.common.isOperationLock() == true) {
            return false;
        }
        if (mdSmart.common.isPopupLock() == true) {
            return false;
        }
        var cmdBytes = mdSmart.FA_P03.message.cmdControlCancelTimerPowerOff();
        var cmdId = bridge.startCmdProcess(cmdBytes, function(messageBack) {
            mdSmart.FA_P03.showStatus(cmdBytes, messageBack);
        });
        mdSmart.FA_P03.afterSendCmd(cmdId, cmdBytes);
    };
    mdSmart.FA_P03.cmdControlCancelTimerPowerOffAndScene = function(scene) {
        console.log("function:mdSmart.FA_P03.cmdControlCancelTimerPowerOffAndScene");
        if (mdSmart.common.isOperationLock() == true) {
            return false;
        }
        if (mdSmart.common.isPopupLock() == true) {
            return false;
        }
        var cmdBytes = mdSmart.FA_P03.message.cmdControlCancelTimerPowerOffAndScene(scene);
        var cmdId = bridge.startCmdProcess(cmdBytes, function(messageBack) {
            mdSmart.FA_P03.showStatus(cmdBytes, messageBack);
        });
        mdSmart.FA_P03.afterSendCmd(cmdId, cmdBytes);
    };
    // 取消定时开机
    mdSmart.FA_P03.cmdControlCancelTimerPowerOn = function() {
        console.log("function:mdSmart.FA_P03.cmdControlCancelTimerPowerOn");
        if (mdSmart.common.isOperationLock() == true) {
            return false;
        }
        if (mdSmart.common.isPopupLock() == true) {
            return false;
        }
        var cmdBytes = mdSmart.FA_P03.message.cmdControlCancelTimerPowerOn();
        var cmdId = bridge.startCmdProcess(cmdBytes, function(messageBack) {
            mdSmart.FA_P03.showStatus(cmdBytes, messageBack);
        });
        mdSmart.FA_P03.afterSendCmd(cmdId, cmdBytes);
    };
    // 电源控制-开机
    mdSmart.FA_P03.cmdControlPowerOn = function() {
        console.log("function:mdSmart.FA_P03.cmdControlPowerOn");
        if (mdSmart.common.isOperationLock() == true) {
            return false;
        }
        if (mdSmart.common.isPopupLock() == true) {
            return false;
        }
        var cmdBytes = mdSmart.FA_P03.message.cmdControlPowerOn();
        mdSmart.FA_P03.beforeSendCmd(cmdBytes);
        var cmdId = bridge.startCmdProcess(cmdBytes, function(data) {
            mdSmart.FA_P03.showStatus(cmdBytes, data);
        });
        mdSmart.FA_P03.afterSendCmd(cmdId, cmdBytes);
    };
    mdSmart.FA_P03.cmdControlPowerOnAndScene = function(scene) {
        console.log("function:mdSmart.FA_P03.cmdControlPowerOnAndScene");
        if (mdSmart.common.isOperationLock() == true) {
            return false;
        }
        if (mdSmart.common.isPopupLock() == true) {
            return false;
        }
        var cmdBytes = mdSmart.FA_P03.message.cmdControlPowerOnAndScene(scene);
        mdSmart.FA_P03.beforeSendCmd(cmdBytes);
        var cmdId = bridge.startCmdProcess(cmdBytes, function(data) {
            mdSmart.FA_P03.showStatus(cmdBytes, data);
        });
        mdSmart.FA_P03.afterSendCmd(cmdId, cmdBytes);
    };
    // 电源控制:正在关机
    mdSmart.FA_P03.cmdCtrolPowerCloseConfirm = function() {
        console.log("function:mdSmart.FA_P03.cmdCtrolPowerCloseConfirm");
        // IOSLOG
        bridge.logToIOS("FA_P03 cmdCtrolPowerCloseConfirm start");
        if (mdSmart.common.isOperationLock() == true) {
            bridge.logToIOS("FA_P03 cmdCtrolPowerCloseConfirm isOperationLock=true");
            return false;
        }
        if (mdSmart.common.isPopupLock() == true) {
            bridge.logToIOS("FA_P03 cmdCtrolPowerCloseConfirm isPopupLock=true");
            return false;
        }

        var cmdBytes = mdSmart.FA_P03.message.cmdControlPowerOff();
        mdSmart.FA_P03.beforeSendCmd(cmdBytes);
        var cmdId = bridge.startCmdProcess(cmdBytes, function(data) {
            mdSmart.FA_P03.showStatus(cmdBytes, data);
        }, function(errCode) {
            if (errCode == -1) {

            }
        });
        mdSmart.FA_P03.afterSendCmd(cmdId, cmdBytes);
        // IOSLOG
        bridge.logToIOS("FA_P03 cmdCtrolPowerCloseConfirm end");
    };

    //控制语音
    mdSmart.FA_P03.cmdControlDevVoice = function(type) {
        console.log("function:mdSmart.FA_P03.cmdControlDevVoice");
        if (mdSmart.common.isOperationLock() == true) {
            return false;
        }
        if (mdSmart.common.isPopupLock() == true) {
            return false;
        }
        var cmdBytes = mdSmart.FA_P03.message.cmdControlDevVoice(type);
        mdSmart.FA_P03.beforeSendCmd(cmdBytes);
        var cmdId = bridge.startCmdProcess(cmdBytes, function(data) {
            mdSmart.FA_P03.showStatus(cmdBytes, data);
        });
        mdSmart.FA_P03.afterSendCmd(cmdId, cmdBytes);
    };
    //控制语音 and 场景
    mdSmart.FA_P03.cmdControlDevVoiceAndScene = function(type, scene) {
        console.log("function:mdSmart.FA_P03.cmdControlDevVoiceAndScene");
        if (mdSmart.common.isOperationLock() == true) {
            return false;
        }
        if (mdSmart.common.isPopupLock() == true) {
            return false;
        }
        var cmdBytes = mdSmart.FA_P03.message.cmdControlDevVoiceAndScene(type, scene);
        mdSmart.FA_P03.beforeSendCmd(cmdBytes);
        var cmdId = bridge.startCmdProcess(cmdBytes, function(data) {
            mdSmart.FA_P03.showStatus(cmdBytes, data);
        });
        mdSmart.FA_P03.afterSendCmd(cmdId, cmdBytes);
    };
    mdSmart.FA_P03.showStatus = function(dataRequest, dataBack) {
        console.log("function:mdSmart.FA_P03.showStatus", dataBack);
        var jsonStatus = mdSmart.FA_P03.message.parseMessageForView(dataBack);
        window.localStorage.setItem("FA_" + mdSmart.FA_P03.CurrentApplianceID(), JSON.stringify(jsonStatus));
        console.log(JSON.stringify(jsonStatus));
        mdSmart.FA_P03.showStatusByJson(jsonStatus);
    };
    // 命令发送前处理
    mdSmart.FA_P03.beforeSendCmd = function(cmdBytes) {
        console.log("function:mdSmart.FA_P03.beforeSendCmd", cmdBytes);
        var cmd = [];
        for (var i = 0; i < cmdBytes.length; i++) {
            var id = cmdBytes[i].toString(16);
            cmd.push(id);
        }
        console.log(cmd);
    };
    // 命令发送后处理
    mdSmart.FA_P03.afterSendCmd = function(cmdId, cmdBytes) {
        console.log("function:mdSmart.FA_P03.afterSendCmd");
        // For Debug
        if (bDebug == true) {

            var cmdMessageType = cmdBytes[9],
                cmdMessageBody = cmdBytes.slice(10, cmdBytes.length - 1);;
            var statusMessage = mdSmart.FA_P03.message.getRequestStatusBack();
            var messageBody = mdSmart.message.createMessageBody(19);
            if (statusMessage != undefined) {
                messageBody = statusMessage.slice(10, statusMessage.length - 1);
            } else {
                mdSmart.message.setByte(messageBody, 5, 2);
                mdSmart.message.setBits(messageBody, 10, 5, 7, 0x06);
                mdSmart.message.setBits(messageBody, 11, 5, 7, 0x06);
                // 温度
                mdSmart.message.setByte(messageBody, 13, 65);
            }
            var messageType = cmdMessageType;

            switch (cmdMessageType) {
                case 0x02:
                    if (mdSmart.message.getBit(cmdMessageBody, 4, 7) != 0x01) {
                        mdSmart.message.setBit(messageBody, 4, 0, mdSmart.message.getByte(cmdMessageBody, 4, 0));
                    }
                    if (mdSmart.message.getByte(cmdMessageBody, 5) != 0x00) {
                        mdSmart.message.setByte(messageBody, 5, mdSmart.message.getByte(cmdMessageBody, 5));
                    }
                    if (mdSmart.message.getBits(cmdMessageBody, 4, 1, 3) != 0x00) {
                        mdSmart.message.setBits(messageBody, 4, 1, 3, mdSmart.message.getBits(cmdMessageBody, 4, 1, 3));
                    }
                    if (mdSmart.message.getBits(cmdMessageBody, 8, 4, 6) != 0x00) {
                        mdSmart.message.setBits(messageBody, 8, 4, 6, mdSmart.message.getBits(cmdMessageBody, 8, 4, 6));
                    }
                    mdSmart.message.setByte(messageBody, 2, mdSmart.message.getByte(cmdMessageBody, 2));
                    mdSmart.message.setByte(messageBody, 8, mdSmart.message.getByte(cmdMessageBody, 8));
                    mdSmart.message.setByte(messageBody, 10, mdSmart.message.getByte(cmdMessageBody, 10));
                    mdSmart.message.setByte(messageBody, 11, mdSmart.message.getByte(cmdMessageBody, 11));
                    mdSmart.message.setByte(messageBody, 14, mdSmart.message.getByte(cmdMessageBody, 14));
                    mdSmart.message.setByte(messageBody, 16, mdSmart.message.getByte(cmdMessageBody, 16));
                    break;
            }
            var message = mdSmart.message.createMessage(0xFA, messageType, messageBody);
            var bridgeMessage = mdSmart.message.converMessageToBridgePStr(message);
            bridge.callbackFunction(cmdId, bridgeMessage);
        }
    };



    // 取得剩余分钟
    function getsurplusMin(hour, min) {

        // 系统时间
        var dateTime = new Date();
        // 剩余分钟
        var surplusMin = 0;
        // 画面上时间转化成分钟
        var sumMin = parseInt(hour) * 60 + parseInt(min);
        // 系统小时
        var syshh = dateTime.getHours();
        // 系统分钟
        var sysmm = dateTime.getMinutes();
        // 系统时间转化成分钟
        var sumMinSys = parseInt(syshh) * 60 + parseInt(sysmm);

        // 输入时间大于系统时间 
        if (sumMin >= sumMinSys) {
            // 还剩余多少时间
            surplusMin = sumMin - sumMinSys;
        } else {
            // 还剩余多少时间
            surplusMin = 24 * 60 - (sumMinSys - sumMin);
        }

        return surplusMin;
    }

    // 取得显示时间
    function getViewTime(hour, min, flg) {

        // 系统时间
        var dateTime = new Date();
        // 显示时间
        var viewMin = "";
        // 后台时间转化成分钟
        var sumMin = parseInt(hour) * 60 + parseInt(min);

        if (sumMin == 0) {
            viewMin = "00:00";
            return viewMin;
        }
        // 本地保存小时
        var saveHour = "";
        // 本地保存分钟
        var saveMin = "";
        // 本地保存时间
        var saveSumMin = "";
        if (flg == "on") {
            saveHour = mdSmart.common.getLsVar(0xFA, "onHourValue");
            saveMin = mdSmart.common.getLsVar(0xFA, "onMinuteValue");
        } else {
            saveHour = mdSmart.common.getLsVar(0xFA, "offHourValue");
            saveMin = mdSmart.common.getLsVar(0xFA, "offMinuteValue");
        }

        saveHour = saveHour == undefined ? hour : saveHour;
        saveMin = saveMin == undefined ? min : saveMin;

        saveSumMin = getsurplusMin(saveHour, saveMin);

        if (Math.abs(saveSumMin - sumMin) > 5) {
            // 取得XX分钟后的时间
            dateTime.setMinutes(dateTime.getMinutes() + parseInt(sumMin));
        } else {
            // 取得XX分钟后的时间
            dateTime.setMinutes(dateTime.getMinutes() + parseInt(saveSumMin));
        }

        // 显示小时
        var hh = dateTime.getHours();
        // 显示分钟
        var mm = dateTime.getMinutes();
        viewMin = hh + ":" + mm;

        return viewMin;
    }

})(mdSmart);
