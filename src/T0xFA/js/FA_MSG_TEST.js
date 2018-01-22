(function (mdSmart) {
    var bDebug = true;
    mdSmart.FA_MSG_TEST_P01 = mdSmart.FA_MSG_TEST_P01 || {};

    $(document).on('pageinit', 'div[id="FA_MSG_TEST_P01"]', function (event) {
        console.log('#FA_MSG_TEST_P01 pageinit.');
        mdSmart.FA_MSG_TEST_P01.message = new mdSmart.msg0xFA();
        $(document).bind('recieveMessage',{},  function(event,message){
            mdSmart.FA_MSG_TEST_P01.showStatus("",message);
        });
    });

    $(document).on('pageshow', 'div[id="FA_MSG_TEST_P01"]', function (event) {
        console.log('#FA_MSG_TEST_P01 pageshow.');
        mdSmart.FA_MSG_TEST_P01.prepareAndShow();
        //设备查询
        $("#FA_MSG_TEST_01_BTN01").bind('click', {}, mdSmart.FA_MSG_TEST_P01.cmdRequestStatus);
        //家电信息查询
        $("#FA_MSG_TEST_01_BTN02").bind('click', {}, mdSmart.FA_MSG_TEST_P01.cmdRequestHomeApplianceInfo);
        //设备SN读取
        $("#FA_MSG_TEST_01_BTN03").bind('click', {}, mdSmart.FA_MSG_TEST_P01.cmdRequestReadDevSn);
        //开机
        $("#FA_MSG_TEST_01_BTN04").bind('click', {}, mdSmart.FA_MSG_TEST_P01.cmdControlPowerOn);
        //关机
        $("#FA_MSG_TEST_01_BTN05").bind('click', {}, mdSmart.FA_MSG_TEST_P01.cmdControlPowerOff);
        //设置设备语音-开启语音导航
        $("#FA_MSG_TEST_01_BTN06").bind('click', {}, mdSmart.FA_MSG_TEST_P01.cmdControlDevVoice1);
        //设置设备语音-关闭语音导航
        $("#FA_MSG_TEST_01_BTN07").bind('click', {}, mdSmart.FA_MSG_TEST_P01.cmdControlDevVoice2);
        //设置设备语音-开启蜂鸣器
        $("#FA_MSG_TEST_01_BTN08").bind('click', {}, mdSmart.FA_MSG_TEST_P01.cmdControlDevVoice3);
        //设置设备语音-关闭蜂鸣器
        $("#FA_MSG_TEST_01_BTN09").bind('click', {}, mdSmart.FA_MSG_TEST_P01.cmdControlDevVoice4);
        //设置设备语音-同时开启语音导航和蜂鸣器
        $("#FA_MSG_TEST_01_BTN10").bind('click', {}, mdSmart.FA_MSG_TEST_P01.cmdControlDevVoice5);
        //设置设备语音-完全静音
        $("#FA_MSG_TEST_01_BTN11").bind('click', {}, mdSmart.FA_MSG_TEST_P01.cmdControlDevVoice6);
        //设立刻开机，定时关机6小时
        $("#FA_MSG_TEST_01_BTN12").bind('click', {}, mdSmart.FA_MSG_TEST_P01.cmdPowerOnAndTimerPowerOffHourFunction);
        //设立刻关机，定时开机6小时
        $("#FA_MSG_TEST_01_BTN13").bind('click', {}, mdSmart.FA_MSG_TEST_P01.cmdPowerOffAndTimerPowerOnHourFunction);
        //设备立刻关机，定时开机10小时30分钟
        $("#FA_MSG_TEST_01_BTN14").bind('click', {}, mdSmart.FA_MSG_TEST_P01.cmdPowerOffAndTimerPowerOnHourAndMinutesFunction);
        //设备立刻开机，定时关机10小时30分钟
        $("#FA_MSG_TEST_01_BTN15").bind('click', {}, mdSmart.FA_MSG_TEST_P01.cmdPowerOnAndTimerPowerOffHourAndMinutesFunction);
        //取消定时关机
        $("#FA_MSG_TEST_01_BTN16").bind('click', {}, mdSmart.FA_MSG_TEST_P01.cmdControlCancelTimerPowerOff);
        //取消定时开机
        $("#FA_MSG_TEST_01_BTN17").bind('click', {}, mdSmart.FA_MSG_TEST_P01.cmdControlCancelTimerPowerOn);
        //风类型-正常风
        $("#FA_MSG_TEST_01_BTN18").bind('click', {}, mdSmart.FA_MSG_TEST_P01.cmdControlWindType1);
        //风类型-自然风
        $("#FA_MSG_TEST_01_BTN19").bind('click', {}, mdSmart.FA_MSG_TEST_P01.cmdControlWindType2);
        //风类型-睡眠风
        $("#FA_MSG_TEST_01_BTN20").bind('click', {}, mdSmart.FA_MSG_TEST_P01.cmdControlWindType3);
        //风类型-舒适风
        $("#FA_MSG_TEST_01_BTN21").bind('click', {}, mdSmart.FA_MSG_TEST_P01.cmdControlWindType4);
        //风类型-静音
        $("#FA_MSG_TEST_01_BTN22").bind('click', {}, mdSmart.FA_MSG_TEST_P01.cmdControlWindType5);
        //设置1档
        $("#FA_MSG_TEST_01_BTN23").bind('click', {}, mdSmart.FA_MSG_TEST_P01.cmdControlGear1);
        //设置26档
        $("#FA_MSG_TEST_01_BTN24").bind('click', {}, mdSmart.FA_MSG_TEST_P01.cmdControlGear26);
        //打开摇头
        $("#FA_MSG_TEST_01_BTN25").bind('click', {}, mdSmart.FA_MSG_TEST_P01.cmdControlShakeSwitchOn);
        //关闭摇头
        $("#FA_MSG_TEST_01_BTN26").bind('click', {}, mdSmart.FA_MSG_TEST_P01.cmdControlShakeSwitchOff);
        //设置摇头（摆风）角度-30度
        $("#FA_MSG_TEST_01_BTN27").bind('click', {}, mdSmart.FA_MSG_TEST_P01.cmdControlShakeAngle1);
        //设置摇头（摆风）角度-60度
        $("#FA_MSG_TEST_01_BTN28").bind('click', {}, mdSmart.FA_MSG_TEST_P01.cmdControlShakeAngle2);
        //设置摇头（摆风）角度-90度
        $("#FA_MSG_TEST_01_BTN29").bind('click', {}, mdSmart.FA_MSG_TEST_P01.cmdControlShakeAngle3);
        //设置摇头（摆风）类型-左右摇头
        $("#FA_MSG_TEST_01_BTN30").bind('click', {}, mdSmart.FA_MSG_TEST_P01.cmdControlShakeType);
    });

    $(document).on('pagehide', 'div[id="FA_MSG_TEST_P01"]', function (event) {
        console.log('#FA_MSG_TEST_P01 pagehide.');
        $("#FA_MSG_TEST_01_BTN01").unbind('click');
        $("#FA_MSG_TEST_01_BTN02").unbind('click');
    });

    mdSmart.FA_MSG_TEST_P01.prepareAndShow = function() {
        console.log("mdSmart.FA_MSG_TEST_P01.prepareAndShow");

        //mdSmart.FA_MSG_TEST_P01.cmdRequestStatus();
        //mdSmart.FA_MSG_TEST_P01.cmdRequestTimerStatus();
        bridge.getCardTitle(function(message){
            $(".card-tilte span").html(message);
        });

//        $("#FA_MSG_TEST_01_BTN01 span").html(mdSmart.i18n.REQUEST_STATUS);

        // For Debug
        if(bDebug == true){
            var messageBody = mdSmart.message.createMessageBody(20);
            mdSmart.message.setByte(messageBody,0,0x01);
            mdSmart.message.setByte(messageBody,1,0x01);
            mdSmart.message.setBit(messageBody,2,0,0x01);
            mdSmart.message.setBit(messageBody,2,1,0x01);
            var message = mdSmart.message.createMessage(0xFA,0x03,messageBody);
            var bridgeMessage = mdSmart.message.converMessageToBridgePStr(message);
            //bridge.recieveMessage(bridgeMessage);
            var title = JSON.stringify({
                messageBody: "电风扇通信协议"
            });
            bridge.setCardTitle(title);
        }
    };

    // 状态查询-请求
    mdSmart.FA_MSG_TEST_P01.cmdRequestStatus = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdRequestStatus");
        var workingStatusMessage = mdSmart.FA_MSG_TEST_P01.message.getRequestStatusBack();
        // For Debug
        if(bDebug == true){
            if(workingStatusMessage == undefined){
                var cmdRequest = mdSmart.FA_MSG_TEST_P01.message.cmdRequestStatus();
                var cmdId = bridge.startCmdProcess(cmdRequest,function(messageBack){
                    mdSmart.FA_MSG_TEST_P01.showStatus(cmdRequest,messageBack);
                });
                var messageBody = mdSmart.message.createMessageBody(14);
                mdSmart.message.setByte(messageBody,0,0x01);
                mdSmart.message.setByte(messageBody,1,0x01);
                mdSmart.message.setByte(messageBody,2,0x02);
                mdSmart.message.setByte(messageBody,3,0);
                mdSmart.message.setByte(messageBody,4,0x04);
                mdSmart.message.setByte(messageBody,5,0x0A);
                mdSmart.message.setByte(messageBody,6,0x5b);
                mdSmart.message.setByte(messageBody,7,0x05);
                mdSmart.message.setByte(messageBody,8,(0x01 << 5) | (0x01 << 2) | 0x01);
                mdSmart.message.setByte(messageBody,9,(0x02 << 4) | (0x01 << 2) | 0x01);
                mdSmart.message.setByte(messageBody,10,(2 << 5) | (8 & 0xFF));
                mdSmart.message.setByte(messageBody,11,(2 << 5) | (8 & 0xFF));
                mdSmart.message.setByte(messageBody,12,0x5B);
                mdSmart.message.setByte(messageBody,13,0x2C);
                var message = mdSmart.message.createMessage(0xFA,0x03,messageBody);
                var bridgeMessage = mdSmart.message.converMessageToBridgePStr(message);
                bridge.callbackFunction(cmdId,bridgeMessage);
            }else{
                mdSmart.FA_MSG_TEST_P01.showStatus("-------------------",workingStatusMessage);
            }
        }else{
            var cmdRequest = mdSmart.FA_MSG_TEST_P01.message.cmdRequestStatus();
            var cmdId = bridge.startCmdProcess(cmdRequest,function(messageBack){
                mdSmart.FA_MSG_TEST_P01.showStatus(cmdRequest,messageBack);
            });
        }
    };
    // 家电信息查询-请求
    mdSmart.FA_MSG_TEST_P01.cmdRequestHomeApplianceInfo = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdRequestHomeApplianceInfo");
        var workingStatusMessage = mdSmart.FA_MSG_TEST_P01.message.getHomeApplianceInfoBack();
        // For Debug
        if(bDebug == true){
            if(workingStatusMessage == undefined){
                var cmdRequest = mdSmart.FA_MSG_TEST_P01.message.cmdRequestHomeApplianceInfo();
                var cmdId = bridge.startCmdProcess(cmdRequest,function(messageBack){
                    mdSmart.FA_MSG_TEST_P01.showStatus(cmdRequest,messageBack);
                });
                var messageBody = mdSmart.message.createMessageBody(37);
                mdSmart.message.setByte(messageBody,0,0);
                mdSmart.message.setByte(messageBody,1,0xFA);
                mdSmart.message.setByte(messageBody,2,0);
                mdSmart.message.setByte(messageBody,3,0);
                mdSmart.message.setByte(messageBody,4,0x20);
                for(var i = 0; i < 27; i++){
                    mdSmart.message.setByte(messageBody, i + 5, 0x01);
                }
                var message = mdSmart.message.createMessage(0xFA,0x65,messageBody);
                var bridgeMessage = mdSmart.message.converMessageToBridgePStr(message);
                bridge.callbackFunction(cmdId,bridgeMessage);
            }else{
                mdSmart.FA_MSG_TEST_P01.showStatus("-------------------",workingStatusMessage);
            }
        }else{
            var cmdRequest = mdSmart.FA_MSG_TEST_P01.message.cmdRequestHomeApplianceInfo();
            var cmdId = bridge.startCmdProcess(cmdRequest,function(messageBack){
                mdSmart.FA_MSG_TEST_P01.showStatus(cmdRequest,messageBack);
            });
        }
    };
    // 设备SN读取-请求
    mdSmart.FA_MSG_TEST_P01.cmdRequestReadDevSn = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdRequestReadDevSn");
        var workingStatusMessage = mdSmart.FA_MSG_TEST_P01.message.getDevSnBack();
        // For Debug
        if(bDebug == true){
            if(workingStatusMessage == undefined){
                var cmdRequest = mdSmart.FA_MSG_TEST_P01.message.cmdRequestReadDevSn();
                var cmdId = bridge.startCmdProcess(cmdRequest,function(messageBack){
                    mdSmart.FA_MSG_TEST_P01.showStatus(cmdRequest,messageBack);
                });
                var messageBody = mdSmart.message.createMessageBody(32);
                for(var i = 0; i < 27; i++){
                    mdSmart.message.setByte(messageBody, i, 0x01);
                }
                var message = mdSmart.message.createMessage(0xFA,0x07,messageBody);
                var bridgeMessage = mdSmart.message.converMessageToBridgePStr(message);
                bridge.callbackFunction(cmdId,bridgeMessage);
            }else{
                mdSmart.FA_MSG_TEST_P01.showStatus("-------------------",workingStatusMessage);
            }
        }else{
            var cmdRequest = mdSmart.FA_MSG_TEST_P01.message.cmdRequestReadDevSn();
            var cmdId = bridge.startCmdProcess(cmdRequest,function(messageBack){
                mdSmart.FA_MSG_TEST_P01.showStatus(cmdRequest,messageBack);
            });
        }
    };
    // 开机-请求
    mdSmart.FA_MSG_TEST_P01.cmdControlPowerOn = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdControlPowerOn");
        var cmdBytes = mdSmart.FA_MSG_TEST_P01.message.cmdControlPowerOn();
        var cmdId = bridge.startCmdProcess(cmdBytes,function(messageBack){
            mdSmart.FA_MSG_TEST_P01.showStatus(cmdBytes,messageBack);
        });
        mdSmart.FA_MSG_TEST_P01.afterControlProcess(cmdId,cmdBytes);
    };
    // 控制:关机
    mdSmart.FA_MSG_TEST_P01.cmdControlPowerOff = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdControlPowerOff");
        var cmdBytes = mdSmart.FA_MSG_TEST_P01.message.cmdControlPowerOff();
        var cmdId = bridge.startCmdProcess(cmdBytes,function(messageBack){
            mdSmart.FA_MSG_TEST_P01.showStatus(cmdBytes,messageBack);
        });
        mdSmart.FA_MSG_TEST_P01.afterControlProcess(cmdId,cmdBytes);
    };
    // 设置设备语音-开启语音导航
    mdSmart.FA_MSG_TEST_P01.cmdControlDevVoice1 = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdControlDevVoice");
        var cmdBytes = mdSmart.FA_MSG_TEST_P01.message.cmdControlDevVoice(0x01);
        var cmdId = bridge.startCmdProcess(cmdBytes,function(messageBack){
            mdSmart.FA_MSG_TEST_P01.showStatus(cmdBytes,messageBack);
        });
        mdSmart.FA_MSG_TEST_P01.afterControlProcess(cmdId,cmdBytes);
    };
    // 设置设备语音-关闭语音导航
    mdSmart.FA_MSG_TEST_P01.cmdControlDevVoice2 = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdControlDevVoice2");
        var cmdBytes = mdSmart.FA_MSG_TEST_P01.message.cmdControlDevVoice(0x02);
        var cmdId = bridge.startCmdProcess(cmdBytes,function(messageBack){
            mdSmart.FA_MSG_TEST_P01.showStatus(cmdBytes,messageBack);
        });
        mdSmart.FA_MSG_TEST_P01.afterControlProcess(cmdId,cmdBytes);
    };
    // 设置设备语音-开启蜂鸣器
    mdSmart.FA_MSG_TEST_P01.cmdControlDevVoice3 = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdControlDevVoice3");
        var cmdBytes = mdSmart.FA_MSG_TEST_P01.message.cmdControlDevVoice(0x04);
        var cmdId = bridge.startCmdProcess(cmdBytes,function(messageBack){
            mdSmart.FA_MSG_TEST_P01.showStatus(cmdBytes,messageBack);
        });
        mdSmart.FA_MSG_TEST_P01.afterControlProcess(cmdId,cmdBytes);
    };
    // 设置设备语音-关闭蜂鸣器
    mdSmart.FA_MSG_TEST_P01.cmdControlDevVoice4 = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdControlDevVoice4");
        var cmdBytes = mdSmart.FA_MSG_TEST_P01.message.cmdControlDevVoice(0x08);
        var cmdId = bridge.startCmdProcess(cmdBytes,function(messageBack){
            mdSmart.FA_MSG_TEST_P01.showStatus(cmdBytes,messageBack);
        });
        mdSmart.FA_MSG_TEST_P01.afterControlProcess(cmdId,cmdBytes);
    };
    // 设置设备语音-同时开启语音导航和蜂鸣器
    mdSmart.FA_MSG_TEST_P01.cmdControlDevVoice5 = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdControlDevVoice5");
        mdSmart.FA_MSG_TEST_P01.message.cmdControlDevVoice();
        var cmdBytes = mdSmart.FA_MSG_TEST_P01.message.cmdControlDevVoice(0x05);
        var cmdId = bridge.startCmdProcess(cmdBytes,function(messageBack){
            mdSmart.FA_MSG_TEST_P01.showStatus(cmdBytes,messageBack);
        });
        mdSmart.FA_MSG_TEST_P01.afterControlProcess(cmdId,cmdBytes);
    };
    // 设置设备语音-完全静音
    mdSmart.FA_MSG_TEST_P01.cmdControlDevVoice6 = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdControlDevVoice6");
        var cmdBytes = mdSmart.FA_MSG_TEST_P01.message.cmdControlDevVoice(0x0A);
        var cmdId = bridge.startCmdProcess(cmdBytes,function(messageBack){
            mdSmart.FA_MSG_TEST_P01.showStatus(cmdBytes,messageBack);
        });
        mdSmart.FA_MSG_TEST_P01.afterControlProcess(cmdId,cmdBytes);
    };
    // 设置湿度
    mdSmart.FA_MSG_TEST_P01.cmdControlTemperature = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdControlTemperature");
        var cmdBytes = mdSmart.FA_MSG_TEST_P01.message.cmdControlTemperature();
        var cmdId = bridge.startCmdProcess(cmdBytes,function(messageBack){
            mdSmart.FA_MSG_TEST_P01.showStatus(cmdBytes,messageBack);
        });
        mdSmart.FA_MSG_TEST_P01.afterControlProcess(cmdId,cmdBytes);
    };
    // 设备立刻开机，定时关机6小时
    mdSmart.FA_MSG_TEST_P01.cmdPowerOnAndTimerPowerOffHourFunction = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdPowerOnAndTimerPowerOffHourFunction");
        var cmdBytes = mdSmart.FA_MSG_TEST_P01.message.cmdPowerOnAndTimerPowerOffHourFunction(6);
        var cmdId = bridge.startCmdProcess(cmdBytes,function(messageBack){
            mdSmart.FA_MSG_TEST_P01.showStatus(cmdBytes,messageBack);
        });
        mdSmart.FA_MSG_TEST_P01.afterControlProcess(cmdId,cmdBytes);
    };
    // 设备立刻关机，定时开机6小时
    mdSmart.FA_MSG_TEST_P01.cmdPowerOffAndTimerPowerOnHourFunction = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdPowerOffAndTimerPowerOnHourFunction");
        var cmdBytes = mdSmart.FA_MSG_TEST_P01.message.cmdPowerOffAndTimerPowerOnHourFunction(6);
        var cmdId = bridge.startCmdProcess(cmdBytes,function(messageBack){
            mdSmart.FA_MSG_TEST_P01.showStatus(cmdBytes,messageBack);
        });
        mdSmart.FA_MSG_TEST_P01.afterControlProcess(cmdId,cmdBytes);
    };
    // 设备立刻关机，定时开机10小时30分钟
    mdSmart.FA_MSG_TEST_P01.cmdPowerOffAndTimerPowerOnHourAndMinutesFunction = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdPowerOffAndTimerPowerOnHourAndMinutesFunction");
        var cmdBytes = mdSmart.FA_MSG_TEST_P01.message.cmdPowerOffAndTimerPowerOnHourAndMinutesFunction(10,3);
        var cmdId = bridge.startCmdProcess(cmdBytes,function(messageBack){
            mdSmart.FA_MSG_TEST_P01.showStatus(cmdBytes,messageBack);
        });
        mdSmart.FA_MSG_TEST_P01.afterControlProcess(cmdId,cmdBytes);
    };
    // 设备立刻开机，定时关机10小时30分钟
    mdSmart.FA_MSG_TEST_P01.cmdPowerOnAndTimerPowerOffHourAndMinutesFunction = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdPowerOnAndTimerPowerOffHourAndMinutesFunction");
        mdSmart.FA_MSG_TEST_P01.message.cmdPowerOnAndTimerPowerOffHourAndMinutesFunction();
        var cmdBytes = mdSmart.FA_MSG_TEST_P01.message.cmdPowerOnAndTimerPowerOffHourAndMinutesFunction(10,3);
        var cmdId = bridge.startCmdProcess(cmdBytes,function(messageBack){
            mdSmart.FA_MSG_TEST_P01.showStatus(cmdBytes,messageBack);
        });
        mdSmart.FA_MSG_TEST_P01.afterControlProcess(cmdId,cmdBytes);
    };
    // 取消定时关机
    mdSmart.FA_MSG_TEST_P01.cmdControlCancelTimerPowerOff = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdControlCancelTimerPowerOff");
        var cmdBytes = mdSmart.FA_MSG_TEST_P01.message.cmdControlCancelTimerPowerOff();
        var cmdId = bridge.startCmdProcess(cmdBytes,function(messageBack){
            mdSmart.FA_MSG_TEST_P01.showStatus(cmdBytes,messageBack);
        });
        mdSmart.FA_MSG_TEST_P01.afterControlProcess(cmdId,cmdBytes);
    };
    // 取消定时开机
    mdSmart.FA_MSG_TEST_P01.cmdControlCancelTimerPowerOn = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdControlCancelTimerPowerOn");
        var cmdBytes = mdSmart.FA_MSG_TEST_P01.message.cmdControlCancelTimerPowerOn();
        var cmdId = bridge.startCmdProcess(cmdBytes,function(messageBack){
            mdSmart.FA_MSG_TEST_P01.showStatus(cmdBytes,messageBack);
        });
        mdSmart.FA_MSG_TEST_P01.afterControlProcess(cmdId,cmdBytes);
    };
    // 设置风类型-正常风
    mdSmart.FA_MSG_TEST_P01.cmdControlWindType1 = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdControlWindType1");
        var cmdBytes = mdSmart.FA_MSG_TEST_P01.message.cmdControlWindType(0x01);
        var cmdId = bridge.startCmdProcess(cmdBytes,function(messageBack){
            mdSmart.FA_MSG_TEST_P01.showStatus(cmdBytes,messageBack);
        });
        mdSmart.FA_MSG_TEST_P01.afterControlProcess(cmdId,cmdBytes);
    };
    // 设置风类型-自然风
    mdSmart.FA_MSG_TEST_P01.cmdControlWindType2 = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdControlWindType2");
        var cmdBytes = mdSmart.FA_MSG_TEST_P01.message.cmdControlWindType(0x02);
        var cmdId = bridge.startCmdProcess(cmdBytes,function(messageBack){
            mdSmart.FA_MSG_TEST_P01.showStatus(cmdBytes,messageBack);
        });
        mdSmart.FA_MSG_TEST_P01.afterControlProcess(cmdId,cmdBytes);
    };
    // 设置风类型-睡眠风
    mdSmart.FA_MSG_TEST_P01.cmdControlWindType3 = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdControlWindType3");
        var cmdBytes = mdSmart.FA_MSG_TEST_P01.message.cmdControlWindType(0x04);
        var cmdId = bridge.startCmdProcess(cmdBytes,function(messageBack){
            mdSmart.FA_MSG_TEST_P01.showStatus(cmdBytes,messageBack);
        });
        mdSmart.FA_MSG_TEST_P01.afterControlProcess(cmdId,cmdBytes);
    };
    // 设置风类型-舒适风
    mdSmart.FA_MSG_TEST_P01.cmdControlWindType4 = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdControlWindType4");
        var cmdBytes = mdSmart.FA_MSG_TEST_P01.message.cmdControlWindType(0x08);
        var cmdId = bridge.startCmdProcess(cmdBytes,function(messageBack){
            mdSmart.FA_MSG_TEST_P01.showStatus(cmdBytes,messageBack);
        });
        mdSmart.FA_MSG_TEST_P01.afterControlProcess(cmdId,cmdBytes);
    };
    // 设置风类型-静音
    mdSmart.FA_MSG_TEST_P01.cmdControlWindType5 = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdControlWindType5");
        var cmdBytes = mdSmart.FA_MSG_TEST_P01.message.cmdControlWindType(0x10);
        var cmdId = bridge.startCmdProcess(cmdBytes,function(messageBack){
            mdSmart.FA_MSG_TEST_P01.showStatus(cmdBytes,messageBack);
        });
        mdSmart.FA_MSG_TEST_P01.afterControlProcess(cmdId,cmdBytes);
    };
    // 设置1档
    mdSmart.FA_MSG_TEST_P01.cmdControlGear1 = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdControlGear1");
        var cmdBytes = mdSmart.FA_MSG_TEST_P01.message.cmdControlGear(1);
        var cmdId = bridge.startCmdProcess(cmdBytes,function(messageBack){
            mdSmart.FA_MSG_TEST_P01.showStatus(cmdBytes,messageBack);
        });
        mdSmart.FA_MSG_TEST_P01.afterControlProcess(cmdId,cmdBytes);
    };
    // 设置26档
    mdSmart.FA_MSG_TEST_P01.cmdControlGear26 = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdControlGear26");
        var cmdBytes = mdSmart.FA_MSG_TEST_P01.message.cmdControlGear(26);
        var cmdId = bridge.startCmdProcess(cmdBytes,function(messageBack){
            mdSmart.FA_MSG_TEST_P01.showStatus(cmdBytes,messageBack);
        });
        mdSmart.FA_MSG_TEST_P01.afterControlProcess(cmdId,cmdBytes);
    };
    // 打开摇头
    mdSmart.FA_MSG_TEST_P01.cmdControlShakeSwitchOn = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdControlShakeSwitchOn");
        var cmdBytes = mdSmart.FA_MSG_TEST_P01.message.cmdControlShakeSwitchOn();
        var cmdId = bridge.startCmdProcess(cmdBytes,function(messageBack){
            mdSmart.FA_MSG_TEST_P01.showStatus(cmdBytes,messageBack);
        });
        mdSmart.FA_MSG_TEST_P01.afterControlProcess(cmdId,cmdBytes);
    };
    // 关闭摇头
    mdSmart.FA_MSG_TEST_P01.cmdControlShakeSwitchOff = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdControlShakeSwitchOff");
        var cmdBytes = mdSmart.FA_MSG_TEST_P01.message.cmdControlShakeSwitchOff();
        var cmdId = bridge.startCmdProcess(cmdBytes,function(messageBack){
            mdSmart.FA_MSG_TEST_P01.showStatus(cmdBytes,messageBack);
        });
        mdSmart.FA_MSG_TEST_P01.afterControlProcess(cmdId,cmdBytes);
    };
    // 设置摇头（摆风）角度-30度
    mdSmart.FA_MSG_TEST_P01.cmdControlShakeAngle1 = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdControlShakeAngle1");
        var cmdBytes = mdSmart.FA_MSG_TEST_P01.message.cmdControlShakeAngle(1);
        var cmdId = bridge.startCmdProcess(cmdBytes,function(messageBack){
            mdSmart.FA_MSG_TEST_P01.showStatus(cmdBytes,messageBack);
        });
        mdSmart.FA_MSG_TEST_P01.afterControlProcess(cmdId,cmdBytes);
    };
    // 设置摇头（摆风）角度-60度
    mdSmart.FA_MSG_TEST_P01.cmdControlShakeAngle2 = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdControlShakeAngle2");
        var cmdBytes = mdSmart.FA_MSG_TEST_P01.message.cmdControlShakeAngle(2);
        var cmdId = bridge.startCmdProcess(cmdBytes,function(messageBack){
            mdSmart.FA_MSG_TEST_P01.showStatus(cmdBytes,messageBack);
        });
        mdSmart.FA_MSG_TEST_P01.afterControlProcess(cmdId,cmdBytes);
    };
    // 设置摇头（摆风）角度-90度
    mdSmart.FA_MSG_TEST_P01.cmdControlShakeAngle3 = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdControlShakeAngle3");
        var cmdBytes = mdSmart.FA_MSG_TEST_P01.message.cmdControlShakeAngle(3);
        var cmdId = bridge.startCmdProcess(cmdBytes,function(messageBack){
            mdSmart.FA_MSG_TEST_P01.showStatus(cmdBytes,messageBack);
        });
        mdSmart.FA_MSG_TEST_P01.afterControlProcess(cmdId,cmdBytes);
    };
    // 设置摇头（摆风）类型-左右摇头
    mdSmart.FA_MSG_TEST_P01.cmdControlShakeType = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdControlShakeType");
        var cmdBytes = mdSmart.FA_MSG_TEST_P01.message.cmdControlShakeType(1);
        var cmdId = bridge.startCmdProcess(cmdBytes,function(messageBack){
            mdSmart.FA_MSG_TEST_P01.showStatus(cmdBytes,messageBack);
        });
        mdSmart.FA_MSG_TEST_P01.afterControlProcess(cmdId,cmdBytes);
    };
    // 设置加湿
    mdSmart.FA_MSG_TEST_P01.cmdControlHumidify = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdControlHumidify");
        var cmdBytes = mdSmart.FA_MSG_TEST_P01.message.cmdControlHumidify();
        var cmdId = bridge.startCmdProcess(cmdBytes,function(messageBack){
            mdSmart.FA_MSG_TEST_P01.showStatus(cmdBytes,messageBack);
        });
        mdSmart.FA_MSG_TEST_P01.afterControlProcess(cmdId,cmdBytes);
    };
    // 设置驱蚊功能
    mdSmart.FA_MSG_TEST_P01.cmdControlAnophelifuge = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdControlAnophelifuge");
        var cmdBytes = mdSmart.FA_MSG_TEST_P01.message.cmdControlAnophelifuge();
        var cmdId = bridge.startCmdProcess(cmdBytes,function(messageBack){
            mdSmart.FA_MSG_TEST_P01.showStatus(cmdBytes,messageBack);
        });
        mdSmart.FA_MSG_TEST_P01.afterControlProcess(cmdId,cmdBytes);
    };
    // 设置负离子功能
    mdSmart.FA_MSG_TEST_P01.cmdControlAnion = function() {
        console.log("function:mdSmart.FA_MSG_TEST_P01.cmdControlAnion");
        var cmdBytes = mdSmart.FA_MSG_TEST_P01.message.cmdControlAnion();
        var cmdId = bridge.startCmdProcess(cmdBytes,function(messageBack){
            mdSmart.FA_MSG_TEST_P01.showStatus(cmdBytes,messageBack);
        });
        mdSmart.FA_MSG_TEST_P01.afterControlProcess(cmdId,cmdBytes);
    };

    mdSmart.FA_MSG_TEST_P01.afterControlProcess = function(cmdId,cmdBytes) {
        console.log("function:mdSmart.FA_MSG_TEST_P01.afterControlProcess");
        // For Debug
        if(bDebug == true){
            var cmdMessageType = cmdBytes[9],cmdMessageBody=cmdBytes.slice(10,cmdBytes.length - 1);;
            var statusMessage = mdSmart.FA_MSG_TEST_P01.message.getRequestStatusBack();
            var messageBody = mdSmart.message.createMessageBody(14);
            if(statusMessage != undefined){
                messageBody = statusMessage.slice(10,statusMessage.length - 1);
            }
            var messageType = undefined;

            //开机
            if(cmdMessageBody[0] == 0x01){
                messageType = 0x02;
                mdSmart.message.setByte(messageBody,0,0x01);
            }
            //关机
            if(cmdMessageBody[0] == 0x02){
                messageType = 0x02;
                mdSmart.message.setByte(messageBody,0,0x02);
            }
            messageType = 0x02;
            //设备语音
            mdSmart.message.setByte(messageBody, 2, cmdMessageBody[2]);
            //风类型
            mdSmart.message.setByte(messageBody, 4, cmdMessageBody[4]);
            //档位
            mdSmart.message.setByte(messageBody, 5, cmdMessageBody[5]);
            //摇头摆风-角度-类型-开关
            mdSmart.message.setByte(messageBody, 8, cmdMessageBody[8]);

            //开机,定时6小时关
            if(cmdMessageBody[10] == 0x06){
                messageType = 0x02;
                mdSmart.message.setByte(messageBody,0,0x01);
                mdSmart.message.setByte(messageBody,10,0x06);
            }
            //关机,定时6小时开
            if(cmdMessageBody[11] == 0x06){
                messageType = 0x02;
                mdSmart.message.setByte(messageBody,0,0x02);
                mdSmart.message.setByte(messageBody,11,0x06);
            }
            //立刻关机，定时10小时30分钟开机
            if(cmdMessageBody[11] == ((0x03 << 5) | 0x0A)){
                messageType = 0x02;
                mdSmart.message.setByte(messageBody,0,0x02);
                mdSmart.message.setByte(messageBody,11, (0x03 << 5) | 0x0A);
            }
            //立刻开机，定时10小时30分钟关机
            if(cmdMessageBody[10] == ((0x03 << 5) | 0x0A)){
                messageType = 0x02;
                mdSmart.message.setByte(messageBody,0,0x01);
                mdSmart.message.setByte(messageBody,10, (0x03 << 5) | 0x0A);
            }
            //取消定时关机
            if(cmdMessageBody[10] == (0x06 << 5)){
                messageType = 0x02;
                mdSmart.message.setByte(messageBody,10, 0x06 << 5);
            }
            //取消定时开机
            if(cmdMessageBody[11] == (0x06 << 5)){
                messageType = 0x02;
                mdSmart.message.setByte(messageBody,11, 0x06 << 5);
            }

            var message = mdSmart.message.createMessage(0xFA,messageType,messageBody);
            var bridgeMessage = mdSmart.message.converMessageToBridgePStr(message);
            bridge.callbackFunction(cmdId,bridgeMessage);
        }
    };
    mdSmart.FA_MSG_TEST_P01.showStatus = function(messageBackRequest,messageBackBack){
        $("#sendMsgDiv").html("<hr>send:"+mdSmart.message.convertTo16Str(messageBackRequest));
        $("#receiveMsgDiv").html("<hr>receive:"+mdSmart.message.convertTo16Str(messageBackBack));
        var jsonStatus = mdSmart.FA_MSG_TEST_P01.message.parseMessageForView(messageBackBack);
        var strStatus = "isRequestBack:"+jsonStatus.isRequestBack+"<br>";
        strStatus = strStatus + "messageType:"+jsonStatus.messageType+"<br>";
        strStatus = strStatus + "messageBodyCommand:"+jsonStatus.messageBodyCommand+"<br>";
        strStatus = strStatus + mdSmart.FA_MSG_TEST_P01.showJSON(jsonStatus.status)
        $("#statusDiv").html("<hr>"+strStatus);
        //$("#statusDiv").html(JSON.stringify(jsonStatus));
    }
    mdSmart.FA_MSG_TEST_P01.showJSON = function(pJson){
        var strStatus = "";
        for(var o in pJson){
            var temp = pJson[o];
            if(temp.name != undefined){
                if(temp.value != undefined && temp.value != 0){
                    strStatus =  strStatus +"<BR>" + temp.name + ":"
                    if(temp.view != undefined){
                        strStatus = strStatus + temp.view[temp.value];
                    }else{
                        strStatus = strStatus + temp.value;
                    }
                }else if(temp.detail != undefined){
                    strStatus = strStatus + mdSmart.FA_MSG_TEST_P01.showJSON(temp.detail);
                }
            }
        }
        return    strStatus;
    }
})(mdSmart);
