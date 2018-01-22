(function (mdSmart) {
    mdSmart.FA_P02 = mdSmart.FA_P02 || {};
	mdSmart.FA_COM = mdSmart.FA_COM || {};
	var bDebug = false;
	var deviceType = null;
	var deviceId = bridge.getCurrentApplianceID();
	if(deviceId == ""){
		deviceId = 0;
	}
    $(document).on('pageinit', 'div[id="FA_P02"]', function (event) {
        console.log('#FA_P02 pageinit.');
		mdSmart.FA_P02.message = mdSmart.FA_COM.message = mdSmart.FA_COM.message != undefined?mdSmart.FA_COM.message:(new mdSmart.msg0xFA());
		$(document).unbind('recieveMessage').bind('recieveMessage',{},  function(event,message){
			mdSmart.FA_P02.showStatus("",message);
		});
		$("#FA_P02_BTN_POWER").hide();
    });
	
    $(document).on('pageshow', 'div[id="FA_P02"]', function (event) {
        console.log('#FA_P02 pageshow.');
		$("#FA_P02_BTN_POWER").unbind('tap').bind('tap', {}, mdSmart.FA_P02.cmdControlPowerOn);
		$("#FA_P02_LBL_CURRENTTEMPERATURE_LEFT").parents(".text").hide();
		mdSmart.FA_P02.cmdRequestHomeApplianceInfo();
        
    });

    $(document).on('pagehide', 'div[id="FA_P02"]', function (event) {
        console.log('#FA_P02 pagehide.');
		$("#FA_P02_BTN_POWER").unbind('tap');
		
		
		$("#FA_P02_BTN_POWER span").removeClass("card_bottom_but_waiting");
		mdSmart.common.isCartBtnLockControl(false);
		
//		$("#FA_P02_BTN_POWER").hide();
    });

    mdSmart.FA_P02.prepareAndShow = function() {
        console.log("mdSmart.FA_P02.prepareAndShow");
		mdSmart.FA_P02.cmdRequestStatus();
		bridge.getCardTitle(function(message){
			$("#FA_P02_LBL_TITLE").html(message);
		});
		$("#FA_P02_LBL_CURRENTTEMPERATURE_LEFT").html(mdSmart.i18n.FA_P01_LBL_CURRENTTEMPERATURE_LEFT);
		$("#FA_P02_LBL_POWEROFF").html(mdSmart.i18n.FA_P02_LBL_POWEROFF);
		$("#FA_P02_BTN_POWER > span").html(mdSmart.i18n.FA_P02_LBL_POWERON);
		$("#FA_P02_BTN_POWER").show();
		
		if(bDebug == true){
			var title = JSON.stringify({
				messageBody: "风扇-客厅"
			});
			bridge.setCardTitle(title);
		}
    };
	// 查询设备状态
	mdSmart.FA_P02.cmdRequestStatus = function() {
        console.log("function:mdSmart.FA_P02.cmdRequestStatus");
        //if(mdSmart.common.isOperationLock() == true){return false;}
        //if(mdSmart.common.isPopupLock() == true){return false;}
		var cmdBytes = mdSmart.FA_P02.message.cmdRequestStatus();
		mdSmart.FA_P02.beforeSendCmd(cmdBytes);
		var cmdId = bridge.startCmdProcess(cmdBytes,function(data){
			mdSmart.FA_P02.showStatus(cmdBytes,data);
		});
		mdSmart.FA_P02.afterSendCmd(cmdId,cmdBytes);
    };
	//家电信息查询
	mdSmart.FA_P02.cmdRequestHomeApplianceInfo = function() {
	    console.log("function:mdSmart.FA_P02.cmdRequestHomeApplianceInfo");
        if(mdSmart.common.isOperationLock() == true){return false;}
        if(mdSmart.common.isPopupLock() == true){return false;}
        var cmdBytes = mdSmart.FA_P02.message.cmdRequestHomeApplianceInfo();
        var cmdId = bridge.startCmdProcess(cmdBytes,function(data){
            console.log(data[12],"data[12]");
            deviceType = parseInt(data[12]);
            if(deviceType == 1 || deviceType == 8) {
            	$("#FA_P02").addClass("card_15DRW");
            	$("#FA_P02_LBL_CURRENTTEMPERATURE_LEFT").parents(".text").hide();
            }else{
            	$("#FA_P02").addClass("card_16BR");
            }
            mdSmart.FA_P02.prepareAndShow();
        });       
	};
	// 电源控制-开机
	mdSmart.FA_P02.cmdControlPowerOn = function() {
		console.log("function:mdSmart.FA_P02.cmdControlPowerOn");
		if(mdSmart.common.isOperationLock() == true){return false;}
		// 旋转
		if(mdSmart.common.isCartBtnLock()==true){return false;} 
		
		// 文言：关机
		$("#FA_P01_BTN_POWER").html(mdSmart.i18n.FA_P03_BTN_POWEROFF);
				
		var cmdBytes = mdSmart.FA_P02.message.cmdControlPowerOn();
		mdSmart.FA_P02.beforeSendCmd(cmdBytes);
		// 旋转
		$("#FA_P02_BTN_POWER span").addClass("card_bottom_but_waiting");
        var cmdId = bridge.startCmdProcess(cmdBytes,function(data){
			// 旋转
        	$("#FA_P02_BTN_POWER span").removeClass("card_bottom_but_waiting");
        	mdSmart.common.isCartBtnLockControl(false);			
			
			mdSmart.FA_P02.showStatus(cmdBytes,data);
		},function(errorCode){
			if(errorCode== -1) {
				// 旋转
				$("#FA_P02_BTN_POWER span").removeClass("card_bottom_but_waiting");
        		mdSmart.common.isCartBtnLockControl(false);
			}
		});
		mdSmart.FA_P02.afterSendCmd(cmdId,cmdBytes);
    };
	// 命令发送前处理
	mdSmart.FA_P02.beforeSendCmd = function(cmdBytes) {
        console.log("function:mdSmart.FA_P02.beforeSendCmd");
    };
	// 命令发送后处理
	mdSmart.FA_P02.afterSendCmd = function(cmdId, cmdBytes) {
        console.log("function:mdSmart.FA_P02.afterSendCmd");
		// For Debug
		if(bDebug == true){
			var cmdMessageType = cmdBytes[9],cmdMessageBody=cmdBytes.slice(10,cmdBytes.length - 1);;
			var statusMessage = mdSmart.FA_P02.message.getRequestStatusBack();
			var messageBody = mdSmart.message.createMessageBody(20);
			if(statusMessage != undefined){
				messageBody = statusMessage.slice(10,statusMessage.length - 1);
			}
			var messageType = cmdMessageType;
			switch(cmdMessageType){
				case 0x02:
					mdSmart.message.setBit(messageBody,4,0,mdSmart.message.getBit(cmdMessageBody,4,0));
					break;
			}
			var message = mdSmart.message.createMessage(0xFA,messageType,messageBody);
			var bridgeMessage = mdSmart.message.converMessageToBridgePStr(message);
			bridge.callbackFunction(cmdId,bridgeMessage);
		}
    };
	// 收到消息后处理
	mdSmart.FA_P02.showStatus = function(dataRequest,dataBack){
        console.log("function:mdSmart.FA_P02.showStatus");
		var jsonStatus = mdSmart.FA_P02.message.parseMessageForView(dataBack);
		window.localStorage.setItem("FA_"+deviceId,JSON.stringify(jsonStatus));
		$("#FA_P02_LBL_CURRENTTEMPERATURE").parents(".text").hide();
		if(jsonStatus.status.powerOnOff.value == 1){
			if($.mobile.activePage.attr("id") == "FA_P02"){
				$.mobile.changePage("#FA_P01", "turn");
			}
		}
		mdSmart.FA_P02.temperatureFeedback = jsonStatus.status.temperatureFeedback.value;
		if(deviceType !== 1 && deviceType !== 8) {
			$("#FA_P02_LBL_CURRENTTEMPERATURE").html(mdSmart.FA_P02.temperatureFeedback-41);
			$("#FA_P02_LBL_CURRENTTEMPERATURE").parents(".text").show();
		}else{
			$("#FA_P02_LBL_CURRENTTEMPERATURE").parents(".text").hide();
		}
		if(bDebug == true){
			var strStatus = mdSmart.common.showJSON(jsonStatus.status);
			console.log("send message:"+mdSmart.message.convertTo16Str(dataRequest));
			console.log("receive message:"+mdSmart.message.convertTo16Str(dataBack));
			console.log(strStatus);
		}
	}
})(mdSmart);
