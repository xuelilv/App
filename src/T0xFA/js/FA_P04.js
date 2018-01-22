(function (mdSmart) {
	var bDebug = false;
    mdSmart.FA_P04 = mdSmart.FA_P04 || {};
	mdSmart.FA_COM = mdSmart.FA_COM || {};
 	var mySwiper = undefined,myScroller1 = undefined,myScroller2 = undefined;
   $(document).on('pageinit', 'div[id="FA_P04"]', function (event) {
        console.log('#FA_P04 pageinit.');
		mdSmart.FA_P04.message = mdSmart.FA_COM.message = mdSmart.FA_COM.message != undefined?mdSmart.FA_COM.message:(new mdSmart.msg0xFA());
		$(document).bind('recieveMessage',{},  function(event,message){
			mdSmart.FA_P04.showStatus("",message);
		});
		var opt1={};
		opt1.time = {preset : 'time'};
		opt1.default = {
			theme: 'ios-datetime light', //皮肤样式
	        display: 'modal', //显示方式
	        mode: 'scroller', //日期选择模式
			width: 70,
            height: 28,
			rows:5,
			headerText:mdSmart.i18n.FA_P04_SETTIMER_HEADERTEXT,
			hourText:mdSmart.i18n.FA_P04_SETTIMER_HOURTEXT,
			minuteText:mdSmart.i18n.FA_P04_SETTIMER_MINUTETEXT,
			setText:mdSmart.i18n.FA_P04_SETTIMER_SETTEXT,
			cancelText:mdSmart.i18n.FA_P04_SETTIMER_CANCELTEXT,
			timeFormat:"HH:ii",
			timeWheels:"HHii",
			cancelPosition:"left",
			onClose:function(){
				isOk = true;
				window.setTimeout(function(){
					if(isOk == true){
						var hourValue = parseInt(myScroller1.values[0]);
						var minuteValue = parseInt(myScroller1.values[1]);
						if(hourValue == 0x00 && minuteValue == 0x00){
							minuteValue = 60;
						}
						var cmdSetTimer = mdSmart.FA_P04.message.cmdTimerPowerOnHourAndMinutesFunction(hourValue,minuteValue);
						mdSmart.FA_P04.beforeSendCmd(cmdSetTimer);
						var commandid = bridge.startCmdProcess(cmdSetTimer,function(data){
							mdSmart.FA_P04.showStatus(cmdSetTimer,data);
						});
						mdSmart.FA_P04.afterSendCmd(commandid,cmdSetTimer);
						return false;
					}else{
						return false;
					}
				},200)
			},
			onCancel:function(){
				isOk = false;
			}
		};
	  	var optTime1 = $.extend(opt1['time'], opt1['default']);
	    $("#appTime_1").mobiscroll(optTime1).time(optTime1);
		mdSmart.FA_P04.myScroller1 = myScroller1 = getscrollers()["appTime_1"];
		var opt2={};
		opt2.time = {preset : 'time'};
		opt2.default = {
			theme: 'ios-datetime light',
	        display: 'modal',
	        mode: 'scroller',
			width: 70,
            height: 28,
			rows:5,
			headerText:mdSmart.i18n.FA_P04_SETTIMER_HEADERTEXT,
			hourText:mdSmart.i18n.FA_P04_SETTIMER_HOURTEXT,
			minuteText:mdSmart.i18n.FA_P04_SETTIMER_MINUTETEXT,
			setText:mdSmart.i18n.FA_P04_SETTIMER_SETTEXT,
			cancelText:mdSmart.i18n.FA_P04_SETTIMER_CANCELTEXT,
			timeFormat:"HH:ii",
			timeWheels:"HHii",
			cancelPosition:"left",
			onClose:function(){
				isOk = true;
				window.setTimeout(function(){
					if(isOk == true){
						var hourValue = parseInt(myScroller2.values[0]);
						var minuteValue = parseInt(myScroller2.values[1]);
						if(hourValue == 0x00 && minuteValue == 0x00){
							minuteValue = 60;
						}
						var cmdSetTimer = mdSmart.FA_P04.message.cmdTimerPowerOffHourAndMinutesFunction(hourValue,minuteValue);
						mdSmart.FA_P04.beforeSendCmd(cmdSetTimer);
						var commandid = bridge.startCmdProcess(cmdSetTimer,function(data){
							mdSmart.FA_P04.showStatus(cmdSetTimer,data);
						});
						mdSmart.FA_P04.afterSendCmd(commandid,cmdSetTimer);
						return false;
					}else{
						return false;
					}
				},200)
			},
			onCancel:function(){
				isOk = false;
			}
		};
	  	var optTime2 = $.extend(opt2['time'], opt2['default']);
	    $("#appTime_2").mobiscroll(optTime2).time(optTime2);
		mdSmart.FA_P04.myScroller2 = myScroller2 = getscrollers()["appTime_2"];
		$("#FA_P04_BTN_BACK").html(mdSmart.i18n.FA_P04_BTN_BACK);
		$("#FA_P04_LBL_TITLE").html(mdSmart.i18n.FA_P04_LBL_TITLE);
		$("#FA_P04_LBL_TIMINGON").html(mdSmart.i18n.FA_P04_LBL_TIMINGON);
		$("#FA_P04_LBL_TIMINGOFF").html(mdSmart.i18n.FA_P04_LBL_TIMINGOFF);
		$("#FA_P04_LBL_NOTES").html(mdSmart.i18n.FA_P04_LBL_NOTES);
    });
	
    $(document).on('pageshow', 'div[id="FA_P04"]', function (event) {
        console.log('#FA_P04 pageshow.');
        mdSmart.FA_P04.prepareAndShow();
        $("#FA_P04_BTN_BACK").bind('tap', {}, mdSmart.FA_P04.gotoBack);
        $("#FA_P04_LBL_TIMINGON_SWITCH").bind('tap', {}, mdSmart.FA_P04.cmdControlCancelTimerPowerOn);
        $("#FA_P04_LBL_TIMINGOFF_SWITCH").bind('tap', {}, mdSmart.FA_P04.cmdControlCancelTimerPowerOff);
    });
    $(document).on('pagehide', 'div[id="FA_P04"]', function (event) {
        console.log('#FA_P04 pagehide.');
        $(".card_purifier").unbind('click');
        $("#FA_P04_BTN_BACK").unbind('tap');
		$("#FA_P04_LBL_TIMINGON_SWITCH").unbind('tap');
		$("#FA_P04_LBL_TIMINGOFF_SWITCH").unbind('tap');
    });

    mdSmart.FA_P04.prepareAndShow = function() {
        console.log("mdSmart.FA_P04.prepareAndShow");
		mdSmart.FA_P04.cmdRequestStatus();		
    };
	// 控制面板首页
    mdSmart.FA_P04.gotoBack = function() {
        console.log("function:mdSmart.FA_P04.gotoCardPage");
		if(mdSmart.common.isOperationLock() == true){return false;}
		if(mdSmart.common.isPopupLock() == true){return false;}
		$.mobile.changePage("#FA_P03","turn");
    };
	// 查询设备状态
	mdSmart.FA_P04.cmdRequestStatus = function() {
        console.log("function:mdSmart.FA_P04.cmdRequestStatus");
		var cmdBytes = mdSmart.FA_P04.message.cmdRequestStatus();
		mdSmart.FA_P04.beforeSendCmd(cmdBytes);
		var cmdId = bridge.startCmdProcess(cmdBytes,function(data){
			mdSmart.FA_P04.showStatus(cmdBytes,data);
		});
		mdSmart.FA_P04.afterSendCmd(cmdId,cmdBytes);
    };
	// 取消定时开机
	mdSmart.FA_P04.cmdControlCancelTimerPowerOn = function(selectValue) {
		console.log("function:mdSmart.FA_P04.cmdControlCancelTimerPowerOn");
		if(mdSmart.common.isOperationLock() == true){return false;}
		var cmdBytes = mdSmart.FA_P04.message.cmdControlCancelTimerPowerOn();
		mdSmart.FA_P04.beforeSendCmd(cmdBytes);
        var cmdId = bridge.startCmdProcess(cmdBytes,function(data){
			mdSmart.FA_P04.showStatus(cmdBytes,data);
		});
		mdSmart.FA_P04.afterSendCmd(cmdId,cmdBytes);
    };
	// 取消定时关机
	mdSmart.FA_P04.cmdControlCancelTimerPowerOff = function(selectValue) {
		console.log("function:mdSmart.FA_P04.cmdControlCancelTimerPowerOff");
		if(mdSmart.common.isOperationLock() == true){return false;}
		var cmdBytes = mdSmart.FA_P04.message.cmdControlCancelTimerPowerOff();
		mdSmart.FA_P04.beforeSendCmd(cmdBytes);
        var cmdId = bridge.startCmdProcess(cmdBytes,function(data){
			mdSmart.FA_P04.showStatus(cmdBytes,data);
		});
		mdSmart.FA_P04.afterSendCmd(cmdId,cmdBytes);
    };
	// 命令发送前处理
	mdSmart.FA_P04.beforeSendCmd = function(cmdBytes) {
        console.log("function:mdSmart.FA_P04.beforeSendCmd");
    };
	// 命令发送后处理
	mdSmart.FA_P04.afterSendCmd = function(cmdId, cmdBytes) {
        console.log("function:mdSmart.FA_P04.afterSendCmd");
		// For Debug
		if(bDebug == true){
			var cmdMessageType = cmdBytes[9],cmdMessageBody=cmdBytes.slice(10,cmdBytes.length - 1);;
			var statusMessage = mdSmart.FA_P04.message.getRequestStatusBack();
			var messageBody = mdSmart.message.createMessageBody(15);
			if(statusMessage != undefined){
				messageBody = statusMessage.slice(10,statusMessage.length - 1);
			}
			var messageType = cmdMessageType;
			switch(cmdMessageType){
				case 0x02:
					if(mdSmart.message.getByte(cmdMessageBody,10) != 0x00){
						mdSmart.message.setByte(messageBody,10,mdSmart.message.getByte(cmdMessageBody,10));
						mdSmart.message.setBits(messageBody,14,4,7,mdSmart.message.getBits(cmdMessageBody,14,4,7));
					}
					if(mdSmart.message.getByte(cmdMessageBody,11) != 0x00){
						mdSmart.message.setByte(messageBody,11,mdSmart.message.getByte(cmdMessageBody,11));
						mdSmart.message.setBits(messageBody,14,0,3,mdSmart.message.getBits(cmdMessageBody,14,0,3));
					}
					break;
			}
			var message = mdSmart.message.createMessage(0xFA,messageType,messageBody);
			var bridgeMessage = mdSmart.message.converMessageToBridgePStr(message);
			bridge.callbackFunction(cmdId,bridgeMessage);
		}
    };
	// 收到消息后处理
	mdSmart.FA_P04.showStatus = function(dataRequest,dataBack){
        console.log("function:mdSmart.FA_P04.showStatus");
		var jsonStatus = mdSmart.FA_P04.message.parseMessageForView(dataBack);
		mdSmart.FA_P04.timingOnHour = jsonStatus.status.timingOnHour.value;
		mdSmart.FA_P04.timingOnMinute = jsonStatus.status.timingOnMinute.value;
		mdSmart.FA_P04.timingOnMinuteLow = jsonStatus.status.timingOnMinuteLow.value;
		if(mdSmart.FA_P04.timingOnHour == 0 && mdSmart.FA_P04.timingOnMinute == 0 && mdSmart.FA_P04.timingOnMinuteLow == 0 || (mdSmart.FA_P04.timingOnMinute == 6 || mdSmart.FA_P04.timingOnMinute == 7)){
			$("#FA_P04_LBL_TIMINGON_SWITCH").removeClass("subpanel_list_icon_s2_1_b");
			$("#appTime_1").val("00:00");
		}else{
			$("#appTime_1").val(mdSmart.common.formatNumberByZero(mdSmart.FA_P04.timingOnHour,2)+":"+mdSmart.common.formatNumberByZero(mdSmart.FA_P04.timingOnMinute*10+mdSmart.FA_P04.timingOnMinuteLow,2));
			$("#FA_P04_LBL_TIMINGON_SWITCH").addClass("subpanel_list_icon_s2_1_b");
		}
		mdSmart.FA_P04.timingOffHour = jsonStatus.status.timingOffHour.value;
		mdSmart.FA_P04.timingOffMinute = jsonStatus.status.timingOffMinute.value;
		mdSmart.FA_P04.timingOffMinuteLow = jsonStatus.status.timingOffMinuteLow.value;
		if(mdSmart.FA_P04.timingOffHour == 0 && mdSmart.FA_P04.timingOffMinute == 0 && mdSmart.FA_P04.timingOffMinuteLow == 0 || (mdSmart.FA_P04.timingOffMinute == 6 || mdSmart.FA_P04.timingOffMinute == 7)){
			$("#FA_P04_LBL_TIMINGOFF_SWITCH").removeClass("subpanel_list_icon_s2_1_b");
			$("#appTime_2").val("00:00");
		}else{
			$("#FA_P04_LBL_TIMINGOFF_SWITCH").addClass("subpanel_list_icon_s2_1_b");
			$("#appTime_2").val(mdSmart.common.formatNumberByZero(mdSmart.FA_P04.timingOffHour,2)+":"+mdSmart.common.formatNumberByZero(mdSmart.FA_P04.timingOffMinute*10+mdSmart.FA_P04.timingOffMinuteLow,2));
		}
		if(bDebug == true){
			var strStatus = mdSmart.common.showJSON(jsonStatus.status);
			console.log("send message:"+mdSmart.message.convertTo16Str(dataRequest));
			console.log("receive message:"+mdSmart.message.convertTo16Str(dataBack));
			console.log(strStatus);
		}
	}
})(mdSmart);
