var mdSmart = mdSmart || {};
/*
 * 电风扇通信协议
 * @doc 风扇FS40-13HR_物联网产品电控规格书_V2.3_20140614.doc
 */
mdSmart.msg0xFA = function(){
    var _requestStatusBack = undefined,_homeApplianceInfoBack=undefined,_devSnBack=undefined;
    var _status = {
        wrongAlarm:{name:"错误报警",value:0x00,view:{0:"无效",0x01:"传感器断路",0x02:"传感器短路",0x04:"倾倒保护",0x08:"摇头卡住"}},
        voice:{name:"设备语音",value:0x00,view:{0:"无效",0x01:"开启语音导航",0x02:"关闭语音导航",0x04:"开启蜂鸣器",0x08:"关闭蜂鸣器",0x05:"同时开启语音导航和蜂鸣器",0x0A:"完全静音"}},
        reserve:{name:"预留",value:0x00,view:{0:"无效"}},
        bit7powerOnOff:{name:"Bit7开关机",value:0x00,view:{0:"控制开关机（重点关注）",1:"不控制开关机"}},
        bit6CurveMode:{name:"Bit6曲线模式",value:0x00,view:{0:"设备正常运行",1:"设备运行在曲线模式"}},
        windType:{name:"风类型",value:0x00,view:{0:"无效",0x01:"正常风",0x02:"自然风",0x03:"睡眠风",0x04:"舒适风",0x05:"静音风",0x06:"宝宝风",0x07:"人体感应"}},
        powerOnOff:{name:"开关机控制",value:0x00,view:{0:"无效",1:"开机",2:"关机"}},
        gear:{name:"档位",value:0x00,view:{0:"无效",0x01:"1档",0x02:"2档",0x03:"3档",0x04:"4档",0x05:"5档",0x06:"6档",0x07:"7档",0x08:"8档",0x09:"9档",0x0A:"10档",0x0B:"11档",0x0C:"12档",0x0D:"13档",0x0E:"14档",0x0F:"15档",0x10:"16档",0x11:"17档",0x12:"18档",0x13:"19档",0x14:"20档",0x15:"21档",0x16:"22档",0x17:"23档",0x18:"24档",0x19:"25档",0x1A:"26档"}},
        setTemperature:{name:"设置温度",value:0x00,view:{0:"无效",0x01:"-40度",0x02:"-39度",0x03:"-38度",0x04:"-37度",0x05:"-36度",0x06:"-35度",0x07:"-34度",0x08:"-33度",0x09:"-32度",0x0A:"-31度",0x0B:"-30度",0x0C:"-29度",0x0D:"-28度",0x0E:"-27度",0x0F:"-26度",0x10:"-25度",0x11:"-24度",0x12:"-23度",0x13:"-22度",0x14:"-21度",0x15:"-20度",0x16:"-19度",0x17:"-18度",0x18:"-17度",0x19:"-16度",0x1A:"-15度"
                                                         ,0x1A:"-14度",0x1C:"-13度",0x1D:"-12度",0x1E:"-11度",0x1F:"-10度",0x20:"-9度",0x21:"-8度",0x22:"-7度",0x23:"-6度",0x24:"-5度",0x25:"-4度",0x26:"-3度",0x27:"-2度",0x28:"-1度",0x29:"0度",0x2A:"1度",0x2B:"2度",0x2C:"3度",0x2D:"4度",0x2E:"5度",0x2F:"6度",0x30:"7度",0x31:"8度",0x32:"9度",0x33:"10度",0x34:"11度",0x35:"12度",0x36:"13度"
                                                         ,0x37:"14度",0x38:"15度",0x39:"16度",0x3A:"17度",0x3B:"18度",0x3C:"19度",0x3D:"20度",0x3E:"21度",0x3F:"22度",0x40:"25度",0x41:"24度",0x42:"25度",0x43:"26度",0x44:"27度",0x45:"28度",0x46:"29度",0x47:"30度",0x48:"31度",0x49:"32度",0x4A:"33度",0x4B:"34度",0x4C:"35度",0x4D:"36度",0x4E:"37度",0x4F:"38度",0x50:"39度",0x51:"40度",0x52:"41度"
                                                         ,0x53:"42度",0x54:"43度",0x55:"44度",0x56:"45度",0x57:"46度",0x58:"47度",0x59:"48度",0x5A:"49度",0x5B:"50度",0x80:"取消温度设置"}},
        humidity:{name:"设置湿度",value:0x00,view:{0:"无效",0x01:"1%RH",0x02:"2%RH",0x03:"3%RH",0x04:"4%RH",0x05:"5%RH",0x06:"6%RH",0x07:"7%RH",0x08:"8%RH",0x09:"9%RH",0x0A:"10%RH",0x0B:"11%RH",0x0C:"12%RH",0x0D:"13%RH",0x0E:"14%RH",0x0F:"15%RH",0x10:"16%RH",0x11:"17%RH",0x12:"18%RH",0x13:"19%RH",0x14:"20%RH",0x15:"21%RH",0x16:"22%RH",0x17:"23%RH",0x18:"24%RH",0x19:"25%RH",0x1A:"26%RH",0x1B:"27%RH",0x1C:"28%RH",0x1D:"29%RH"
                                                         ,0x1E:"30%RH",0x1F:"31%RH",0x20:"32%RH",0x21:"33%RH",0x22:"34%RH",0x23:"35%RH",0x24:"36%RH",0x25:"37%RH",0x26:"38%RH",0x27:"39%RH",0x28:"40%RH",0x29:"41%RH",0x2A:"42%RH",0x2B:"43%RH",0x2C:"44%RH",0x2D:"45%RH",0x2E:"46%RH",0x2F:"47%RH",0x30:"48%RH",0x31:"49%RH",0x32:"50%RH",0x33:"51%RH",0x34:"52%RH",0x35:"53%RH",0x36:"54%RH",0x37:"55%RH"
                                                         ,0x38:"56%RH",0x39:"57%RH",0x3A:"58%RH",0x3B:"59%RH",0x3C:"60%RH",0x3D:"61%RH",0x3E:"62%RH",0x3F:"63%RH",0x40:"64%RH",0x41:"65%RH",0x42:"66%RH",0x43:"67%RH",0x44:"68%RH",0x45:"69%RH",0x46:"70%RH",0x47:"71%RH",0x48:"72%RH",0x49:"73%RH",0x4A:"74%RH",0x4B:"75%RH",0x4C:"76%RH",0x4D:"77%RH",0x4E:"78%RH",0x4F:"79%RH",0x50:"80%RH",0x51:"81%RH"
                                                         ,0x52:"82%RH",0x53:"83%RH",0x54:"84%RH",0x55:"85%RH",0x56:"86%RH",0x57:"87%RH",0x58:"88%RH",0x59:"89%RH",0x5A:"90%RH",0x5B:"91%RH",0x5C:"92%RH",0x5D:"93%RH",0x5E:"94%RH",0x5F:"95%RH",0x60:"96%RH",0x61:"97%RH",0x62:"98%RH",0x63:"99%RH",0x64:"100%RH",0x80:"取消湿度设置"}},
        bit7AngleOnOff:{name:"Bit7摇头开关",value:0x00,view:{0:"设置摇头（重点关注）",1:"不设置摇头"}},
        angle:{name:"摇头（摆风）角度",value:0x00,view:{0:"无效",1:"30度",2:"60度",3:"90度",4:"120度"}},
        shakeType:{name:"摇头（摆风）类型",value:0x00,view:{0:"无效",1:"左右摇头",2:"上下摇头",3:"8字摇头",4:"W摇头"}},
        shakeSwitch:{name:"摇头（摆风）开关",value:0x00,view:{0:"无效",1:"摇头开",2:"摇头关"}},
        humidify:{name:"设置加湿",value:0x00,view:{0:"无效",1:"关闭加湿",2:"无档位变化加湿",3:"1档加湿",4:"2档加湿",5:"3档加湿"}},
        anophelifuge:{name:"驱蚊功能",value:0x00,view:{0:"无效",1:"驱蚊开",2:"驱蚊关"}},
        anion:{name:"负离子功能",value:0x00,view:{0:"无效",1:"负离子开",2:"负离子关"}},
        timingOffMinute:{name:"定时关(分钟，倒计时)",value:0x00,view:{0:"0分钟",1:"10分钟",2:"20分钟",3:"30分钟",4:"40分钟",5:"50分钟",6:"清除定时关机",7:"清除定时开机"}},
        timingOffHour:{name:"定时关(小时，倒计时)",value:0x00,view:{0:"0小时",1:"1小时",2:"2小时",3:"3小时",4:"4小时",5:"5小时",6:"6小时",7:"7小时",8:"8小时",9:"9小时",10:"10小时",11:"11小时",12:"12小时",13:"13小时",14:"14小时",15:"15小时",16:"16小时",17:"17小时",18:"18小时",19:"19小时",20:"20小时",21:"21小时",22:"22小时",23:"23小时",24:"24小时"}},
        timingOnMinute:{name:"定时开(分钟，倒计时)",value:0x00,view:{0:"0分钟",1:"10分钟",2:"20分钟",3:"30分钟",4:"40分钟",5:"50分钟",6:"清除定时开机",7:"清除定时开机"}},
        timingOnHour:{name:"定时开(小时，倒计时)",value:0x00,view:{0:"0小时",1:"1小时",2:"2小时",3:"3小时",4:"4小时",5:"5小时",6:"6小时",7:"7小时",8:"8小时",9:"9小时",10:"10小时",11:"11小时",12:"12小时",13:"13小时",14:"14小时",15:"15小时",16:"16小时",17:"17小时",18:"18小时",19:"19小时",20:"20小时",21:"21小时",22:"22小时",23:"23小时",24:"24小时"}},
        humidifyFeedback:{name:"环境湿度反馈",value:0x00,view:{0:"无效",0x01:"-40度",0x02:"-39度",0x03:"-38度",0x04:"-37度",0x05:"-36度",0x06:"-35度",0x07:"-34度",0x08:"-33度",0x09:"-32度",0x0A:"-31度",0x0B:"-30度",0x0C:"-29度",0x0D:"-28度",0x0E:"-27度",0x0F:"-26度",0x10:"-25度",0x11:"-24度",0x12:"-23度",0x13:"-22度",0x14:"-21度",0x15:"-20度",0x16:"-19度",0x17:"-18度",0x18:"-17度",0x19:"-16度",0x1A:"-15度"
                                                         ,0x1A:"-14度",0x1C:"-13度",0x1D:"-12度",0x1E:"-11度",0x1F:"-10度",0x20:"-9度",0x21:"-8度",0x22:"-7度",0x23:"-6度",0x24:"-5度",0x25:"-4度",0x26:"-3度",0x27:"-2度",0x28:"-1度",0x29:"0度",0x2A:"1度",0x2B:"2度",0x2C:"3度",0x2D:"4度",0x2E:"5度",0x2F:"6度",0x30:"7度",0x31:"8度",0x32:"9度",0x33:"10度",0x34:"11度",0x35:"12度",0x36:"13度"
                                                         ,0x37:"14度",0x38:"15度",0x39:"16度",0x3A:"17度",0x3B:"18度",0x3C:"19度",0x3D:"20度",0x3E:"21度",0x3F:"22度",0x40:"25度",0x41:"24度",0x42:"25度",0x43:"26度",0x44:"27度",0x45:"28度",0x46:"29度",0x47:"30度",0x48:"31度",0x49:"32度",0x4A:"33度",0x4B:"34度",0x4C:"35度",0x4D:"36度",0x4E:"37度",0x4F:"38度",0x50:"39度",0x51:"40度",0x52:"41度"
                                                         ,0x53:"42度",0x54:"43度",0x55:"44度",0x56:"45度",0x57:"46度",0x58:"47度",0x59:"48度",0x5A:"49度",0x5B:"50度"}},
        temperatureFeedback:{name:"环境温度反馈",value:0x00,view:{0:"无效",0x01:"1%RH",0x02:"2%RH",0x03:"3%RH",0x04:"4%RH",0x05:"5%RH",0x06:"6%RH",0x07:"7%RH",0x08:"8%RH",0x09:"9%RH",0x0A:"10%RH",0x0B:"11%RH",0x0C:"12%RH",0x0D:"13%RH",0x0E:"14%RH",0x0F:"15%RH",0x10:"16%RH",0x11:"17%RH",0x12:"18%RH",0x13:"19%RH",0x14:"20%RH",0x15:"21%RH",0x16:"22%RH",0x17:"23%RH",0x18:"24%RH",0x19:"25%RH",0x1A:"26%RH",0x1B:"27%RH",0x1C:"28%RH",0x1D:"29%RH"
                                                         ,0x1E:"30%RH",0x1F:"31%RH",0x20:"32%RH",0x21:"33%RH",0x22:"34%RH",0x23:"35%RH",0x24:"36%RH",0x25:"37%RH",0x26:"38%RH",0x27:"39%RH",0x28:"40%RH",0x29:"41%RH",0x2A:"42%RH",0x2B:"43%RH",0x2C:"44%RH",0x2D:"45%RH",0x2E:"46%RH",0x2F:"47%RH",0x30:"48%RH",0x31:"49%RH",0x32:"50%RH",0x33:"51%RH",0x34:"52%RH",0x35:"53%RH",0x36:"54%RH",0x37:"55%RH"
                                                         ,0x38:"56%RH",0x39:"57%RH",0x3A:"58%RH",0x3B:"59%RH",0x3C:"60%RH",0x3D:"61%RH",0x3E:"62%RH",0x3F:"63%RH",0x40:"64%RH",0x41:"65%RH",0x42:"66%RH",0x43:"67%RH",0x44:"68%RH",0x45:"69%RH",0x46:"70%RH",0x47:"71%RH",0x48:"72%RH",0x49:"73%RH",0x4A:"74%RH",0x4B:"75%RH",0x4C:"76%RH",0x4D:"77%RH",0x4E:"78%RH",0x4F:"79%RH",0x50:"80%RH",0x51:"81%RH"
                                                         ,0x52:"82%RH",0x53:"83%RH",0x54:"84%RH",0x55:"85%RH",0x56:"86%RH",0x57:"87%RH",0x58:"88%RH",0x59:"89%RH",0x5A:"90%RH",0x5B:"91%RH",0x5C:"92%RH",0x5D:"93%RH",0x5E:"94%RH",0x5F:"95%RH",0x60:"96%RH",0x61:"97%RH",0x62:"98%RH",0x63:"99%RH",0x64:"100%RH"}},
        timingOffMinuteLow:{name:"定时关（低位）",value:0x00,view:{0:"0分钟",1:"1分钟",2:"2分钟",3:"3分钟",4:"4分钟",5:"5分钟",6:"6分钟",7:"7分钟",8:"8分钟",9:"9分钟"}},
        timingOnMinuteLow:{name:"定时开（低位）",value:0x00,view:{0:"0分钟",1:"1分钟",2:"2分钟",3:"3分钟",4:"4分钟",5:"5分钟",6:"6分钟",7:"7分钟",8:"8分钟",9:"9分钟"}},
        scene:{name:"场景",value:0x00,view:{0:"无效",1:"老人",2:"睡眠风",3:"阅读",4:"自定义"}},
        versionHigh:{name:"版本（高位）",value:0x00},
        versionLow:{name:"版本（低位）",value:0x00},
        homeApplianceType:{name:"家电类型",value:0x00},
        model:{name:"型号",value:0x00},
        snLength:{name:"SN长度+4",value:0x00},
        snContent:{name:"SN内容",value:[0x00]}
    };
    (function init(){
    }());
    function _parseMessage(pReceiveMessage){
        var receiveMessageBody = pReceiveMessage.slice(10,pReceiveMessage.length - 1);
        var messageType = mdSmart.message.getByte(pReceiveMessage,9);
        var isRequestStatusBack = false,isHomeApplianceInfoBack=false,isDevSnBack=false;
        if(messageType == 0x03 || messageType == 0x02 || messageType == 0x06 || messageType == 0x04){
            //设备查询-回复
            isRequestStatusBack = true;
        }
        if(messageType == 0xA0){
            //家电信息-回复
            isHomeApplianceInfoBack = true;
        }
        if(messageType == 0x07 ||messageType == 0x11){
            //设备SN-回复
            isDevSnBack = true;
        }
        //设备查询-回复
        if(isRequestStatusBack == true){
               _requestStatusBack = pReceiveMessage;
               _parseRequestStatusBackToStatus(receiveMessageBody);
               _doSynchronousRequestStatusBackToCmd();
        }
        //家电信息-回复
        if(isHomeApplianceInfoBack == true){
               _homeApplianceInfoBack = pReceiveMessage;
               _parseHomeApplianceInfoBackToStatus(receiveMessageBody);
               _doSynchronousHomeApplianceInfoBackToCmd();
        }
        //设备SN-回复
        if(isDevSnBack == true){
               _devSnBack = pReceiveMessage;
               _parseDevSnBackToStatus(receiveMessageBody);
               _doSynchronousDevSnBackToCmd();
        }

        var result = {
               messageType:messageType,
               status:_status
        };
        return result;
    }
    // 设备查询-回复==>_status
    function _parseRequestStatusBackToStatus(pReceiveMessageBody){
        _status.wrongAlarm.value = mdSmart.message.getByte(pReceiveMessageBody,1);
        _status.voice.value = mdSmart.message.getByte(pReceiveMessageBody,2);
        _status.reserve.value = mdSmart.message.getByte(pReceiveMessageBody,3);
        _status.bit7powerOnOff.value = mdSmart.message.getBit(pReceiveMessageBody,4,7);
        _status.bit6CurveMode.value = mdSmart.message.getBit(pReceiveMessageBody,4,6);
        _status.windType.value = mdSmart.message.getBits(pReceiveMessageBody,4,1,3);
        _status.powerOnOff.value = mdSmart.message.getBit(pReceiveMessageBody,4,0);
        _status.gear.value = mdSmart.message.getByte(pReceiveMessageBody,5);
        _status.setTemperature.value = mdSmart.message.getByte(pReceiveMessageBody,6);
        _status.humidity.value = mdSmart.message.getByte(pReceiveMessageBody,7);
        _status.bit7AngleOnOff.value = mdSmart.message.getBit(pReceiveMessageBody,8,7);
        _status.angle.value = mdSmart.message.getBits(pReceiveMessageBody,8,4,6);
        _status.shakeType.value = mdSmart.message.getBits(pReceiveMessageBody,8,1,3);
        _status.shakeSwitch.value = mdSmart.message.getBit(pReceiveMessageBody,8,0);
        _status.humidify.value = mdSmart.message.getBits(pReceiveMessageBody,9,4,7);
        _status.anophelifuge.value = mdSmart.message.getBits(pReceiveMessageBody,9,2,3);
        _status.anion.value = mdSmart.message.getBits(pReceiveMessageBody,9,0,1);
        _status.timingOffMinute.value = pReceiveMessageBody[10] >> 5;
        _status.timingOffHour.value = pReceiveMessageBody[10] & 31;
        _status.timingOnMinute.value = pReceiveMessageBody[11] >> 5;
        _status.timingOnHour.value = pReceiveMessageBody[11] & 31;
        _status.humidifyFeedback.value = mdSmart.message.getByte(pReceiveMessageBody,12);
        _status.temperatureFeedback.value = mdSmart.message.getByte(pReceiveMessageBody,13);
        _status.timingOffMinuteLow.value = mdSmart.message.getBits(pReceiveMessageBody,14,4,7);
        _status.timingOnMinuteLow.value = mdSmart.message.getBits(pReceiveMessageBody,14,0,3);
        _status.scene.value = mdSmart.message.getByte(pReceiveMessageBody,16);
        _status.versionLow.value = mdSmart.message.getBits(pReceiveMessageBody,18,0,3);
        _status.versionHigh.value = mdSmart.message.getBits(pReceiveMessageBody,18,4,7);
    }
    //家电信息查询-回复==>_status
    function _parseHomeApplianceInfoBackToStatus(pReceiveMessageBody){
        _status.homeApplianceType.value = mdSmart.message.getByte(pReceiveMessageBody,1);
        _status.model.value = pReceiveMessageBody[3] << 8 | pReceiveMessageBody[2];
        _status.snLength.value = mdSmart.message.getByte(pReceiveMessageBody,4);
        for(var i = 0; i < 29; i++){
            _status.snContent.value[i] = mdSmart.message.getByte(pReceiveMessageBody,i + 5);
        }
    }
    //设备SN-回复==>_status
    function _parseDevSnBackToStatus(pReceiveMessageBody){
        for(var i = 0; i < 29; i++){
            _status.snContent.value[i] = mdSmart.message.getByte(pReceiveMessageBody,i + 5);
        }
    }
    function _doSynchronousRequestStatusBackToCmd(){
    }
    function _doSynchronousHomeApplianceInfoBackToCmd(){
    }
    function _doSynchronousDevSnBackToCmd(){
    }

    return{
        /**
         * 设备查询-请求命令
         *
         *@return {byteArray} 设备查询-请求
         */
        cmdRequestStatus:function(){
            var messageBody = undefined;
            var message = mdSmart.message.createMessage(0xFA,0x03,messageBody);
            return message;
        },
        /**
         * 家电信息查询-请求命令
         *
         *@return {byteArray} 家电信息查询-请求
         */
        cmdRequestHomeApplianceInfo:function(){
            var messageBody = undefined;
            var message = mdSmart.message.createMessage(0xFA,0xA0,messageBody);
            return message;
        },
        /**
         * 设备SN读取-请求命令
         *
         *@return {byteArray} 设备SN读取-请求
         */
        cmdRequestReadDevSn:function(){
            var messageBody = undefined;
            var message = mdSmart.message.createMessage(0xFA,0x07,messageBody);
            return message;
        },
        /**
         * 设备SN写入-请求命令
         *
         *@return {byteArray} 设备SN写入-请求
         */
        cmdRequestWriteDevSn:function(){
            var messageBody = undefined;
            var message = mdSmart.message.createMessage(0xFA,0x11,messageBody);
            return message;
        },
        /**
         * 生成开机-请求命令
         *
         *@return {byteArray} 开机-请求
         */
        cmdControlPowerOn:function(){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setByte(messageBody,4,0x01);
            var message = mdSmart.message.createMessage(0xFA,0x02,messageBody);
            return message;
        },
        cmdControlPowerOnAndScene:function(scene){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setByte(messageBody,4,0x01);
            mdSmart.message.setByte(messageBody, 16,scene & 0xFF);
            var message = mdSmart.message.createMessage(0xFA,0x02,messageBody);
            return message;          
        },
        /**
         * 生成关机-请求命令
         *
         *@return {byteArray} 关机-请求
         */
        cmdControlPowerOff:function(){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setByte(messageBody,4,0x00);
            var message = mdSmart.message.createMessage(0xFA,0x02,messageBody);
            return message;
        },
        /**
         * 设置设备语音-请求命令
         *@param {byte} pSetType 设置类型
         *                0 - 无效
         *                0x01 - 开启语音导航
         *                0x02 - 关闭语音导航
         *                0x04 - 开启蜂鸣器
         *                0x08 - 关闭蜂鸣器
         *                0x05 - 同时开启语音导航和蜂鸣器
         *                0x0A - 完全静音
         *@return {byteArray} 设置设备语音-请求
         */
        cmdControlDevVoice:function(pSetType){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setBit(messageBody,4,7,0x01);
            mdSmart.message.setByte(messageBody, 2, pSetType & 0xFF);
            var message = mdSmart.message.createMessage(0xFA, 0x02, messageBody);
            return message;
        },
        cmdControlDevVoiceAndScene:function(pSetType,scene){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setBit(messageBody,4,7,0x01);
            mdSmart.message.setByte(messageBody, 16,scene & 0xFF);

            mdSmart.message.setByte(messageBody, 2, pSetType & 0xFF);
            var message = mdSmart.message.createMessage(0xFA, 0x02, messageBody);
            return message;           
        },
        /**
         * 设置温度-请求命令
         *@param {byte} pTemperature 设置类型
         *                0    - 无效
         *                0x01 ~ 0x5b表示-40 ~ +50
         *                0x80 - 取消温度设置
         *@return {byteArray} 设置温度-请求
         */
        cmdControlTemperature:function(pTemperature){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setBit(messageBody, 4, 7, 0x01);
            mdSmart.message.setByte(messageBody, 6, pTemperature & 0xFF);
            var message = mdSmart.message.createMessage(0xFA, 0x02, messageBody);
            return message;
        },
        /**
         * 设置湿度-请求命令
         *@param {byte} pHumidity 湿度
         *                0    - 无效
         *                0x01 ~ 0x64表示1%RH ~ 100%RH
         *                0x80 - 取消湿度设置
         *@return {byteArray} 设置湿度-请求
         */
        cmdControlHumidity:function(pHumidity){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setBit(messageBody, 4, 7, 0x01);
            mdSmart.message.setByte(messageBody, 7, pHumidity & 0xFF);
            var message = mdSmart.message.createMessage(0xFA, 0x02, messageBody);
            return message;
        },
        /**
         * 设备立刻开机，定时关机6小时-请求命令
         * @param (int) pHour 小时
         *
         *@return {byteArray} 设备立刻开机，定时关机6小时-请求命令
         */
        cmdPowerOnAndTimerPowerOffHourFunction:function(pHour){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setByte(messageBody, 4, 0x01);
            mdSmart.message.setByte(messageBody, 8, 0x80);
            mdSmart.message.setBits(messageBody, 10,0,4, pHour & 0xFF);
            mdSmart.message.setBits(messageBody, 10,5,7, 0x00);
            mdSmart.message.setBits(messageBody, 14,4,7, 0x00);
            var message = mdSmart.message.createMessage(0xFA, 0x02, messageBody);
            return message;
        },
        /**
         * 设备立刻关机，定时开机6小时-请求命令
         * @param (int) pHour 小时
         *
         *@return {byteArray} 设备立刻开机，定时关机6小时-请求命令
         */
        cmdPowerOffAndTimerPowerOnHourFunction:function(pHour){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setByte(messageBody, 4, 0x00);
            mdSmart.message.setByte(messageBody, 8, 0x80);
            mdSmart.message.setBits(messageBody, 11, 0, 4, pHour & 0xFF);
            mdSmart.message.setBits(messageBody, 11, 5, 7, 0x00);
            mdSmart.message.setBits(messageBody, 14, 0, 3, 0x00);
            var message = mdSmart.message.createMessage(0xFA, 0x02, messageBody);
            return message;
        },
        /**
         * 设备立刻关机，定时开机10小时30分钟-请求命令
         * @param (int) pHour 小时
         * @param (int) pMinute 分钟
         *
         *@return {byteArray} 设备立刻关机，定时开机10小时30分钟-请求命令
         */
        cmdPowerOffAndTimerPowerOnHourAndMinutesFunction:function(pHour, pMinutes){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setByte(messageBody, 4, 0x00);
            mdSmart.message.setByte(messageBody, 8, 0x80);
            mdSmart.message.setBits(messageBody, 11, 0, 4, pHour & 0xFF);
            mdSmart.message.setBits(messageBody, 11, 5, 7, parseInt(pMinutes/10));
            mdSmart.message.setBits(messageBody, 14, 0, 3, parseInt(pMinutes%10));
            var message = mdSmart.message.createMessage(0xFA, 0x02, messageBody);
            return message;
        },
        /**
         * 定时开机10小时30分钟-请求命令
         * @param (int) pHour 小时
         * @param (int) pMinute 分钟
         *
         *@return {byteArray} 设备立刻关机，定时开机10小时30分钟-请求命令
         */
        cmdTimerPowerOnHourAndMinutesFunction:function(pHour, pMinutes){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setByte(messageBody, 4, 0x80);
            mdSmart.message.setByte(messageBody, 8, 0x80);
            mdSmart.message.setBits(messageBody, 11, 0, 4, pHour & 0xFF);
            mdSmart.message.setBits(messageBody, 11, 5, 7, parseInt(pMinutes/10));
            mdSmart.message.setBits(messageBody, 14, 0, 3, parseInt(pMinutes%10));
            var message = mdSmart.message.createMessage(0xFA, 0x02, messageBody);
            return message;
        },
        /**
         * 设备立刻开机，定时关机10小时30分钟-请求命令
         * @param (int) pHour 小时
         * @param (int) pMinute 分钟
         *
         *@return {byteArray} 设备立刻开机，定时关机10小时30分钟-请求命令
         */
        cmdPowerOnAndTimerPowerOffHourAndMinutesFunction:function(pHour,pMinutes){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setByte(messageBody, 4, 0x01);
            mdSmart.message.setByte(messageBody, 8, 0x80);
            mdSmart.message.setBits(messageBody, 10,0,4, pHour & 0xFF);
            mdSmart.message.setBits(messageBody, 10,5,7, parseInt(pMinutes/10));
            mdSmart.message.setBits(messageBody, 14,4,7, parseInt(pMinutes%10));
            var message = mdSmart.message.createMessage(0xFA, 0x02, messageBody);
            return message;
        },
         /**
         * 设备立刻开机，定时关机10小时30分钟-请求命令
         * @param (int) pHour 小时
         * @param (int) pMinute 分钟
         *
         *@return {byteArray} 设备立刻开机，定时关机10小时30分钟-请求命令
         */
        cmdTimerPowerOffHourAndMinutesFunction:function(pHour,pMinutes){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setByte(messageBody, 4, 0x80);
            mdSmart.message.setByte(messageBody, 8, 0x80);
            mdSmart.message.setBits(messageBody, 10,0,4, pHour & 0xFF);
            mdSmart.message.setBits(messageBody, 10,5,7, parseInt(pMinutes/10));
            mdSmart.message.setBits(messageBody, 14,4,7, parseInt(pMinutes%10));
            var message = mdSmart.message.createMessage(0xFA, 0x02, messageBody);
            return message;
        },
       /**
         * 取消定时关机-请求命令
         *
         *@return {byteArray} 取消定时关机-请求
         */
        cmdControlCancelTimerPowerOff:function(){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setByte(messageBody, 4, 0x80);
            mdSmart.message.setByte(messageBody, 8, 0x80);
            mdSmart.message.setBits(messageBody, 10,0,4, 0x00);
            mdSmart.message.setBits(messageBody, 10,5,7, 0x06);
            mdSmart.message.setBits(messageBody, 14,4,7, 0x00);
            var message = mdSmart.message.createMessage(0xFA, 0x02, messageBody);
            return message;
        },
        cmdControlCancelTimerPowerOffAndScene:function(scene){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setByte(messageBody, 4, 0x80);
            mdSmart.message.setByte(messageBody, 8, 0x80);
            mdSmart.message.setBits(messageBody, 10,0,4, 0x00);
            mdSmart.message.setBits(messageBody, 10,5,7, 0x06);
            mdSmart.message.setBits(messageBody, 14,4,7, 0x00);

            mdSmart.message.setByte(messageBody, 16,scene & 0xFF);
            var message = mdSmart.message.createMessage(0xFA, 0x02, messageBody);
            return message;
        },      
        /**
         * 取消定时开机-请求命令
         *
         *@return {byteArray} 取消定时开机-请求
         */
        cmdControlCancelTimerPowerOn:function(){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setByte(messageBody, 4, 0x80);
            mdSmart.message.setByte(messageBody, 8, 0x80);
            mdSmart.message.setBits(messageBody, 11, 0, 4, 0x00);
            mdSmart.message.setBits(messageBody, 11, 5, 7, 0x06);
            mdSmart.message.setBits(messageBody, 14, 0, 3, 0x00);
            var message = mdSmart.message.createMessage(0xFA, 0x02, messageBody);
            return message;
        },
        /**
         * power and timer
         * @param (int) pPower 开/关机
         *              0x00-关机
         *              0x01-开机
         *              0x80-不控制开/关机
         * @param (int) pOnHour 定时开机小时
         * @param (int) pOnMinute 定时开机分钟
         * @param (int) pOffHour 定时关机小时
         * @param (int) pOffMinute 定时关机分钟
         *
         *@return {byteArray} 开/关机、定时开机、定时关机-请求命令
         */
        cmdPowerAndTimer:function(pPower,pOnHour,pOnMinute,pOffHour,pOffMinute){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setByte(messageBody, 4, pPower & 0xFF);
            mdSmart.message.setByte(messageBody, 8, 0x80);
            mdSmart.message.setBits(messageBody, 10,0,4, pOffHour & 0xFF);
            mdSmart.message.setBits(messageBody, 10,5,7, parseInt(pOffMinute/10));
            mdSmart.message.setBits(messageBody, 14,4,7, parseInt(pOffMinute%10));
            mdSmart.message.setBits(messageBody, 11, 0, 4, pOnHour & 0xFF);
            mdSmart.message.setBits(messageBody, 11, 5, 7, parseInt(pOnMinute/10));
            mdSmart.message.setBits(messageBody, 14, 0, 3, parseInt(pOnMinute%10));
            var message = mdSmart.message.createMessage(0xFA, 0x02, messageBody);
            return message;
        },
        /**
         * 设置风类型-请求命令
         *@param {byte} pWindType 风类型
         *                0 - 无效
         *                0x01 - 正常风
         *                0x02 - 自然风
         *                0x03 - 睡眠风
         *                0x04 - 舒适风
         *                0x05 - 静音
         *@return {byteArray} 设置风类型-请求
         */
        cmdControlWindType:function(pWindType){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setBit(messageBody,4,7,0x01);
            mdSmart.message.setBits(messageBody,4,1,3,pWindType & 0xFF);
            mdSmart.message.setByte(messageBody, 8, 0x80);
            var message = mdSmart.message.createMessage(0xFA, 0x02, messageBody);
            return message;
        },
        /**
         * 设置N档-请求命令
         *@param (int) pGear 档位
         *@return {byteArray} 设置N档-请求
         */
        cmdControlGear:function(pGear){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setBit(messageBody, 4, 7, 0x01);
            mdSmart.message.setByte(messageBody, 5, pGear & 0xFF);
            mdSmart.message.setByte(messageBody, 8, 0x80);
            var message = mdSmart.message.createMessage(0xFA, 0x02, messageBody);
            return message;
        },
        cmdControlGearAndWindType:function(pGear,pWindType){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setBit(messageBody, 4, 7, 0x01);
            mdSmart.message.setByte(messageBody, 5, pGear & 0xFF);
            mdSmart.message.setBits(messageBody,4,1,3,pWindType & 0xFF);
            mdSmart.message.setByte(messageBody, 8, 0x80);
            var message = mdSmart.message.createMessage(0xFA, 0x02, messageBody);
            return message;
        },
        /**
         * 设置场景+档位
         * @param  {int} pScene 场景
         * @return {byteArray} 设置场景-请求
         */
        cmdControlSceneAndGear:function(type,gear){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setBit(messageBody, 4, 7, 0x01);
            mdSmart.message.setByte(messageBody, 16,type & 0xFF);

            //风速
            mdSmart.message.setByte(messageBody, 5, gear & 0xFF);
            mdSmart.message.setByte(messageBody, 8, 0x80);

            var message = mdSmart.message.createMessage(0xFA, 0x02, messageBody);
            return message;
        },
        /**
         * 设置场景+摇头
         * @param  {int} pScene 场景
         * @return {byteArray} 设置场景-请求
         */
        cmdControlSceneAndShake:function(type,shake){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setBit(messageBody, 4, 7, 0x01);
            mdSmart.message.setByte(messageBody, 16,type & 0xFF);

            mdSmart.message.setBits(messageBody,8,4,6, shake & 0xFF);
            // 2015/02/11 按照安卓手机修改
            mdSmart.message.setBit(messageBody,8,7,0x00);
            mdSmart.message.setBits(messageBody,8,1,3,0x00);
            
            mdSmart.message.setBit(messageBody,8,0, 0x01);

            var message = mdSmart.message.createMessage(0xFA, 0x02, messageBody);
            return message;
        }, 
        /**
         * 设置场景+关闭摇头
         * @param  {int} pScene 场景
         * @return {byteArray} 设置场景-请求
         */
        cmdControlSceneAndCloseShake:function(type){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setBit(messageBody, 4, 7, 0x01);
            mdSmart.message.setByte(messageBody, 16,type & 0xFF);
            mdSmart.message.setByte(messageBody, 8, 0x00);

            var message = mdSmart.message.createMessage(0xFA, 0x02, messageBody);
            return message;
        },
        /**
         * 设置场景+定时关
         * @param  {int} pScene 场景
         * @return {byteArray} 设置场景-请求
         */
        cmdControlSceneAndBookTime:function(type,pHour,pMinutes){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setByte(messageBody, 4, 0x01);
            mdSmart.message.setByte(messageBody, 8, 0x80);
            mdSmart.message.setByte(messageBody, 16,type & 0xFF);

            mdSmart.message.setBits(messageBody, 10,0,4, pHour & 0xFF);
            mdSmart.message.setBits(messageBody, 10,5,7, parseInt(pMinutes/10));
            mdSmart.message.setBits(messageBody, 14,4,7, parseInt(pMinutes%10));
            var message = mdSmart.message.createMessage(0xFA, 0x02, messageBody);
            return message;
        }, 
        /**
         * 设置场景+关闭定时关
         * @param  {int} pScene 场景
         * @return {byteArray} 设置场景-请求
         */
        cmdControlSceneAndCloseBookTime:function(type){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setByte(messageBody, 4, 0x80);
            mdSmart.message.setByte(messageBody, 8, 0x80);
            mdSmart.message.setByte(messageBody, 16,type & 0xFF);

            mdSmart.message.setBits(messageBody, 10,0,4, 0x00);
            mdSmart.message.setBits(messageBody, 10,5,7, 0x06);
            mdSmart.message.setBits(messageBody, 14,4,7, 0x00);

            var message = mdSmart.message.createMessage(0xFA, 0x02, messageBody);
            return message;
        },         
        /**
         * 设置场景-无
         * @param  {int} pScene 场景
         * @return {byteArray} 设置场景-请求
         */
        cmdControlScene:function(type){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setBit(messageBody, 4, 7, 0x01);
            mdSmart.message.setByte(messageBody, 16,type & 0xFF);

            var message = mdSmart.message.createMessage(0xFA, 0x02, messageBody);
            return message;
        },
                     
        /**
         * 睡眠风演示
         * @return {byteArray} 睡眠风开
         */
        cmdControlTestOn:function(){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setBit(messageBody, 4, 7, 0x01);
            mdSmart.message.setByte(messageBody, 17,0x01);
            var message = mdSmart.message.createMessage(0xFA, 0x02, messageBody);
            return message;           
        },
        /**
         * 睡眠风演示
         * @return {byteArray} 睡眠风关
         */
        cmdControlTestOff:function(){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setBit(messageBody, 4, 7, 0x01);
            mdSmart.message.setByte(messageBody, 17,0x00);
            var message = mdSmart.message.createMessage(0xFA, 0x02, messageBody);
            return message;           
        },
        /**
         * 打开摇头-请求命令
         *@return {byteArray} 设置打开摇头-请求
         */
        cmdControlShakeSwitchOn:function(){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setBit(messageBody, 4, 7, 0x01);
            mdSmart.message.setByte(messageBody, 8, 0x01);
            var message = mdSmart.message.createMessage(0xFA, 0x02, messageBody);
            return message;
        },
        /**
         * 关闭摇头-请求命令
         *@return {byteArray} 设置关闭摇头-请求
         */
        cmdControlShakeSwitchOff:function(){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setBit(messageBody, 4, 7, 0x01);
            mdSmart.message.setByte(messageBody, 8, 0x00);
            var message = mdSmart.message.createMessage(0xFA, 0x02, messageBody);
            return message;
        },
        /**
         * 设置摇头（摆风）角度-请求命令
         *@param {int} pShakeAngleValue 摇头（摆风）角度
         *                0 - 无效
         *                1 - 30度
         *                2 - 60度
         *                3 - 90度
         *                4 - 120度
         *                5 - 180度
         *                6 - 360度
         *@return {byteArray}  设置摇头（摆风）角度-请求
         */
        cmdControlShakeAngle:function(pShakeAngleValue){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setBit(messageBody, 4,7, 0x01);
            mdSmart.message.setBits(messageBody,8,4,6, pShakeAngleValue & 0xFF);
            // 2015/02/11 按照安卓手机修改
            mdSmart.message.setBit(messageBody,8,7,0x00);
            mdSmart.message.setBits(messageBody,8,1,3,0x00);
            
            mdSmart.message.setBit(messageBody,8,0, 0x01);
            var message = mdSmart.message.createMessage(0xFA, 0x02, messageBody);
            return message;
        },
        /**
         * 设置摇头（摆风）类型-请求命令
         *@param {int} pShakeTypeValue 摇头（摆风）类型
         *                0 - 无效
         *                1 - 左右摇头
         *                2 - 上下摇头
         *                3 - 8字摇头
         *                4 - W摇头
         *@return {byteArray}  设置摇头（摆风）类型-请求
         */
        cmdControlShakeType:function(pShakeTypeValue){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setBit(messageBody, 4, 7, 0x01);
            mdSmart.message.setBits(messageBody,8,1,3, pShakeTypeValue & 0xFF);
            mdSmart.message.setBit(messageBody,8,0, 0x01);
            var message = mdSmart.message.createMessage(0xFA, 0x02, messageBody);
            return message;
        },
        /**
         * 设置加湿-请求命令
         *@param {int} pHumidifyValue 加湿
         *                0 - 无效
         *                1 - 关闭加湿
         *                2 - 无档位变化加湿
         *                3 - 1档加湿
         *                4 - 2档加湿
         *                5 - 3档加湿
         *@return {byteArray}  设置加湿-请求
         */
        cmdControlHumidify:function(pHumidifyValue){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setBit(messageBody, 4, 7, 0x01);
            mdSmart.message.setBit(messageBody, 8, 7, 0x01);
            mdSmart.message.setByte(messageBody,9, (pHumidifyValue & 0xFF) << 4);
            var message = mdSmart.message.createMessage(0xFA,0x02,messageBody);
            return message;
        },
        /**
         * 设置驱蚊功能-请求命令
         *@param {int} pAnophelifugeValue 驱蚊
         *                0 - 无效
         *                1 - 驱蚊开
         *                2 - 驱蚊关
         *@return {byteArray}  设置驱蚊功能-请求
         */
        cmdControlAnophelifuge:function(pAnophelifugeValue){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setByte(messageBody,9, (pAnophelifugeValue & 0xFF) << 2);
            mdSmart.message.setBit(messageBody, 4, 7, 0x01);
            mdSmart.message.setBit(messageBody, 8, 7, 0x01);
            var message = mdSmart.message.createMessage(0xFA,0x02,messageBody);
            return message;
        },
        /**
         * 设置负离子功能-请求命令
         *@param {int} pAnionValue 负离子
         *                0 - 无效
         *                1 - 负离子开
         *                2 - 负离子关
         *@return {byteArray}  设置负离子功能-请求
         */
        cmdControlAnion:function(pAnionValue){
            var messageBody = mdSmart.message.createMessageBodyFA(19);
            mdSmart.message.setBit(messageBody, 4, 7, 0x01);
            mdSmart.message.setBit(messageBody, 8, 7, 0x01);
            mdSmart.message.setByte(messageBody,9, pAnionValue & 0xFF);
            var message = mdSmart.message.createMessage(0xFA,0x02,messageBody);
            return message;
        },
        /**
        * 解析报文
        *@param {byteArray} message 报文
        *@return {json}
        */
        parseMessageForView:function(message){
            return _parseMessage(message);
        },
        //状态查询-回复
        getRequestStatusBack:function(){
            return _requestStatusBack;
        },
        //家电信息查询-回复
        getHomeApplianceInfoBack:function(){
            return _homeApplianceInfoBack;
        },
        //设备SN读取-回复
        getDevSnBack:function(){
            return _devSnBack;
        }
    }
}