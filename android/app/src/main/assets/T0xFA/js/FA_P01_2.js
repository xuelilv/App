(function (mdSmart) {
	var bDebug = false;
	var deviceType = null;
	var deviceId = bridge.getCurrentApplianceID();
	if(deviceId == ""){
		deviceId = 0;
	}
    mdSmart.FA_P01 = mdSmart.FA_P01 || {};
	mdSmart.FA_COM = mdSmart.FA_COM || {};
    $(document).on('pageinit', 'div[id="FA_P01"]', function (event) {
        console.log('#FA_P01 pageinit.');
		mdSmart.FA_P01.message = mdSmart.FA_COM.message = mdSmart.FA_COM.message != undefined?mdSmart.FA_COM.message:(new mdSmart.msg0xFA());
		$(document).unbind('recieveMessage').bind('recieveMessage',{},  function(event,message){
			mdSmart.FA_P01.showStatus("",message);
		});
		$(document).bind('updateCard',{},  function(event,message){
			// 查询请求
			mdSmart.FA_P01.cmdRequestStatus();
		});
    });
	
    $(document).on('pageshow', 'div[id="FA_P01"]', function (event) {
        console.log('#FA_P01 pageshow.');
        mdSmart.FA_P01.cmdRequestHomeApplianceInfo();
//		$("#FA_P01_IMG_WINDTYPE2345 img").hide();
		$("#FA_P01_LBL_CURRENTTEMPERATURE").parents(".text").hide();

        $("#FA_P01_DIV_INFO").unbind('tap').bind('tap', {}, mdSmart.FA_P01.gotoControlPanelPage);
		$("#FA_P01_DIV_OFF").unbind('tap').bind('tap', {}, mdSmart.FA_P01.gotoControlPanelPage);
		$("#FA_P01_BTN_WIND_MINUS").unbind('tap').bind('tap', {option:-1}, mdSmart.FA_P01.cmdControlGear);
		$("#FA_P01_BTN_WIND_PLUS").unbind('tap').bind('tap', {option:1}, mdSmart.FA_P01.cmdControlGear);
		$("#FA_P01_BTN_POWER_A").unbind('tap').bind('tap', {}, mdSmart.FA_P01.cmdControlPowerOff);
		$("#FA_P01_BTN_POWER").unbind('tap').bind('tap', {}, mdSmart.FA_P01.cmdControlPowerOff);
    });
    $(document).on('pageshow', 'div[id="FA_P02"]', function (event) {
    	$("#FA_P01_DIV_OFF").unbind('tap').bind('tap', {}, mdSmart.FA_P01.gotoControlPanelPage);
    });
    $(document).on('pagehide', 'div[id="FA_P02"]', function (event) {
    	$("#FA_P01_DIV_OFF").unbind('tap');
    });
    $(document).on('pagehide', 'div[id="FA_P01"]', function (event) {
        console.log('#FA_P01 pagehide.');
        $("#FA_P01_DIV_INFO").unbind('tap');
        $("#FA_P01_BTN_ANION").unbind('tap');
		$("#FA_P01_BTN_ANION_CONFIRM").unbind('tap');
        $("#FA_P01_BTN_TIMER").unbind('tap');
        $("#FA_P01_BTN_POWER_A").unbind('tap');
		$("#FA_P01_BTN_POWER").unbind('tap');
		
		$("#FA_P01_BTN_WIND_MINUS span").removeClass("card_bottom_but_waiting");
		$("#FA_P01_BTN_WIND_PLUS span").removeClass("card_bottom_but_waiting");
		$("#FA_P01_BTN_POWER").removeClass("card_bottom_but_waiting");
		mdSmart.common.isCartBtnLockControl(false);
    });

    mdSmart.FA_P01.prepareAndShow = function() {
        console.log("mdSmart.FA_P01.prepareAndShow");
		
		mdSmart.FA_P01.cmdRequestStatus();
		bridge.getCardTitle(function(message){
			$("#FA_P01_LBL_TITLE").html(message);
		});
		
		$("#FA_P01_LBL_CURRENTTEMPERATURE_LEFT").html(mdSmart.i18n.FA_P01_LBL_CURRENTTEMPERATURE_LEFT);
		$("#FA_P01_BTN_WIND_MINUS > span").html(mdSmart.i18n.FA_P01_BTN_WIND_MINUS);
		$("#FA_P01_BTN_WIND_PLUS > span").html(mdSmart.i18n.FA_P01_BTN_WIND_PLUS);
		$("#FA_P01_BTN_POWER").html(mdSmart.i18n.FA_P01_BTN_POWER);
		
		// For Debug
		if(bDebug == true){
			var title = JSON.stringify({
				messageBody: "风扇-客厅"
			});
			bridge.setCardTitle(title);
		}
    };
	// 控制面板
    mdSmart.FA_P01.gotoControlPanelPage = function() {
        console.log("function:mdSmart.FA_P01.gotoControlPanelPage");
		//if(mdSmart.common.isOperationLock() == true){return false;}
		bridge.showControlPanelPage();
    };
	// 查询设备状态
	mdSmart.FA_P01.cmdRequestStatus = function() {
        console.log("function:mdSmart.FA_P01.cmdRequestStatus");
        //if(mdSmart.common.isOperationLock() == true){return false;}
        //if(mdSmart.common.isPopupLock() == true){return false;}
		var cmdBytes = mdSmart.FA_P01.message.cmdRequestStatus();
		mdSmart.FA_P01.beforeSendCmd(cmdBytes);
		var cmdId = bridge.startCmdProcess(cmdBytes,function(data){
			mdSmart.FA_P01.showStatus(cmdBytes,data);
		});
		mdSmart.FA_P01.afterSendCmd(cmdId,cmdBytes);
    };
	//家电信息查询
	mdSmart.FA_P01.cmdRequestHomeApplianceInfo = function() {
	    console.log("function:mdSmart.FA_P01.cmdRequestHomeApplianceInfo");
        if(mdSmart.common.isOperationLock() == true){return false;}
        if(mdSmart.common.isPopupLock() == true){return false;}
        var cmdBytes = mdSmart.FA_P01.message.cmdRequestHomeApplianceInfo();
        var cmdId = bridge.startCmdProcess(cmdBytes,function(data){
            console.log(data[12],"data[12]");
            deviceType = parseInt(data[12]);
            if(deviceType == 1 || deviceType == 8) {
            	$("#FA_P01").addClass("card_15DRW");
            	$("#FA_P01_LBL_CURRENTTEMPERATURE").parents(".text").hide();
            }else{
            	$("#FA_P01").addClass("card_16BR");
            }
            mdSmart.FA_P01.prepareAndShow();
        });       
	};
	// 电源控制-关机
	mdSmart.FA_P01.cmdControlPowerOff = function() {
		console.log("function:mdSmart.FA_P01.cmdControlPowerOff");
		if(mdSmart.common.isOperationLock() == true){return false;}
		
        if($("#FA_P01_BTN_POWER").html() == mdSmart.i18n.FA_P03_BTN_POWEROFF){
			// 文言：确认关机
			$("#FA_P01_BTN_POWER").html(mdSmart.i18n.POWER_CLOSING);
			// 关机文言显示 5秒后自动返回"关机"文言
			t = window.setTimeout(function() {
				$("#FA_P01_BTN_POWER").html(mdSmart.i18n.FA_P03_BTN_POWEROFF);
			}, 5000);
			
         } else {

		    if ($("#FA_P01_BTN_POWER").html() == mdSmart.i18n.POWER_CLOSING) {
				// 文言：正在关机
				$("#FA_P01_BTN_POWER").html(mdSmart.i18n.POWER_CLOSING_EXECUTE);
			}
			
			// 旋转
			if(mdSmart.common.isCartBtnLock()==true){return false;} 

			// 清空定时
            window.clearTimeout(t);
			
			var cmdBytes = mdSmart.FA_P01.message.cmdControlPowerOff();
			mdSmart.FA_P01.beforeSendCmd(cmdBytes);
			// 旋转
			$("#FA_P01_BTN_POWER").addClass("card_bottom_but_waiting");
			var cmdId = bridge.startCmdProcess(cmdBytes,function(data){
				// 旋转
				$("#FA_P01_BTN_POWER").removeClass("card_bottom_but_waiting");
				mdSmart.common.isCartBtnLockControl(false);
				mdSmart.FA_P01.showStatus(cmdBytes,data);
			},function(errorCode){
				if(errorCode== -1) {
					// 旋转
					$("#FA_P01_BTN_POWER").removeClass("card_bottom_but_waiting");
					mdSmart.common.isCartBtnLockControl(false);
				}
			});
			mdSmart.FA_P01.afterSendCmd(cmdId,cmdBytes);
			
		 }
    };
	// 设置N档
	mdSmart.FA_P01.cmdControlGear = function(event) {
		console.log("function:mdSmart.FA_P01.cmdControlGear");
		if(mdSmart.common.isOperationLock() == true){return false;}
		// 旋转
		if(mdSmart.common.isCartBtnLock()==true){return false;} 

		var temp = mdSmart.FA_P01.gear + event.data.option;
		if(mdSmart.FA_P01.gear >= 0x00 && mdSmart.FA_P01.gear <= 0x1A){
			temp = temp < 1?1:(temp > 0x1A?0x1A:temp);
		}
		if(mdSmart.FA_P01.gear >= 0xF1 && mdSmart.FA_P01.gear <= 0xF3){
			temp = temp < 0xF1?0xF1:(temp > 0xF3?0xF3:temp);
		}
		var cmdBytes = mdSmart.FA_P01.message.cmdControlGear(temp);
		mdSmart.FA_P01.beforeSendCmd(cmdBytes);
		// 旋转
		if (event.data.option == 1) {
			$("#FA_P01_BTN_WIND_PLUS span").addClass("card_bottom_but_waiting");
		} else {
			$("#FA_P01_BTN_WIND_MINUS span").addClass("card_bottom_but_waiting");
		}
        var cmdId = bridge.startCmdProcess(cmdBytes,function(data){
			// 旋转
			$("#FA_P01_BTN_WIND_MINUS span").removeClass("card_bottom_but_waiting");
			$("#FA_P01_BTN_WIND_PLUS span").removeClass("card_bottom_but_waiting");
			mdSmart.common.isCartBtnLockControl(false);
			mdSmart.FA_P01.showStatus(cmdBytes,data);
		},function(errorCode){
			if(errorCode== -1) {
				// 旋转
				$("#FA_P01_BTN_WIND_MINUS span").removeClass("card_bottom_but_waiting");
				$("#FA_P01_BTN_WIND_PLUS span").removeClass("card_bottom_but_waiting");
        		mdSmart.common.isCartBtnLockControl(false);
			}
		});
		mdSmart.FA_P01.afterSendCmd(cmdId,cmdBytes);
    };
	// 命令发送前处理
	mdSmart.FA_P01.beforeSendCmd = function(cmdBytes) {
        console.log("function:mdSmart.FA_P01.beforeSendCmd");
    };
	// 命令发送后处理
	mdSmart.FA_P01.afterSendCmd = function(cmdId, cmdBytes) {
        console.log("function:mdSmart.FA_P01.afterSendCmd");
		// For Debug
		if(bDebug == true){
			var cmdMessageType = cmdBytes[9],cmdMessageBody=cmdBytes.slice(10,cmdBytes.length - 1);;
			var statusMessage = mdSmart.FA_P01.message.getRequestStatusBack();
			var messageBody = mdSmart.message.createMessageBody(14);
			if(statusMessage != undefined){
				messageBody = statusMessage.slice(10,statusMessage.length - 1);
			}else{
				mdSmart.message.setByte(messageBody,5,0x01);
				mdSmart.message.setByte(messageBody,13,0x01);
				mdSmart.message.setBits(messageBody,4,1,3,0x02);
				// 温度
				mdSmart.message.setByte(messageBody,13,65);
			}
			var messageType = cmdMessageType;
			switch(cmdMessageType){
				case 0x02:
					if(mdSmart.message.getBit(cmdMessageBody,4,7) != 0x01){
						mdSmart.message.setBit(messageBody,4,0,mdSmart.message.getByte(cmdMessageBody,4,0));
					}
					if(mdSmart.message.getByte(cmdMessageBody,5) != 0x00){
						mdSmart.message.setByte(messageBody,5,mdSmart.message.getByte(cmdMessageBody,5));
					}
					break;
			}
			var message = mdSmart.message.createMessage(0xFA,messageType,messageBody);
			var bridgeMessage = mdSmart.message.converMessageToBridgePStr(message);
			bridge.callbackFunction(cmdId,bridgeMessage);
		}
    };
	// 收到消息后处理
	mdSmart.FA_P01.showStatus = function(dataRequest,dataBack){
        console.log("function:mdSmart.FA_P01.showStatus");
		var jsonStatus = mdSmart.FA_P01.message.parseMessageForView(dataBack);
		window.localStorage.setItem("FA_"+deviceId,JSON.stringify(jsonStatus));
		mdSmart.FA_P01.powerOnOff = jsonStatus.status.powerOnOff.value;
		mdSmart.FA_P01.temperatureFeedback = jsonStatus.status.temperatureFeedback.value;
		$("#FA_P01_LBL_CURRENTTEMPERATURE").parents(".text").hide();
		if(mdSmart.FA_P01.powerOnOff != 1){
			if($.mobile.activePage.attr("id") == "FA_P01"){
				$("#FA_P02_LBL_CURRENTTEMPERATURE").html(mdSmart.FA_P01.temperatureFeedback-41);
				if(deviceType !== 1 && deviceType !== 8) {
					$("#FA_P01_LBL_CURRENTTEMPERATURE").parents(".text").show();
				}
				$.mobile.changePage("#FA_P02", "turn");
			}
		}
		if(mdSmart.FA_P01.powerOnOff == 1){
			setTimeout(function(){
				bridge.jumpOtherPlugin("card_open");
			},0);
 		}else{
			setTimeout(function(){
				bridge.jumpOtherPlugin("card_close");
			},0);
 		}
		$("#FA_P01_LBL_CURRENTTEMPERATURE").html(mdSmart.FA_P01.temperatureFeedback-41);
		if(deviceType !== 1 && deviceType !== 8) {
			$("#FA_P01_LBL_CURRENTTEMPERATURE").parents(".text").show();
		}
		mdSmart.FA_P01.gear = jsonStatus.status.gear.value;
		if(mdSmart.FA_P01.gear >= 0x01 && mdSmart.FA_P01.gear <= 0x1A){
			$("#FA_P01_LBL_GEAR").html(mdSmart.FA_P01.gear+mdSmart.i18n.FA_P01_LBL_GEAR_TEXT);
		}
		if(mdSmart.FA_P01.gear == 0xF1){
			$("#FA_P01_LBL_GEAR").html(mdSmart.i18n.FA_P01_LBL_GEAR_L);
		}
		if(mdSmart.FA_P01.gear == 0xF2){
			$("#FA_P01_LBL_GEAR").html(mdSmart.i18n.FA_P01_LBL_GEAR_M);
		}
		if(mdSmart.FA_P01.gear == 0xF3){
			$("#FA_P01_LBL_GEAR").html(mdSmart.i18n.FA_P01_LBL_GEAR_H);
		}
		mdSmart.FA_P01.windType = jsonStatus.status.windType.value;
		switch(mdSmart.FA_P01.windType){
			case 0x02:
			case 0x04:
			case 0x05:
			case 0x06:
//				$("#FA_P01_IMG_WINDTYPE2345 img").hide();
				$("#FA_P01_LBL_GEAR").hide();
				$("#FB_P01_IMG_WINDTYPE"+mdSmart.FA_P01.windType).show();
//				$("#FA_P01_IMG_WINDTYPE2345").show();
				break;
			case 0x03:
				$("#FA_P01_LBL_GEAR").show();
				$("#FB_P01_IMG_WINDTYPE"+mdSmart.FA_P01.windType).show();
				break;
			default:
//				$("#FA_P01_IMG_WINDTYPE2345").hide();
				$("#FA_P01_LBL_GEAR").show();
				break;
		}

		$("#FA_P01_LBL_WINDTYPE").html(mdSmart.i18n["FA_P01_LBL_WINDTYPE"+mdSmart.FA_P01.windType]);
		if(mdSmart.FA_P01.windType == 0x06){
			$("#FA_P01_LBL_WINDTYPE").html(mdSmart.i18n.FA_P01_LBL_WINDTYPE6);
		}
		if(bDebug == true){
			var strStatus = mdSmart.common.showJSON(jsonStatus.status);
			console.log("send message:"+mdSmart.message.convertTo16Str(dataRequest));
			console.log("receive message:"+mdSmart.message.convertTo16Str(dataBack));
			console.log(strStatus);
		}
	}
})(mdSmart);
