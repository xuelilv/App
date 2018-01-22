(function (mdSmart) {
	var bDebug = false;
    mdSmart.FA_P05 = mdSmart.FA_P05 || {};
	mdSmart.FA_COM = mdSmart.FA_COM || {};
 	var mySwiper = undefined;
   $(document).on('pageinit', 'div[id="FA_P05"]', function (event) {
        console.log('#FA_P05 pageinit.');
		mdSmart.FA_P05.message = mdSmart.FA_COM.message = mdSmart.FA_COM.message != undefined?mdSmart.FA_COM.message:(new mdSmart.msg0xFA());
		$(document).bind('recieveMessage',{},  function(event,message){
			mdSmart.FA_P05.showStatus("",message);
		});
    });
    $(document).on('pageshow', 'div[id="FA_P05"]', function (event) {
        console.log('#FA_P05 pageshow.');
        mdSmart.FA_P05.prepareAndShow();
        $("#FA_P05_BTN_BACK").bind('tap', {}, mdSmart.FA_P05.gotoCardPage);
        $("#FA_P05_SHAKE_LI_30").bind('tap', {option:1}, mdSmart.FA_P05.cmdControlShakeAngle);
        $("#FA_P05_SHAKE_LI_60").bind('tap', {option:2}, mdSmart.FA_P05.cmdControlShakeAngle);
        $("#FA_P05_SHAKE_LI_90").bind('tap', {option:3}, mdSmart.FA_P05.cmdControlShakeAngle);
        $("#FA_P05_SHAKE_LI_OFF").bind('tap', {}, mdSmart.FA_P05.cmdControlShakeSwitchOff);
    });
    $(document).on('pagehide', 'div[id="FA_P05"]', function (event) {
        console.log('#FA_P05 pagehide.');
        $(".card_purifier").unbind('click');
        $("#FA_P05_BTN_BACK").unbind('tap');
        $("#FA_P05_SHAKE_LI_30").unbind('tap');
        $("#FA_P05_SHAKE_LI_60").unbind('tap');
        $("#FA_P05_SHAKE_LI_90").unbind('tap');
        $("#FA_P05_SHAKE_LI_OFF").unbind('tap');
    });

    mdSmart.FA_P05.prepareAndShow = function() {
        console.log("mdSmart.FA_P05.prepareAndShow");
		mdSmart.FA_P05.cmdRequestStatus();
		$("#FA_P05_BTN_BACK").html(mdSmart.i18n.FA_P05_BTN_BACK);
		$("#FA_P05_LBL_TITLE").html(mdSmart.i18n.FA_P05_LBL_TITLE);
		$("#FA_P05_LBL_SHAKE30").html(mdSmart.i18n.FA_P05_LBL_SHAKE);
		$("#FA_P05_LBL_SHAKE60").html(mdSmart.i18n.FA_P05_LBL_SHAKE);
		$("#FA_P05_LBL_SHAKE90").html(mdSmart.i18n.FA_P05_LBL_SHAKE);
		$("#FA_P05_LBL_SHAKEOFF").html(mdSmart.i18n.FA_P05_LBL_SHAKEOFF);
    };
	// 控制面板首页
    mdSmart.FA_P05.gotoCardPage = function() {
        console.log("function:mdSmart.FA_P05.gotoCardPage");
		if(mdSmart.common.isOperationLock() == true){return false;}
		$.mobile.changePage("#FA_P03","turn");
    };
	// 查询设备状态
	mdSmart.FA_P05.cmdRequestStatus = function() {
        console.log("function:mdSmart.FA_P05.cmdRequestStatus");
		var cmdBytes = mdSmart.FA_P05.message.cmdRequestStatus();
		mdSmart.FA_P05.beforeSendCmd(cmdBytes);
		var cmdId = bridge.startCmdProcess(cmdBytes,function(data){
			mdSmart.FA_P05.showStatus(cmdBytes,data);
		});
		mdSmart.FA_P05.afterSendCmd(cmdId,cmdBytes);
    };
	// 设置摇头（摆风）角度
	mdSmart.FA_P05.cmdControlShakeAngle = function(event) {
		console.log("function:mdSmart.FA_P05.cmdControlShakeAngle");
		if(mdSmart.common.isOperationLock() == true){return false;}
		var cmdBytes = mdSmart.FA_P05.message.cmdControlShakeAngle(event.data.option);
		mdSmart.FA_P05.beforeSendCmd(cmdBytes);
        var cmdId = bridge.startCmdProcess(cmdBytes,function(data){
			mdSmart.FA_P05.showStatus(cmdBytes,data);
		});
		mdSmart.FA_P05.afterSendCmd(cmdId,cmdBytes);
    };
	// 关闭摇头
	mdSmart.FA_P05.cmdControlShakeSwitchOff = function(event) {
		console.log("function:mdSmart.FA_P05.cmdControlShakeSwitchOff");
		if(mdSmart.common.isOperationLock() == true){return false;}
		var cmdBytes = mdSmart.FA_P05.message.cmdControlShakeSwitchOff();
		mdSmart.FA_P05.beforeSendCmd(cmdBytes);
        var cmdId = bridge.startCmdProcess(cmdBytes,function(data){
			mdSmart.FA_P05.showStatus(cmdBytes,data);
		});
		mdSmart.FA_P05.afterSendCmd(cmdId,cmdBytes);
    };
	// 命令发送前处理
	mdSmart.FA_P05.beforeSendCmd = function(cmdBytes) {
        console.log("function:mdSmart.FA_P05.beforeSendCmd");
    };
	// 命令发送后处理
	mdSmart.FA_P05.afterSendCmd = function(cmdId, cmdBytes) {
        console.log("function:mdSmart.FA_P05.afterSendCmd");
		// For Debug
		if(bDebug == true){
			var cmdMessageType = cmdBytes[9],cmdMessageBody=cmdBytes.slice(10,cmdBytes.length - 1);;
			var statusMessage = mdSmart.FA_P05.message.getRequestStatusBack();
			var messageBody = mdSmart.message.createMessageBody(15);
			if(statusMessage != undefined){
				messageBody = statusMessage.slice(10,statusMessage.length - 1);
			}
			var messageType = cmdMessageType;
			switch(cmdMessageType){
				case 0x02:
					mdSmart.message.setByte(messageBody,8,mdSmart.message.getByte(cmdMessageBody,8));
					break;
			}
			var message = mdSmart.message.createMessage(0xFA,messageType,messageBody);
			var bridgeMessage = mdSmart.message.converMessageToBridgePStr(message);
			bridge.callbackFunction(cmdId,bridgeMessage);
		}
    };
	// 收到消息后处理
	mdSmart.FA_P05.showStatus = function(dataRequest,dataBack){
        console.log("function:mdSmart.FA_P05.showStatus");
		var jsonStatus = mdSmart.FA_P05.message.parseMessageForView(dataBack);
		mdSmart.FA_P05.shakeSwitch = jsonStatus.status.shakeSwitch.value;
		mdSmart.FA_P05.angle = jsonStatus.status.angle.value;
		mdSmart.FA_P05.shakeType = jsonStatus.status.shakeType.value;
		if(mdSmart.FA_P05.shakeSwitch == 1){
			switch(mdSmart.FA_P05.angle){
				case 1:
					$("#FA_P05_SHAKE_30").addClass("subpanel_list_icon_s2_1_b");
					$("#FA_P05_SHAKE_60").removeClass("subpanel_list_icon_s2_1_b");
					$("#FA_P05_SHAKE_90").removeClass("subpanel_list_icon_s2_1_b");
					$("#FA_P05_SHAKE_OFF").removeClass("subpanel_list_icon_s2_1_b");
					break;
				case 2:
					$("#FA_P05_SHAKE_30").removeClass("subpanel_list_icon_s2_1_b");
					$("#FA_P05_SHAKE_60").addClass("subpanel_list_icon_s2_1_b");
					$("#FA_P05_SHAKE_90").removeClass("subpanel_list_icon_s2_1_b");
					$("#FA_P05_SHAKE_OFF").removeClass("subpanel_list_icon_s2_1_b");
					break;
				case 3:
					$("#FA_P05_SHAKE_30").removeClass("subpanel_list_icon_s2_1_b");
					$("#FA_P05_SHAKE_60").removeClass("subpanel_list_icon_s2_1_b");
					$("#FA_P05_SHAKE_90").addClass("subpanel_list_icon_s2_1_b");
					$("#FA_P05_SHAKE_OFF").removeClass("subpanel_list_icon_s2_1_b");
					break;
				default:
					$("#FA_P05_SHAKE_30").removeClass("subpanel_list_icon_s2_1_b");
					$("#FA_P05_SHAKE_60").removeClass("subpanel_list_icon_s2_1_b");
					$("#FA_P05_SHAKE_90").removeClass("subpanel_list_icon_s2_1_b");
					$("#FA_P05_SHAKE_OFF").removeClass("subpanel_list_icon_s2_1_b");
			}
		}else{
			$("#FA_P05_SHAKE_30").removeClass("subpanel_list_icon_s2_1_b");
			$("#FA_P05_SHAKE_60").removeClass("subpanel_list_icon_s2_1_b");
			$("#FA_P05_SHAKE_90").removeClass("subpanel_list_icon_s2_1_b");
			$("#FA_P05_SHAKE_OFF").addClass("subpanel_list_icon_s2_1_b");
		}
		if(bDebug == true){
			var strStatus = mdSmart.common.showJSON(jsonStatus.status);
			console.log("send message:"+mdSmart.message.convertTo16Str(dataRequest));
			console.log("receive message:"+mdSmart.message.convertTo16Str(dataBack));
			console.log(strStatus);
		}
	}
})(mdSmart);
