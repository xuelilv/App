(function(mdSmart) {
 
    mdSmart.DB_P03 = mdSmart.DB_P03 || {};
    var selectedHour;
    var swiperTime_H;

	var selectedType;
	var swiperStains;
    // 程序设置（配置文件）
    // [UPD] by yurc
    //mdSmart.DB_P03.MODE_TXT = "/www/T0xDB/config/mode_lh0";
    mdSmart.DB_P03.MODE_TXT = "";
    mdSmart.DB_P03.MODE_TXT_PATH = "/T0xDB/config/mode_";
    // 程序设置（配置文件JSON）
    mdSmart.DB_P03.MODE_JSON = "";
    // 参数设置（配置文件）
    // [UPD] by yurc
    //mdSmart.DB_P03.PARAMETER_TXT = "/www/T0xDB/config/parameter_lh0";
    mdSmart.DB_P03.PARAMETER_TXT = "";
    mdSmart.DB_P03.PARAMETER_TXT_PATH = "/T0xDB/config/parameter_";
    // 参数设置（配置文件JSON）
    mdSmart.DB_P03.PARAMETER_JSON = "";
    // 程序是否处于运行状态（true:是、false:否）
    mdSmart.DB_P03.isRun = false;
    // 程序是否处于暂停状态（true:是、false:否）
    mdSmart.DB_P03.isSuspended = false
    // 童锁是否可操作（true:可、false:不可）
    mdSmart.DB_P03.isStandby = false
    // 童锁(true:童锁状态、false:非童锁状态)
    mdSmart.DB_P03.isBh = false;
    // 程序设置页 or 参数设置页显示区分(cycle:程序设置、parm:参数设置)
    mdSmart.DB_P03.adjustParam = "";
    // 当前的cycle程序(值)
    mdSmart.DB_P03.selectedCycle = "";
    // 当前的cycle程序(名称)
    mdSmart.DB_P03.selectedCycleName = "";
    // 当前的cycle程序(值[参数设置页])
    mdSmart.DB_P03.selectedCycleParm = "";
    // 当前参数索引值
    mdSmart.DB_P03.selectedIndex = new Array();
    // 洗涤时间
    mdSmart.DB_P03.swiper0Array = new Array();
    // 漂洗次数
    mdSmart.DB_P03.swiper1Array = new Array();
    // 脱水时间
    mdSmart.DB_P03.swiper2Array = new Array();
    // 温度
    mdSmart.DB_P03.swiper3Array = new Array();
    // 脱水速度
    mdSmart.DB_P03.swiper4Array = new Array();
    // 烘干
    mdSmart.DB_P03.swiper5Array = new Array();
    // 水位
    mdSmart.DB_P03.swiper6Array = new Array();
    // 洗涤剂
    mdSmart.DB_P03.swiper7Array = new Array();
    // 柔顺剂
    mdSmart.DB_P03.swiper8Array = new Array();
    // 回复消息
    var status;
 
    // [ADD] by yurc.---温度与洗涤时间联动问题修改。
    var washTimeDefaultIndex = 99;
    var washTimeDataArray;
    var vashTimeSwiperArray;
 
    /* 初期化处理（页面显示前） */
    $(document).on('pageinit', 'div[id="DB_P03"]', function(event) {
        mdSmartios.bridge.logToIOS("pageinit(DB_P03) 开始");
                   
        // 消息体初始化
        mdSmart.DB_P03.message = new mdSmart.msg0xDB();
        // 回复消息接收、页面显示
        $(document).bind('recieveMessage', {}, function(event, message) {
            mdSmart.DB_P03.showStatus(message);
        });
                   
        // [ADD] by yurc
        mdSmart.DB_P03.adjustParam = "cycle";
                   
        // [ADD] by yurc
        // 发送查询指令
        var cmdBytes = mdSmart.DB_P03.message.queryDeviceParameter();
        bridge.startCmdProcess(cmdBytes, function(data) {
            mdSmart.DB_P03.showStatus(data);
        });
        
        /* [DEL] by yurc
        // 配置文件加载
        var param = {"fileName":mdSmart.DB_P03.MODE_TXT};
        // 程序选择
        bridge.getConfigInfo(param,function(message){
            mdSmart.DB_P03.MODE_JSON = message;
        });
        var param = {"fileName":mdSmart.DB_P03.PARAMETER_TXT};
        // 参数设置
        bridge.getConfigInfo(param,function(message){
            mdSmart.DB_P03.PARAMETER_JSON = message;
        });*/
                   
        // 参数滚轮初始化
        mdSmart.DB_P03.initSwiper();
		// 预约定时
		var opt1={};
		var isOk1 = false;
        var isBlank1 = false;
		opt1.time = {preset : 'time'};
		opt1.default = {
			theme: 'ios-datetime light', //皮肤样式
	        display: 'modal', //显示方式
	        mode: 'scroller', //日期选择模式
			width: 70,
            height: 28,
			rows:5,
			loop:true,
			headerText:mdSmart.i18n.RESERVATION_SETTING,
			hourText:mdSmart.i18n.hour,
			//minuteText:mdSmart.i18n.minute,
			setText:mdSmart.i18n.SETTIMER_SETTEXT,
			cancelText:mdSmart.i18n.SETTIMER_CANCELTEXT,
			// 只需要［小时］，不需要分
			//timeFormat:"HH:ii",
			//timeWheels:"HHii",
			timeFormat:"HH",
			timeWheels:"HH",
			cancelPosition:"left",
			onClose:function(){
				isOk1 = true;
                isBlank1 = false;
				window.setTimeout(function(){
					
					if(isOk1 == true){
						//var hourValue = parseInt(myScroller1.values[0]);
						//var minuteValue = parseInt(myScroller1.values[1]);
						var TotleMinutes = parseInt(myScroller1.values) * 60;
						var lm = TotleMinutes & 0x00FF;
						var hm = (TotleMinutes & 0xFF00) >> 8;
						var cmdBytes;
						cmdBytes = mdSmart.DB_P03.message.setMakeAppointment(hm, lm);
						bridge.startCmdProcess(cmdBytes, function(data) {
							mdSmart.DB_P03.showStatus(data);
							});
					} 

					return false;
				}, 0)
			},
			onCancel:function(){
				isOk1 = false;
                isBlank1 = false;
            },
            onCancelBlank:function(){
                isOk1 = false;
                isBlank1 = true;
            }
		};
		var optTime1 = $.extend(opt1['time'], opt1['default']);
	    $("#appTime_on").mobiscroll(optTime1).time(optTime1);
		mdSmart.DB_P03.myScroller1 = myScroller1 = getscrollers()["appTime_on"];
    });
    
	// 解除事件绑定
    $(document).on('pagehide', 'div[id="DB_P03"]', function(event) {
        $('#DB_P03_BTN_TIMER_CANCEL').unbind('tap');
		$('#DB_P03_BTN_TIMER_CONFIRM').unbind('tap');
		$('#bookingSetDialog').unbind('tap');

        $('#DB_P03_BTN_STAINS_SET_CANCEL').unbind('tap');
		$('#DB_P03_BTN_STAINS_SET_CONFIRM').unbind('tap');
		$('#StainsSetDialog').unbind('tap');
    });

    /* 初期化处理（页面显示） */
    $(document).on('pageshow', 'div[id="DB_P03"]', function(event) {
        mdSmartios.bridge.logToIOS("pageshow(DB_P03) 开始");
		$("#bookingSetDialog").hide();
		$("#StainsSetDialog").hide();
		
		$("#bookingSetDialog").bind('tap',{}, function(e) {
			if (mdSmart.common.isOperationLock() == true) { return false; }
			$("#bookingSetDialog").hide();
			selectedHour = 0;
		});
		
		$("#StainsSetDialog").bind('tap',{}, function(e) {
			if (mdSmart.common.isOperationLock() == true) { return false; }
			$("#StainsSetDialog").hide();
			selectedType = 0;
		});
		
		$('#DB_P03_BTN_TIMER_CANCEL').bind('tap',{}, function(e) {
			if (mdSmart.common.isOperationLock() == true) { return false; }
            window.setTimeout(function() {
                $("#bookingSetDialog").hide();
                selectedHour = 0;
            }, 50);
		});
		
		$('#DB_P03_BTN_TIMER_CONFIRM').bind('tap',{}, function(e) {
			if (mdSmart.common.isOperationLock() == true) { return false; }
			var TotleMinutes = selectedHour * 60;
			var lm = TotleMinutes & 0x00FF;
			var hm = (TotleMinutes & 0xFF00) >> 8;
			var cmdBytes;
			cmdBytes = mdSmart.DB_P03.message.setMakeAppointment(hm, lm);
			bridge.startCmdProcess(cmdBytes, function(data) {
				mdSmart.DB_P03.showStatus(data);
			});
			$("#bookingSetDialog").hide();
			selectedHour = 0;
		});

		$('#DB_P03_BTN_STAINS_SET_CANCEL').bind('tap',{}, function(e) {
            if (mdSmart.common.isOperationLock() == true) { return false; }
            window.setTimeout(function() {
                $("#StainsSetDialog").hide();
                selectedType = 0;
            }, 50);
		});
		
		$('#DB_P03_BTN_STAINS_SET_CONFIRM').bind('tap',{}, function(e) {
			if (mdSmart.common.isOperationLock() == true) { return false; }

			var cmdBytes;
			cmdBytes = mdSmart.DB_P03.message.setSpecialStainsWash(selectedType);
			bridge.startCmdProcess(cmdBytes, function(data) {
				mdSmart.DB_P03.showStatus(data);
			});
			$("#StainsSetDialog").hide();
			selectedType = 0;
		});	
    
        /* 返回按钮 */
        $(".back").bind('tap', {}, function(e) {
                        
            if (mdSmart.common.isOperationLock() == true) { return false; }
                        
            if ("parm" == mdSmart.DB_P03.adjustParam) {
                // [DEL] by yurc.
                //$('.text_3').html(mdSmart.i18n['programSelect']);
                $('.wrapper1').show();
                $('#paramAdjust').hide();
                mdSmart.DB_P03.adjustParam = "cycle";
                        
                var cmdBytes = mdSmart.DB_P03.message.queryDeviceParameter();
                bridge.startCmdProcess(cmdBytes, function(data) {
                    mdSmart.DB_P03.showStatus(data);
                });
            } else {
                bridge.goBack();
            }
        });

		/******绑定水电量的tab页--add by lxz---start******/
		$('#DB_P09_DAY').bind('tap',{}, function(e) {
			if ($(this).hasClass("order_1")) {
				mdSmart.DB_P03.removeEleActive($(this).attr("id"));
				$(this).addClass("order_1_active");
			}
		 });
		 $('#DB_P09_WEEK').bind('tap',{}, function(e) {
			if ($(this).hasClass("order_2")) {
				mdSmart.DB_P03.removeEleActive($(this).attr("id"));
				$(this).addClass("order_2_active");
			}
		 });
		 $('#DB_P09_MONTH').bind('tap',{}, function(e) {
			if ($(this).hasClass("order_2")) {
				mdSmart.DB_P03.removeEleActive($(this).attr("id"));
				$(this).addClass("order_2_active");
			}
		 });
		 $('#DB_P09_YEAR').bind('tap',{}, function(e) {
			if ($(this).hasClass("order_3")) {
				mdSmart.DB_P03.removeEleActive($(this).attr("id"));
				$(this).addClass("order_3_active");
			}
		 });
		/******绑定水电量的tab页--add by lxz---end********/

        /* 信息参数 */
        $(".link").bind('tap', {}, function(e) {
            if (mdSmart.common.isOperationLock() == true) { return false; }
			
			/******加载水电量统计的top页面数据--add by lxz---start******/
			//消耗水量
			$("#show_wait_helpbg").show();
			var applianceId = bridge.getCurrentApplianceID();
			var appId16 = mdSmart.DB_P03.toHex(parseInt(applianceId))+"";
			if(appId16.substr(0,2).toUpperCase()=="FF"){
				var timer2S = window.setTimeout(mdSmart.DB_P03.showAlertOutP03("P04",mdSmart.i18n.linkError1), 0);
				return;
			}
			var resultType = '0';
			var expendType='3';
			var d = new Date();
			var mm = d.getMonth()+1;//月份
			var dd = d.getDate();//日期
			var time = d.getFullYear()+""+(mm>9?mm:"0"+mm)+(dd>9?dd:"0"+dd);
			/**获取水电量值－开始**/
			var result_today_amount = new Array();//返回值[water_today_amount,electric_today_amount]
			var water_today_amount = [0,""];//位1:数量，位2:异常提示信息
			var electric_today_amount = [0,""];//位1:数量，位2:异常提示信息
			var data = "handleType=GetWasherCost&applianceId=" + applianceId + "&resultType="+resultType+ "&expendType=" + expendType + "&time=" + time;
			//"serviceurl":"/v1/base2pro/data/transmit",
			var functionParamers = {
				queryStrings:{ "handleType":"GetWasherCost", "applianceId":applianceId, "resultType":resultType, "expendType":expendType,"time":time},
				transmitData: {"data":data}};
			mdSmartios.bridge.logToIOS("paramers: " + functionParamers);
			mdSmartios.bridge.requestDataTransmit(functionParamers,
				function(data){
					if(data.errorCode!=0){//访问服务器失败等异常提示
						$("#show_wait_helpbg").hide();//隐藏等待标志
						var timer2S = window.setTimeout(mdSmart.DB_P03.showAlertOutP03("P04",data.msg), 0);
						return;
					}
					mdSmartios.bridge.logToIOS("send data success:" + data);
					var water_jsonStr = data.result.returnData.result.water;
					var water_maxArr = mdSmart.DB_P03.getArrayFromJson(water_jsonStr,'amount');
					var electric_jsonStr = data.result.returnData.result.power;
					var electric_maxArr = mdSmart.DB_P03.getArrayFromJson(electric_jsonStr,'amount');
					for(var i=0;i<water_maxArr.length;i++){//单位时间内数据相加
						water_today_amount[0]+=parseInt(water_maxArr[i]);
					}
					for(var i=0;i<electric_maxArr.length;i++){//单位时间内数据相加
						electric_today_amount[0]+=parseInt(electric_maxArr[i]);
					}
					var showWaterStr = 0;
					if(water_today_amount[0]!=0){
						showWaterStr =(parseInt(water_today_amount[0])/10).toFixed(1);
					}
					result_today_amount.push(showWaterStr);
					result_today_amount.push(Math.round(parseInt(electric_today_amount) /10) / 100);
					/**获取水电量值－结束**/
					
					var water_today_amount_head = [0,""];//水
					water_today_amount_head[0] = result_today_amount[0];
					var electric_today_amount_head = [0,""];//电
					electric_today_amount_head[0] = result_today_amount[1];
					if(water_today_amount_head[0]==-1||electric_today_amount_head[0]==-1){
						var msgStr = "";
						if(water_today_amount_head[0]==-1){
							msgStr=water_today_amount_head[1];
						}else{
							msgStr=electric_today_amount_head[1];
						}
						var timer2S = window.setTimeout(mdSmart.DB_P03.showAlertOutP03("P04",msgStr), 0);
						return;
					}
					if(water_today_amount_head[0]==0.0){//规范水量显示格式为0
						water_today_amount_head[0]=0;
					}
					if(electric_today_amount_head[0]==0.0||electric_today_amount_head[0]==0.00){//规范电量显示格式为0
						electric_today_amount_head[0]=0;
					}
					$('#head_water_today_amount').val(water_today_amount_head[0]);//水量值(隐藏值)
					$('#head_electric_today_amount').val(electric_today_amount_head[0]);//电量值(隐藏值)
					$('#span_amount_style_water').html(water_today_amount_head[0]);//首页左侧数值
					$('#span_amount_style_ele').html(electric_today_amount_head[0]);

					var amount_showStr = "消耗水量"+water_today_amount_head[0]+"升";
					$('#water_amount_today_toPage').html(amount_showStr);//首页今日消耗水量
					amount_showStr = '消耗电量'+electric_today_amount_head[0]+'度';
					$('#electric_amount_today_toPage').html(amount_showStr);//首页今日消耗电量
					$("#show_wait_helpbg").hide();
				},
				function(datafail){
					water_today_amount[0]=-1;
					water_today_amount[1]=mdSmart.i18n.linkError2;
					electric_today_amount[0]=-1;
					electric_today_amount[1]=mdSmart.i18n.linkError2;
					mdSmartios.bridge.logToIOS("send data failedda:" + datafail);
					$("#show_wait_helpbg").hide();
				}
			);
			/******加载水电量统计的top页面数据--add by lxz---end******/
			$.mobile.changePage("#DB_P04", "turn");
        });

		// 记忆洗
        $('#memory').bind('tap', {}, function(e) {
            if (mdSmart.common.isOperationLock() == true) { return false; }

            if(mdSmart.DB_P03.isBh == true){
                mdSmart.DB_P03.showAlert(mdSmart.i18n.cancelBh); // 请取消童锁
                return;
            }
                             
            var bi = $('#memory').css('background-image');
            var cmdBytes;
                             
            if (bi.search('_b') == -1) {
                cmdBytes = mdSmart.DB_P03.message.setMemory(1);
                $('#memory').css('background-image', 'url(images/icon_ctl_1_b.png)');
                $('#memory span').css('color', '#fff');
            } else {
                cmdBytes = mdSmart.DB_P03.message.setMemory(0);
                $('#memory').css('background-image', 'url(images/icon_ctl_1.png)');
                $('#memory span').css('color', '#7e8793');
            }
            bridge.startCmdProcess(cmdBytes, function(data) {
                mdSmart.DB_P03.showStatus(data);
            });
        });

        /* 童锁 */
        $('#childLock').bind('tap', {}, function(e) {
            if (mdSmart.common.isOperationLock() == true) { return false; }
			// 运行状态下都能上童锁，任何状态下都能解除童锁
			if (mdSmart.DB_P03.isStandby == false){
				mdSmart.DB_P03.showAlert(mdSmart.i18n.isStandby);
				return;
			}
                             
            var bi = $('#childLock').css('background-image');
            var cmdBytes;
                             
            if (bi.search('_b') == -1) {
                cmdBytes = mdSmart.DB_P03.message.setChildLock(1);
                $('#childLock').css('background-image', 'url(images/icon_ctl_2_b.png)');
                $('#childLock span').css('color', '#fff');
            } else {
                cmdBytes = mdSmart.DB_P03.message.setChildLock(0);
                $('#childLock').css('background-image', 'url(images/icon_ctl_2.png)');
                $('#childLock span').css('color', '#7e8793');
            }
            bridge.startCmdProcess(cmdBytes, function(data) {
                mdSmart.DB_P03.showStatus(data);
            });
        });
                   
        /* 静音(夜间洗）*/
        $('#mute').bind('tap', {}, function(e) {
            if (mdSmart.common.isOperationLock() == true) { return false; }

            if(mdSmart.DB_P03.isBh == true){
                mdSmart.DB_P03.showAlert(mdSmart.i18n.cancelBh); // 请取消童锁
                return;
            }
                        
            var bi = $('#mute').css('background-image');
            var cmdBytes;
                        
            if (bi.search('_b') == -1) {
                cmdBytes = mdSmart.DB_P03.message.setWashAtNight(1);
                $('#mute').css('background-image', 'url(images/icon_ctl_6_b.png)');
                $('#mute span').css('color', '#fff');
            } else {
                cmdBytes = mdSmart.DB_P03.message.setWashAtNight(0);
                $('#mute').css('background-image', 'url(images/icon_ctl_6.png)');
                $('#mute span').css('color', '#7e8793');
            }
            bridge.startCmdProcess(cmdBytes, function(data) {
                mdSmart.DB_P03.showStatus(data);
            });
        });
                   
        /* 筒灯 */
        $('#downlight').bind('tap', {}, function(e) {
            if (mdSmart.common.isOperationLock() == true) { return false; }

            if(mdSmart.DB_P03.isBh == true){
                mdSmart.DB_P03.showAlert(mdSmart.i18n.cancelBh); // 请取消童锁
                return;
            }
                             
            var bi = $('#downlight').css('background-image');
            var cmdBytes;
                             
            if (bi.search('_b') == -1) {
                cmdBytes = mdSmart.DB_P03.message.setDownlight(1);
                $('#downlight').css('background-image', 'url(images/lamp_b.png)');
                $('#downlight span').css('color', '#fff');
            } else {
                cmdBytes = mdSmart.DB_P03.message.setDownlight(0);
                $('#downlight').css('background-image', 'url(images/lamp.png)');
                $('#downlight span').css('color', '#7e8793');
            }
            bridge.startCmdProcess(cmdBytes, function(data) {
                mdSmart.DB_P03.showStatus(data);
            });
        });
                   
        /* 雾态洗 */
        $('#fogWash').bind('tap', {}, function(e) {
            if (mdSmart.common.isOperationLock() == true) { return false; }

            if (mdSmart.DB_P03.isBh == true){
                mdSmart.DB_P03.showAlert(mdSmart.i18n.cancelBh); // 请取消童锁
                return;
            }
                           
            var bi = $('#fogWash').css('background-image');
            var cmdBytes;
                           
            if (bi.search('_b') == -1) {
                cmdBytes = mdSmart.DB_P03.message.setFogState(1);
                $('#fogWash').css('background-image', 'url(images/icon_ctl_11_b.png)');
                $('#fogWash span').css('color', '#fff');
            } else {
                cmdBytes = mdSmart.DB_P03.message.setFogState(0);
                $('#fogWash').css('background-image', 'url(images/icon_ctl_11.png)');
                $('#fogWash span').css('color', '#7e8793');
            }
            bridge.startCmdProcess(cmdBytes, function(data) {
                mdSmart.DB_P03.showStatus(data);
            });
        });

		
		// 加速洗
        $('#speedWash').bind('tap', {}, function(e) {
            if (mdSmart.common.isOperationLock() == true) { return false; }
                                      
            if (mdSmart.DB_P03.isBh == true){
                mdSmart.DB_P03.showAlert(mdSmart.i18n.cancelBh); // 请取消童锁
                return;
            }
                                      
            var bi = $('#speedWash').css('background-image');
            var cmdBytes;
                                      
            if (bi.search('_b') == -1) {
                cmdBytes = mdSmart.DB_P03.message.setSpeedUp(1);
                $('#speedWash').css('background-image', 'url(images/icon_ctl_13_b.png)');
                $('#speedWash span').css('color', '#fff');
            } else {
                cmdBytes = mdSmart.DB_P03.message.setSpeedUp(0);
                $('#speedWash').css('background-image', 'url(images/icon_ctl_13.png)');
                $('#speedWash span').css('color', '#7e8793');
            }
            bridge.startCmdProcess(cmdBytes, function(data) {
                mdSmart.DB_P03.showStatus(data);
            });
        });
		
        /* [ADD] by yurc. 轻松熨 */
        $('#easyIroning').bind('tap', {}, function(e) {
            if (mdSmart.common.isOperationLock() == true) { return false; }
                                      
            if (mdSmart.DB_P03.isBh == true){
                mdSmart.DB_P03.showAlert(mdSmart.i18n.cancelBh); // 请取消童锁
                return;
            }
                                      
            var bi = $('#easyIroning').css('background-image');
            var cmdBytes;
                                      
            if (bi.search('_b') == -1) {
                cmdBytes = mdSmart.DB_P03.message.setEasyIroning(1);
                $('#easyIroning').css('background-image', 'url(images/icon_ctl_7_b.png)');
                $('#easyIroning span').css('color', '#fff');
            } else {
                cmdBytes = mdSmart.DB_P03.message.setEasyIroning(0);
                $('#easyIroning').css('background-image', 'url(images/icon_ctl_7.png)');
                $('#easyIroning span').css('color', '#7e8793');
            }
            bridge.startCmdProcess(cmdBytes, function(data) {
                mdSmart.DB_P03.showStatus(data);
            });
        });

        /* 预约 */
		$('#appointment').bind('tap', {},  mdSmart.DB_P03.openTimingPage);
 
		// 功能选项2
		// 预洗
        $('#prewash').bind('tap', {}, function(e) {
            if (mdSmart.common.isOperationLock() == true) { return false; }
                                      
            if (mdSmart.DB_P03.isBh == true){
                mdSmart.DB_P03.showAlert(mdSmart.i18n.cancelBh); // 请取消童锁
                return;
            }
                                      
            var bi = $('#prewash').css('background-image');
            var cmdBytes;
                                      
            if (bi.search('_b') == -1) {
                cmdBytes = mdSmart.DB_P03.message.setPreWash(1);
                $('#prewash').css('background-image', 'url(images/icon_ctl_14_b.png)');
                $('#prewash span').css('color', '#fff');
            } else {
                cmdBytes = mdSmart.DB_P03.message.setPreWash(0);
                $('#prewash').css('background-image', 'url(images/icon_ctl_14.png)');
                $('#prewash span').css('color', '#7e8793');
            }
            bridge.startCmdProcess(cmdBytes, function(data) {
                mdSmart.DB_P03.showStatus(data);
            });
        });
		// 超净漂洗
        $('#ultraCleanRinse').bind('tap', {}, function(e) {
            if (mdSmart.common.isOperationLock() == true) { return false; }
                                      
            if (mdSmart.DB_P03.isBh == true){
                mdSmart.DB_P03.showAlert(mdSmart.i18n.cancelBh); // 请取消童锁
                return;
            }
                                      
            var bi = $('#ultraCleanRinse').css('background-image');
            var cmdBytes;
                                      
            if (bi.search('_b') == -1) {
                cmdBytes = mdSmart.DB_P03.message.setUltraCleanRinse(1);
                $('#ultraCleanRinse').css('background-image', 'url(images/icon_ctl_15_b.png)');
                $('#ultraCleanRinse span').css('color', '#fff');
            } else {
                cmdBytes = mdSmart.DB_P03.message.setUltraCleanRinse(0);
                $('#ultraCleanRinse').css('background-image', 'url(images/icon_ctl_15.png)');
                $('#ultraCleanRinse span').css('color', '#7e8793');
            }
            bridge.startCmdProcess(cmdBytes, function(data) {
                mdSmart.DB_P03.showStatus(data);
            });
        });
		// 智能漂洗
        $('#smartRinse').bind('tap', {}, function(e) {
            if (mdSmart.common.isOperationLock() == true) { return false; }
                                      
            if (mdSmart.DB_P03.isBh == true){
                mdSmart.DB_P03.showAlert(mdSmart.i18n.cancelBh); // 请取消童锁
                return;
            }
                                      
            var bi = $('#ultraCleanRinse').css('background-image');
            var cmdBytes;
                                      
            if (bi.search('_b') == -1) {
                cmdBytes = mdSmart.DB_P03.message.setSmartRinse(1);
                $('#smartRinse').css('background-image', 'url(images/icon_ctl_16_b.png)');
                $('#smartRinse span').css('color', '#fff');
            } else {
                cmdBytes = mdSmart.DB_P03.message.setSmartRinse(0);
                $('#smartRinse').css('background-image', 'url(images/icon_ctl_16.png)');
                $('#smartRinse span').css('color', '#7e8793');
            }
            bridge.startCmdProcess(cmdBytes, function(data) {
                mdSmart.DB_P03.showStatus(data);
            });
        });
		// 强力洗
        $('#strongWash').bind('tap', {}, function(e) {
            if (mdSmart.common.isOperationLock() == true) { return false; }
                                      
            if (mdSmart.DB_P03.isBh == true){
                mdSmart.DB_P03.showAlert(mdSmart.i18n.cancelBh); // 请取消童锁
                return;
            }
                                      
            var bi = $('#ultraCleanRinse').css('background-image');
            var cmdBytes;
                                      
            if (bi.search('_b') == -1) {
                cmdBytes = mdSmart.DB_P03.message.setStrongWash(1);
                $('#strongWash').css('background-image', 'url(images/icon_ctl_17_b.png)');
                $('#strongWash span').css('color', '#fff');
            } else {
                cmdBytes = mdSmart.DB_P03.message.setStrongWash(0);
                $('#strongWash').css('background-image', 'url(images/icon_ctl_17.png)');
                $('#strongWash span').css('color', '#7e8793');
            }
            bridge.startCmdProcess(cmdBytes, function(data) {
                mdSmart.DB_P03.showStatus(data);
            });
        });
		// 蒸汽洗
        $('#streamWash').bind('tap', {}, function(e) {
            if (mdSmart.common.isOperationLock() == true) { return false; }
                                      
            if (mdSmart.DB_P03.isBh == true){
                mdSmart.DB_P03.showAlert(mdSmart.i18n.cancelBh); // 请取消童锁
                return;
            }
                                      
            var bi = $('#streamWash').css('background-image');
            var cmdBytes;
                                      
            if (bi.search('_b') == -1) {
                cmdBytes = mdSmart.DB_P03.message.setStreamWash(1);
                $('#streamWash').css('background-image', 'url(images/icon_ctl_18_b.png)');
                $('#streamWash span').css('color', '#fff');
            } else {
                cmdBytes = mdSmart.DB_P03.message.setStreamWash(0);
                $('#streamWash').css('background-image', 'url(images/icon_ctl_18.png)');
                $('#streamWash span').css('color', '#7e8793');
            }
            bridge.startCmdProcess(cmdBytes, function(data) {
                mdSmart.DB_P03.showStatus(data);
            });
        });
		// 快净
        $('#fastClean').bind('tap', {}, function(e) {
            if (mdSmart.common.isOperationLock() == true) { return false; }
                                      
            if (mdSmart.DB_P03.isBh == true){
                mdSmart.DB_P03.showAlert(mdSmart.i18n.cancelBh); // 请取消童锁
                return;
            }
                                      
            var bi = $('#fastClean').css('background-image');
            var cmdBytes;
                                      
            if (bi.search('_b') == -1) {
                cmdBytes = mdSmart.DB_P03.message.setFastClean(1);
                $('#fastClean').css('background-image', 'url(images/icon_ctl_19_b.png)');
                $('#fastClean span').css('color', '#fff');
            } else {
                cmdBytes = mdSmart.DB_P03.message.setFastClean(0);
                $('#fastClean').css('background-image', 'url(images/icon_ctl_19.png)');
                $('#fastClean span').css('color', '#7e8793');
            }
            bridge.startCmdProcess(cmdBytes, function(data) {
                mdSmart.DB_P03.showStatus(data);
            });
        });

		// 特渍洗
		$('#stainsWash').bind('tap', {},  mdSmart.DB_P03.openStainsSeletor);

        /* 启动 */
        $('#start').bind('tap', { v : 1 }, mdSmart.DB_P03.setStartPause);
                
        /* 暂停 */
        $('#pause').bind('tap', { v : 0 }, mdSmart.DB_P03.setStartPause);
                   
        /* 错误消息提示 */
        $('#errYes').bind('tap', {}, function(e) {
            if (mdSmart.common.isOperationLock() == true) { return false; }
            $('#ErrDlg').popup("close");
        });
		$('#errYesP04').bind('tap', {}, function(e) {
            if (mdSmart.common.isOperationLock() == true) { return false; }
            $('#ErrDlgP04').popup("close");
        });
		$('#errYesP09').bind('tap', {}, function(e) {
            if (mdSmart.common.isOperationLock() == true) { return false; }
            $('#ErrDlgP09').popup("close");
        });
    });

	// 特渍洗选择画面
	mdSmart.DB_P03.openStainsSeletor = function(event) {
		if(mdSmart.common.isOperationLock() == true){return false;}
		if(mdSmart.common.isPopupLock() == true){return false;}

		if (mdSmart.DB_P03.isBh == true){
			mdSmart.DB_P03.showAlert(mdSmart.i18n.cancelBh); // 请取消童锁
			return;
		}

 		// 只有待机时才能设置特渍洗
		if(status.machineStatus.value != 1)  {
			mdSmart.DB_P03.showAlert(mdSmart.i18n.CanSetStains);
			return;	
		}

		$("#StainsSetDialog").show();
		mdSmart.DB_P03.StainsSetInit($(this)); 

		var setval = status.specialStainsWash.value;
		swiperStains.swipeTo(setval, 500, false);

		//slider选中样式
		$("#DB_P03_STAINS .swiper-wrapper")[0].children[setval].classList.add("Vswiper-slide-active");
		$("#DB_P03_STAINS .swiper-wrapper")[0].children[setval].classList.remove("Vswiper-slide");
		return false;

	};
    // 特渍洗选择画面初始化
    mdSmart.DB_P03.StainsSetInit = function(nowOder) {
        //初始化
        if (swiperStains == null) {
            swiperStains = new Swiper('#DB_P03_STAINS', {
                mode : 'vertical',
                pagination : '.pagination-v',
                paginationClickable : true,
                onTouchEnd : function() {
					//数值获取方法，大致可以在里面获取相应元素的值
                    var windSpeedValue = parseInt($("#DB_P03_STAINS .swiper-wrapper .swiper-slide-active")[0].id);
					selectedType = windSpeedValue;
					if ($("#DB_P03_STAINS .swiper-wrapper .Vswiper-slide-active").length > 0) {
                        $("#DB_P03_STAINS .swiper-wrapper .Vswiper-slide-active")[0].classList.add("Vswiper-slide");
                        $("#DB_P03_STAINS .swiper-wrapper .Vswiper-slide-active")[0].classList.remove("Vswiper-slide-active");
                    }
                    $("#DB_P03_STAINS .swiper-wrapper")[0].children[windSpeedValue].classList.add("Vswiper-slide-active");
                    $("#DB_P03_STAINS .swiper-wrapper")[0].children[windSpeedValue].classList.remove("Vswiper-slide");
                }
            });
            for (var i = 0; i < 7; i++) {
                var newSlide = swiperStains.createSlide("<p>" + i + "</p>");
                newSlide.id = i;
                newSlide.append();
            }
        }

    };

    //预约时间初始化
    mdSmart.DB_P03.bespeakInit = function(nowOder) {
        //初始化时间
        if (swiperTime_H == null) {
            swiperTime_H = new Swiper('#DB_P03_TIME_H', {
                mode : 'vertical',
                pagination : '.pagination-v',
                paginationClickable : true,
                onTouchEnd : function() {
					//数值获取方法，大致可以在里面获取相应元素的值
                    var windSpeedValue = parseInt($("#DB_P03_TIME_H .swiper-wrapper .swiper-slide-active")[0].id);
					selectedHour = windSpeedValue;
					if ($("#DB_P03_TIME_H .swiper-wrapper .Vswiper-slide-active").length > 0) {
                        $("#DB_P03_TIME_H .swiper-wrapper .Vswiper-slide-active")[0].classList.add("Vswiper-slide");
                        $("#DB_P03_TIME_H .swiper-wrapper .Vswiper-slide-active")[0].classList.remove("Vswiper-slide-active");
                    }
                    $("#DB_P03_TIME_H .swiper-wrapper")[0].children[windSpeedValue].classList.add("Vswiper-slide-active");
                    $("#DB_P03_TIME_H .swiper-wrapper")[0].children[windSpeedValue].classList.remove("Vswiper-slide");
                }
            });
            for (var i = 0; i < 25; i++) {
                var newSlide = swiperTime_H.createSlide("<p>" + i + "</p>");
                newSlide.id = i;
                newSlide.append();
            }
        }

    };

    /* 错误信息提示 */
    mdSmart.DB_P03.showAlert = function(alertString){
        //$("#ErrDlg").css('text-align','left');
        $("#errStr").html(alertString);
        $("#errTel").hide();
        $("#ErrDlg").popup("open");
    };
 
    /* 创建滚轮 */
    mdSmart.DB_P03.initSwiper = function(){
        // 洗涤时间
        swiper0 = new Swiper("#swiper0", {
                      pagination : '.pagination',
                      paginationClickable : true,
                      centeredSlides : true,
                      slidesPerView : 3,
                      startSlide : 0,
                      watchActiveIndex : true,
                      onTouchEnd : function(swiper) {
                          // 运行或童锁状态
                          if (mdSmart.DB_P03.isRun == true || mdSmart.DB_P03.isBh == true) {
                              swiper0.swipeTo(mdSmart.DB_P03.selectedIndex[0],300,false);
                          }
						  // 超出范围的话重新调整
						  if(swiper0.activeIndex >= mdSmart.DB_P03.swiper0Array.length){
						  	swiper0.activeIndex = mdSmart.DB_P03.swiper0Array.length - 1;
							mdSmart.DB_P03.selectedIndex[0] = swiper0.activeIndex;
							swiper.swipeTo(swiper0.activeIndex, 300, false);
						  }	
                          mdSmart.DB_P03.message.setWashTime(mdSmart.DB_P03.swiper0Array[swiper0.activeIndex]);
                      }
        });
        // 脱水时间
        swiper2 = new Swiper("#swiper2", {
                      pagination : '.pagination',
                      paginationClickable : true,
                      centeredSlides : true,
                      slidesPerView : 3,
                      startSlide : 0,
                      watchActiveIndex : true,
                      onTouchEnd : function(swiper) {
                          // 运行或童锁状态
                          if (mdSmart.DB_P03.isRun == true || mdSmart.DB_P03.isBh == true) {
                              swiper2.swipeTo(mdSmart.DB_P03.selectedIndex[2],300,false);
                          }
						  // 超出范围的话重新调整
						  if(swiper2.activeIndex >= mdSmart.DB_P03.swiper2Array.length){
						  	swiper2.activeIndex = mdSmart.DB_P03.swiper2Array.length - 1;
							mdSmart.DB_P03.selectedIndex[0] = swiper2.activeIndex;
							swiper.swipeTo(swiper2.activeIndex, 300, false);
						  }	
						  mdSmart.DB_P03.message.setDehydrateTime(mdSmart.DB_P03.swiper2Array[swiper2.activeIndex]);
                      }
        });
        // 水位
        swiper6 = new Swiper("#swiper6", {
                      pagination : '.pagination',
                      paginationClickable : true,
                      centeredSlides : true,
                      slidesPerView : 3,
                      startSlide : 0,
                      watchActiveIndex : true,
                      onTouchEnd : function(swiper) {
                          // 运行或童锁状态
                          if (mdSmart.DB_P03.isRun == true || mdSmart.DB_P03.isBh == true) {
                              swiper6.swipeTo(mdSmart.DB_P03.selectedIndex[6],300,false);
                          }
						  // 超出范围的话重新调整
						  if(swiper6.activeIndex >= mdSmart.DB_P03.swiper6Array.length){
						  	swiper6.activeIndex = mdSmart.DB_P03.swiper6Array.length - 1;
							mdSmart.DB_P03.selectedIndex[0] = swiper6.activeIndex;
							swiper.swipeTo(swiper6.activeIndex, 300, false);
						  }	
						  mdSmart.DB_P03.message.setWaterLine(mdSmart.DB_P03.swiper6Array[swiper6.activeIndex]);
                      }
        });
        // 柔顺剂
        swiper8 = new Swiper("#swiper8", {
                      pagination : '.pagination',
                      paginationClickable : true,
                      centeredSlides : true,
                      slidesPerView : 3,
                      startSlide : 0,
                      watchActiveIndex : true,
                      onTouchEnd : function(swiper) {
                          // 运行或童锁状态
                          if (mdSmart.DB_P03.isRun == true || mdSmart.DB_P03.isBh == true) {
                              swiper8.swipeTo(mdSmart.DB_P03.selectedIndex[8],300,false);
                          }
                          // swiperBug修正（仅有2个slide时不滚动）
                          if (mdSmart.DB_P03.swiper8Array.length == 2 && swiper8.getSlide(2).html() == "<p></p>") {
                              if (swiper8.activeIndex == 2) {
                                  swiper8.swipeTo(1,300,false);
                              }
                          }
						  // 超出范围的话重新调整
						  if(swiper8.activeIndex >= mdSmart.DB_P03.swiper8Array.length){
						  	swiper8.activeIndex = mdSmart.DB_P03.swiper8Array.length - 1;
							mdSmart.DB_P03.selectedIndex[0] = swiper8.activeIndex;
							swiper.swipeTo(swiper8.activeIndex, 300, false);
						  }	
                          mdSmart.DB_P03.message.setSuppleDose(mdSmart.DB_P03.swiper8Array[swiper8.activeIndex]);
                      }
        });
        // 洗涤剂
        swiper7 = new Swiper("#swiper7", {
                      pagination : '.pagination',
                      paginationClickable : true,
                      centeredSlides : true,
                      slidesPerView : 3,
                      startSlide : 0,
                      watchActiveIndex : true,
                      onTouchEnd : function(swiper) {
                          // 运行或童锁状态
                          if (mdSmart.DB_P03.isRun == true || mdSmart.DB_P03.isBh == true) {
                              swiper7.swipeTo(mdSmart.DB_P03.selectedIndex[7],300,false);
                          }
						  // 超出范围的话重新调整
						  if(swiper7.activeIndex >= mdSmart.DB_P03.swiper7Array.length){
						  	swiper7.activeIndex = mdSmart.DB_P03.swiper7Array.length - 1;
							mdSmart.DB_P03.selectedIndex[0] = swiper7.activeIndex;
							swiper.swipeTo(swiper7.activeIndex, 300, false);
						  }	
						  mdSmart.DB_P03.message.setWashDose(mdSmart.DB_P03.swiper7Array[swiper7.activeIndex]);
                      }
        });
        // 漂洗次数
        swiper1 = new Swiper("#swiper1", {
                      pagination : '.pagination',
                      paginationClickable : true,
                      centeredSlides : true,
                      slidesPerView : 3,
                      startSlide : 0,
                      watchActiveIndex : true,
                      onTouchEnd : function(swiper) {
                          // 运行或童锁状态
                          if (mdSmart.DB_P03.isRun == true || mdSmart.DB_P03.isBh == true) {
                              swiper1.swipeTo(mdSmart.DB_P03.selectedIndex[1],300,false);
                          }
						  // 超出范围的话重新调整
						  if(swiper1.activeIndex >= mdSmart.DB_P03.swiper1Array.length){
						  	swiper1.activeIndex = mdSmart.DB_P03.swiper1Array.length - 1;
							mdSmart.DB_P03.selectedIndex[0] = swiper1.activeIndex;
							swiper.swipeTo(swiper1.activeIndex, 300, false);
						  }	
						  mdSmart.DB_P03.message.setRinseTimes(mdSmart.DB_P03.swiper1Array[swiper1.activeIndex]);
                      }
        });
        // 温度
        swiper3 = new Swiper("#swiper3", {
                      pagination : '.pagination',
                      paginationClickable : true,
                      centeredSlides : true,
                      slidesPerView : 3,
                      startSlide : 0,
                      watchActiveIndex : true,
                      onTouchEnd : function(swiper) {
                          // 运行或童锁状态
                          if (mdSmart.DB_P03.isRun == true || mdSmart.DB_P03.isBh == true) {
                              swiper3.swipeTo(mdSmart.DB_P03.selectedIndex[3],300,false);
                          }
						  // 超出范围的话重新调整
						  if(swiper3.activeIndex >= mdSmart.DB_P03.swiper3Array.length){
						  	swiper3.activeIndex = mdSmart.DB_P03.swiper3Array.length - 1;
							mdSmart.DB_P03.selectedIndex[0] = swiper3.activeIndex;
							swiper.swipeTo(swiper3.activeIndex, 300, false);
						  }	
						  mdSmart.DB_P03.message.setTemperature(mdSmart.DB_P03.swiper3Array[swiper3.activeIndex]);
                             
                          // [ADD] by yurc.---温度与洗涤时间联动问题修改。
                          // 重新设置洗涤时间滚轮。
                          if(washTimeDefaultIndex != 99){
                               mdSmart.DB_P03.setSlidData(0,washTimeDefaultIndex,washTimeDataArray[swiper3.activeIndex],vashTimeSwiperArray);
                          }
                      }
        });
        // 脱水速度
        swiper4 = new Swiper("#swiper4", {
                      pagination : '.pagination',
                      paginationClickable : true,
                      centeredSlides : true,
                      slidesPerView : 3,
                      startSlide : 0,
                      watchActiveIndex : true,
                      onTouchEnd : function(swiper) {
                          // 运行或童锁状态
                          if (mdSmart.DB_P03.isRun == true || mdSmart.DB_P03.isBh == true) {
                              swiper4.swipeTo(mdSmart.DB_P03.selectedIndex[4],300,false);
                          }
						  // 超出范围的话重新调整
						  if(swiper4.activeIndex >= mdSmart.DB_P03.swiper4Array.length){
						  	swiper4.activeIndex = mdSmart.DB_P03.swiper4Array.length - 1;
							mdSmart.DB_P03.selectedIndex[0] = swiper4.activeIndex;
							swiper.swipeTo(swiper4.activeIndex, 300, false);
						  }	
                          mdSmart.DB_P03.message.setDehydrateSpeed(mdSmart.DB_P03.swiper4Array[swiper4.activeIndex]);
                      }
        });
        // 烘干
        swiper5 = new Swiper("#swiper5", {
                      pagination : '.pagination',
                      paginationClickable : true,
                      centeredSlides : true,
                      slidesPerView : 3,
                      startSlide : 0,
                      watchActiveIndex : true,
                      onTouchEnd : function(swiper) {
                          // 运行或童锁状态
                          if (mdSmart.DB_P03.isRun == true || mdSmart.DB_P03.isBh == true) {
                              swiper5.swipeTo(mdSmart.DB_P03.selectedIndex[5],300,false);
                          }
						  // 超出范围的话重新调整
						  if(swiper5.activeIndex >= mdSmart.DB_P03.swiper5Array.length){
						  	swiper5.activeIndex = mdSmart.DB_P03.swiper5Array.length - 1;
							mdSmart.DB_P03.selectedIndex[0] = swiper5.activeIndex;
							swiper.swipeTo(swiper5.activeIndex, 300, false);
						  }	
                          mdSmart.DB_P03.message.setDringState(mdSmart.DB_P03.swiper5Array[swiper5.activeIndex]);
                      }
        });
    };

    /* cycle点击触发函数，在此根据配置文件显示相应的参数滚轮，并根据配置文件给相应的滚轮赋值 */
    mdSmart.DB_P03.setCycleProgram = function(e) {
        if (mdSmart.common.isOperationLock() == true) { return false; }
		// 其他地方都是上面这种做法，当初为啥这里会使用下面这行呢？有语法错误啊
        //if (mdSmart.common.isOperationLock() == true) { mdSmart.common.isOperationLock() = false; }
         if (mdSmart.DB_P03.isBh == true){
            if (mdSmart.DB_P03.selectedCycle != e.data.v){
                // 请取消童锁
                mdSmart.DB_P03.showAlert(mdSmart.i18n.cancelBh);
                return;
            }
        }
        // 错误状态下和预约执行中，不允许点击程序按钮，不提示。
        if(status.machineStatus.value == 5 || status.machineStatus.value == 6){
            return;
        }

		// 在运行状态，暂停状态，童锁状态下，程序都不能操作
        if (mdSmart.DB_P03.isRun == true){
            if (mdSmart.DB_P03.selectedCycle != e.data.v){
                // 程序运行中
                mdSmart.DB_P03.showAlert(mdSmart.i18n.isRun);
                return;
            }
        }

        if (mdSmart.DB_P03.isSuspended == true){
            // 程序运行中
            if (mdSmart.DB_P03.selectedCycle != e.data.v){
                mdSmart.DB_P03.showAlert(mdSmart.i18n.isSuspended);
                return;
            }
        }

		mdSmart.DB_P03.selectInfo(e.data.m);
 
 
        // 向洗衣机发送切换cycle程序的命令
        // [ADD] by yurc.-------验证cycle程序命令发送参数。
		if (mdSmart.DB_P03.selectedCycle == e.data.v){
			// 点击的Cycle是当前Cycle的时候，发送查询指令
			var cmdBytes = mdSmart.DB_P03.message.queryDeviceParameter();
			bridge.startCmdProcess(cmdBytes, function(data) {
				mdSmart.DB_P03.showStatus(data);
			});
		} else {
			mdSmartios.bridge.logToIOS("cycle程序命令发送参数LOG：");
			var cmdBytes = mdSmart.DB_P03.message.setCycleProgram(e.data.v);
			bridge.startCmdProcess(cmdBytes, function(data) {
				mdSmart.DB_P03.showStatus(data);
			});
		}
    };
	
	mdSmart.DB_P03.selectInfo=function (v){
		 // 控制页面的头部显示
        // [DEL] by yurc.
        //$('.text_3').html(mdSmart.i18n['setting']);
        $('.wrapper1').hide();
        $('#paramAdjust').show();
 
        // 每次点击cycle程序，9个滚轮都先隐藏
        for (var m = 0;m < 9;m++){
            var str2 ='#swiper' + m +'s';
            $(str2).hide();
        }
	
		 // 解析程序设置配置文件
         var jsonStr = JSON.parse(mdSmart.DB_P03.PARAMETER_JSON);
         var paramData = jsonStr.paramData;
         mdSmartios.bridge.logToIOS("程序设置配置文件paramData：" + paramData);
 
         for (var i = 0;i < paramData.length;i++) {
             // 点选的cycle程序
             if (paramData[i].modeName == v) {
                 var indexI = paramData[i];
                 // 每个cycle程序所对应的参数数组
                 var valueArray = indexI.paramArray;
 
                 for (var j = 0;j < valueArray.length;j++){
                     // 每个参数项目所对应的参数数组
                     var indexJ = valueArray[j];
                     // 每一个参数所对应的默认索引
                     var defaultIndex = indexJ.defaultIndex;
                     // 每一个参数所对应的显示数据
                     var dataArray = indexJ.paramArray;
                     // 每一个参数多对应的协议数据
                     var swiperArray = indexJ.paramProtocolArray;
 
                     if (indexJ.tag != 0 && indexJ.tag != 10){
                        var str1 = '.mask_title' + (indexJ.tag - 1) + '>span';
                        var str2 ='#swiper' + (indexJ.tag - 1) + 's';
 
                        $(str1).html(indexJ.paramName);
                        $(str2).show();
 
                        //[UPD] by yurc.---温度与洗涤时间联动问题修改。
                        //mdSmart.DB_P03.setSlidData((indexJ.tag - 1),defaultIndex,dataArray,swiperArray);
                        if(indexJ.tag == 1){
                            washTimeDefaultIndex = defaultIndex;
                            washTimeDataArray = dataArray;
                            vashTimeSwiperArray = swiperArray;
                        }else{
                            mdSmart.DB_P03.setSlidData((indexJ.tag - 1),defaultIndex,dataArray,swiperArray);
                            if(indexJ.tag == 4 && washTimeDefaultIndex != 99){
                                mdSmart.DB_P03.setSlidData(0,washTimeDefaultIndex,washTimeDataArray[defaultIndex],vashTimeSwiperArray);
                            }
                        }
                     }
                 }
                 break;
             }
         }
 
		 // 加载滚动
        paramScrollArea();
 
        // 程序设置页显示
        mdSmart.DB_P03.adjustParam = "parm";
	};
 
    /* Swiper的Bug补丁 */
    mdSmart.DB_P03.swiperBug = function(swiper,dataArrayNum){
        // Swiper的Bug补丁:只有一个数据的时不显示，只有两个数据时候不滚动
        if(dataArrayNum == 1 || dataArrayNum == 2){
            var newSlide = swiper.createSlide("<p>"+("")+"</p>");
            swiper.appendSlide(newSlide);
        }
    };
 
    /* 为滚轮添加数据 */
    mdSmart.DB_P03.setSwiperData = function(swiper,defaultIndex,dataArray){
 
        if (swiper.slides.length != 0) {
            swiper.reInit();
            swiper.swipeTo(0,0);
            swiper.removeAllSlides();
        }

        for (var n = 0; n < dataArray.length; n++) {
 
            if (dataArray[n] == 0) {
                var newSlide = swiper.createSlide("0");
                swiper.appendSlide(newSlide);
            } else {
                var newSlide = swiper.createSlide(dataArray[n]);
                swiper.appendSlide(newSlide);
            }
        }
        // 移动到默认索引
        swiper.swipeTo(defaultIndex, 300, false);
        // Swiper的Bug补丁
        mdSmart.DB_P03.swiperBug(swiper,dataArray.length);
    };
 
    /* 为滚轮赋值 */
    mdSmart.DB_P03.setSlidData = function(tag,defaultIndex,dataArray,swiperArray) {
        switch(tag){
            case 0: {// 洗涤时间
                mdSmart.DB_P03.setSwiperData(swiper0,defaultIndex,dataArray);
                mdSmart.DB_P03.swiper0Array = swiperArray;// 滚轮的协议数据(洗涤时间)
            }
            break;
            case 1: {// 漂洗次数
                mdSmart.DB_P03.setSwiperData(swiper1,defaultIndex,dataArray);
                mdSmart.DB_P03.swiper1Array = swiperArray;// 滚轮的协议数据(漂洗次数)
            }
            break;
            case 2: {// 脱水时间
                mdSmart.DB_P03.setSwiperData(swiper2,defaultIndex,dataArray);
                mdSmart.DB_P03.swiper2Array = swiperArray;// 滚轮的协议数据(脱水时间)
            }
            break;
            case 3: {// 温度
                mdSmart.DB_P03.setSwiperData(swiper3,defaultIndex,dataArray);
                mdSmart.DB_P03.swiper3Array = swiperArray;// 滚轮的协议数据(温度)
            }
            break;
            case 4: {// 脱水速度
                mdSmart.DB_P03.setSwiperData(swiper4,defaultIndex,dataArray);
                mdSmart.DB_P03.swiper4Array = swiperArray;// 滚轮的协议数据(脱水速度)
            }
            break;
            case 5: {// 烘干
                mdSmart.DB_P03.setSwiperData(swiper5,defaultIndex,dataArray);
                mdSmart.DB_P03.swiper5Array = swiperArray;// 滚轮的协议数据(烘干)
            }
            break;
            case 6: {// 水位
                mdSmart.DB_P03.setSwiperData(swiper6,defaultIndex,dataArray);
                mdSmart.DB_P03.swiper6Array = swiperArray;// 滚轮的协议数据(水位)
            }
            break;
            case 7: {// 洗涤剂
                mdSmart.DB_P03.setSwiperData(swiper7,defaultIndex,dataArray);
                mdSmart.DB_P03.swiper7Array = swiperArray;// 滚轮的协议数据(洗涤剂)
            }
            break;
            case 8: {// 柔顺剂
                mdSmart.DB_P03.setSwiperData(swiper8,defaultIndex,dataArray);
                mdSmart.DB_P03.swiper8Array = swiperArray;// 滚轮的协议数据(柔顺剂)
            }
            break;
        }
    };
 
    /* 启动暂停按钮点击触发函数 */
    mdSmart.DB_P03.setStartPause = function(e) {
    var pa = e.data.v;
    window.setTimeout(function() {
        if (mdSmart.DB_P03.isBh == true){
            // 请取消童锁
            mdSmart.DB_P03.showAlert(mdSmart.i18n.cancelBh);
            return;
        }
 
        // 启动、暂停命令发送
        var cmdBytes = mdSmart.DB_P03.message.setStartPause(pa);
 
        // [ADD] by yurc.-------验证启动、暂停命令发送参数。
        mdSmartios.bridge.logToIOS("启动、暂停命令发送参数LOG：");
        bridge.startCmdProcess(cmdBytes, function(data) {
            mdSmart.DB_P03.showStatus(data);
        });
        }, 50);
    };
 
    /* 根据洗衣机反馈回来的数据、设置选中值 */
    mdSmart.DB_P03.setSlidNewData = function(status){
        /* [DEL] by yurc.---温度与洗涤时间联动问题修改。
        // 洗涤时间
        var washTimeInt = parseInt(status.washTime.value);
 
        for(var i = 0;i < mdSmart.DB_P03.swiper0Array.length;i++) {
 
            var washTimeValue = mdSmart.DB_P03.swiper0Array[i];
 
            if(washTimeInt == washTimeValue) {
                mdSmart.DB_P03.selectedIndex[0] = i;
                swiper0.swipeTo(i,300,false);
            }
        }*/
 
        // 漂洗次数
        var rinseTimesInt = parseInt(status.rinseTimes.value);
 
        for(var i = 0;i < mdSmart.DB_P03.swiper1Array.length;i++) {
 
            var rinseTimesValue =mdSmart.DB_P03.swiper1Array[i];
 
            if(rinseTimesInt == rinseTimesValue) {
                mdSmart.DB_P03.selectedIndex[1] = i;
                swiper1.swipeTo(i,300,false);
                break;
            }
        }
 
        // 脱水时间
        var dehydrateTimeInt = parseInt(status.dehydrateTime.value);
 
        for(var i=0;i<mdSmart.DB_P03.swiper2Array.length;i++) {
 
            var dehydrateTimeValue = mdSmart.DB_P03.swiper2Array[i];
 
            if(dehydrateTimeValue == dehydrateTimeInt) {
                mdSmart.DB_P03.selectedIndex[2] = i;
                swiper2.swipeTo(i, 300, false);
                 break;
            }
        }

        // 温度
        var temperatureInt = parseInt(status.temperature.value);
 
        for(var i=0;i<mdSmart.DB_P03.swiper3Array.length;i++) {
 
            var temperatureValue = mdSmart.DB_P03.swiper3Array[i];
 
            if(temperatureInt == temperatureValue) {
                mdSmart.DB_P03.selectedIndex[3] = i;
                swiper3.swipeTo(i,300,false);
 
                // [ADD] by yurc.---温度与洗涤时间联动问题修改。
                if(washTimeDefaultIndex != 99){
                    // 重新设置洗涤时间滚轮。
                    //mdSmart.DB_P03.setSlidData(0,washTimeDefaultIndex,washTimeDataArray[i],vashTimeSwiperArray);
                    // 根据回复的洗涤时间值移动洗涤时间滚轮的默认值。
                    var washTimeInt = parseInt(status.washTime.value);
                    for(var j = 0;j < mdSmart.DB_P03.swiper0Array.length;j++) {
                        var washTimeValue = mdSmart.DB_P03.swiper0Array[j];
                        if(washTimeInt == washTimeValue) {
                            mdSmart.DB_P03.selectedIndex[0] = j;
                            //swiper0.swipeTo(j,300,false);
 mdSmart.DB_P03.setSlidData(0,j,washTimeDataArray[i],vashTimeSwiperArray);
                            break;
                        }
                    }
                }
            }
        }
 
        // 脱水速度
        var dehydrateSpeedInt = parseInt(status.dehydrateSpeed.value);
 
        for(var i=0;i<mdSmart.DB_P03.swiper4Array.length;i++) {
 
            var dehydrateSpeedValue = mdSmart.DB_P03.swiper4Array[i];
 
            if(dehydrateSpeedInt == dehydrateSpeedValue) {
                mdSmart.DB_P03.selectedIndex[4] = i;
                swiper4.swipeTo(i,300,false);
                 break;
            }
        }
 
        // 烘干
        var dringStateInt = parseInt(status.dringState.value);
 
        for(var i=0;i<mdSmart.DB_P03.swiper5Array.length;i++) {
 
            var dringStateValue = mdSmart.DB_P03.swiper5Array[i];
 
            if(dringStateInt == dringStateValue) {
                mdSmart.DB_P03.selectedIndex[5] = i;
                swiper5.swipeTo(i,300,false);
                 break;
            }
        }
 
        // 水位
        var waterLineInt = parseInt(status.waterLine.value);
 
        for(var i=0;i<mdSmart.DB_P03.swiper6Array.length;i++) {
 
            var waterLineValue = mdSmart.DB_P03.swiper6Array[i];
 
            if(waterLineInt == waterLineValue) {
                mdSmart.DB_P03.selectedIndex[6] = i;
                swiper6.swipeTo(i,300,false);
                 break;
            }
        }
 
        // 洗涤剂
        var washDoseInt = parseInt(status.washDose.value);
 
        for(var i=0;i<mdSmart.DB_P03.swiper7Array.length;i++) {
 
            var washDoseValue = mdSmart.DB_P03.swiper7Array[i];
 
            if(washDoseInt == washDoseValue) {
                mdSmart.DB_P03.selectedIndex[7] = i;
                swiper7.swipeTo(i,300,false);
                 break;
            }
        }
 
        // 柔顺剂
        var suppleDoseInt = parseInt(status.suppleDose.value);
 
        for(var i=0;i<mdSmart.DB_P03.swiper8Array.length;i++) {
 
            var suppleDoseValue = mdSmart.DB_P03.swiper8Array[i];
 
            if(suppleDoseInt == suppleDoseValue) {
                mdSmart.DB_P03.selectedIndex[8] = i;
                swiper8.swipeTo(i,300,false);
                 break;
            }
        }
    };
 
    /* 根据洗衣反馈回来的数据，对cycle程序进行图片的替换（选中和不选中） */
    mdSmart.DB_P03.showCycleBtn = function(cycleValue,status){
 
        var jsonStr = JSON.parse(mdSmart.DB_P03.MODE_JSON);
        var modeDataVaule = jsonStr.modeData;
 
        for(var i=0;i<modeDataVaule.length;i++) {
 
            var modeValue = modeDataVaule[i].value;
            var cycleProgram = '#cycleProgram' + modeValue;
            var cycleProgramSpan ='#cycleProgram' + modeValue + ' span';
            var blue_ring = '#blue_ring' + modeValue;
 
            if (cycleValue == modeValue){
                var imageName = 'url(images/m_btn_cycle_' + modeValue+'_b.png)';
                $(cycleProgram).css('background-image', imageName);
                $(cycleProgramSpan).css('color', '#fff');
 
                // 运行和暂停状态下动画
                if ((mdSmart.DB_P03.isRun == true) || (status.machineStatus.value == 6)){
                    $(blue_ring).show();
					if(!$(blue_ring).hasClass("parent"))
					{
						$(blue_ring).addClass("parent");
					}
                } else {
                    $(blue_ring).show();
					if($(blue_ring).hasClass("parent"))
					{
 						$(blue_ring).removeClass("parent");
					}
                }
                $(blue_ring).bind('tap', { v : modeDataVaule[i].value, m : modeDataVaule[i].modeName }, mdSmart.DB_P03.setCycleProgram);
            } else {
                var imageName = 'url(images/m_btn_cycle_' + modeValue+'.png)';
 
                $(cycleProgram).css('background-image', imageName);
                $(cycleProgramSpan).css('color', '#7e8793');
                $(blue_ring).hide();
            }
        }
    };
 
    /* 根据洗衣机返回数据的被选中的cycle程序来显示对应的附加功能 */
    mdSmart.DB_P03.showAdditional = function(modeName){
 
        var jsonStr = JSON.parse(mdSmart.DB_P03.PARAMETER_JSON);
        var paramData = jsonStr.paramData;
 
        for(var i=0;i<paramData.length;i++){
 
            if (modeName == paramData[i].modeName) {
                mdSmartios.bridge.logToIOS("modeName: " + modeName);
 
               var valueArray = paramData[i].paramArray;
 
               for(var j=0;j<valueArray.length;j++){
                   var indexj = valueArray[j];
                   var paramTag = indexj.tag;
 
                   if(paramTag == 10){
                       // 配置文件中“附加功能”的Tag值为10
                       var trueNum = 0;
                       var additionalArray = indexj.paramArray;
 
                       for(var n = 0;n < additionalArray.length;n++){
                           var additionalName = '#additional'+n;
                           $(additionalName).hide();
 
                            if(additionalArray[n] == true){
                                $(additionalName).show();
                                trueNum++;
                            }
                        }
                        if(trueNum != 0){ $('.block_b').css('width','25%'); }
                        mdSmartios.bridge.logToIOS("trueNum:-----------" + trueNum);
                        if(trueNum <= 4){
                            mdSmartios.bridge.logToIOS("附加功能小于4个:-----------");
                            $("#footer_scroller").removeClass("footer_scroller");
                            $("#footer_scroller").addClass("footer_scroller1");

                        }else{
                            $("#footer_scroller").removeClass("footer_scroller1");
                            $("#footer_scroller").addClass("footer_scroller");
                        }
                   }
               }
            }
        }
    };

 	// 打开预约设置画面
	mdSmart.DB_P03.openTimingPage = function(event) {
		if(mdSmart.common.isOperationLock() == true){return false;}
		if(mdSmart.common.isPopupLock() == true){return false;}

		if (mdSmart.DB_P03.isBh == true){
			mdSmart.DB_P03.showAlert(mdSmart.i18n.cancelBh); // 请取消童锁
			return;
		}

		// 只有待机或预约暂停时才能修改预约
		if(!((status.machineStatus.value == 1) || ((status.machineStatus.value == 3) && (status.makeAppointment.value == 1)))) {
			mdSmart.DB_P03.showAlert(mdSmart.i18n.CantMakeAppointment);
			return;	
		}
		$("#bookingSetDialog").show();
		mdSmart.DB_P03.bespeakInit($(this));

		var setval = 0;
		if(status.makeAppointment.value == 1){// 预约执行中，使用预约剩余时间作为默认值
			var total = (status.reservationHM.value << 8) | status.reservationLM.value;
			setval = Math.ceil(total / 60);
			//if(total % 60 != 0){// 分钟不为0则向上取整
			//	setval += 1;
			//}
			swiperTime_H.swipeTo(setval, 500, false);//移动到value位置
		}else{
			swiperTime_H.swipeTo(setval, 500, false);//移动到0位置
		}
        selectedHour = setval;
		//slider小时选中样式
		$("#DB_P03_TIME_H .swiper-wrapper")[0].children[setval].classList.add("Vswiper-slide-active");
		$("#DB_P03_TIME_H .swiper-wrapper")[0].children[setval].classList.remove("Vswiper-slide");
		return false;
    };

	/*****信息帮助(水电量统计) Add by lxz-----start*****/
	//水量转换成纵坐标
	mdSmart.DB_P03.trans = function(degree,maxVal){
		var showDgr=125;
		if(maxVal!=0){
			// （最高值－当前值）* (高度/最高值) ＋ 偏移量
			showDgr=(maxVal-degree)*(100/maxVal)+25;
		}
		return showDgr;
	}
	
	//获取用电最高/低数据
	mdSmart.DB_P03.getArrayOfAmountPercent = function(maxArr, dateArr){
		//结果集
		var reArr = new Array();
		var maxNum = 0;//最大值
		var minNum = 0;//最小值
		var totalNum = 0;//总量
		var maxNumName = '';//最大值对应名称
		var minNumName = '';//最小值对应名称
 
		var d = new Date();//获取今日时间
 		var resultType = $('#selected_model').val();
		var cycleCount = 0;//循环次数(由日月周决定)
		if(resultType==0){//日
 			cycleCount = d.getHours()+1;
		}else if(resultType==1){//周
 			cycleCount = d.getDay()+1;
		}else if(resultType==2){//月
 			cycleCount = d.getDate();
		}else{//年
 			cycleCount = d.getMonth()+1;
		}
 
		for(var i=0;i<cycleCount;i++){
			if(i==0){//初始化
 				maxNum = parseInt(maxArr[i]);
				maxNumName = dateArr[i];
				minNum = parseInt(maxArr[i]);
				minNumName = dateArr[i];
			}else{
				if(maxNum <= parseInt(maxArr[i])){
					maxNum = parseInt(maxArr[i]);
					maxNumName = dateArr[i];
				}
				if(minNum >= parseInt(maxArr[i])){
					minNum = parseInt(maxArr[i]);
					minNumName = dateArr[i];
				}
			}
 
			totalNum += parseInt(maxArr[i]);
		}

 		reArr[0]=maxNum;
		reArr[1]=minNum;
		reArr[2]=totalNum;
		reArr[3]=maxNumName;
 		reArr[4]=minNumName;
		return reArr;
	}
	
	//获取水/电量的最大值
	mdSmart.DB_P03.getMaxAmountValue = function(maxArr){
		var maxNum = 0;//最大值
		var d = new Date();//获取今日时间
 		var resultType = $('#selected_model').val();
		var cycleCount = 0;//循环次数(由日月周决定)
		if(resultType==0){//日
 			cycleCount = d.getHours()+1;
		}else if(resultType==1){//周
 			cycleCount = d.getDay()+1;
		}else if(resultType==2){//月
 			cycleCount = d.getDate();
		}else{//年
 			cycleCount = d.getMonth()+1;
		}
 
		for(var i=0;i<cycleCount;i++){
 			if(maxNum <= parseInt(maxArr[i])){
				maxNum = parseInt(maxArr[i]);
			}
		}
		return maxNum;
	}

	//简单版绘制水量图表
	mdSmart.DB_P03.drawChart = function(canvasId, maxArr, dateArr,expendType){
		var canvas = document.getElementById(canvasId);
		var c = canvas.getContext("2d");
		c.beginPath();//清空canvas中的属性
		c.clearRect(0,0,1800,1800);//清空画布
		var sitey = 148;//折线（时间的y轴位置和线的颜色范围）和圆形日期y轴位置
		//画坐标统计图
		var maxVal = mdSmart.DB_P03.getMaxAmountValue(maxArr);
		mdSmart.DB_P03.drawChartXY(c,maxArr, dateArr,sitey,expendType,maxVal);
 
		//画出最高最低用时Cycle
		if(expendType=='2'){//电
			var canvas1 = document.getElementById("canvas_circle_elec_top");
			var c1 = canvas1.getContext("2d");
			c1.beginPath();//清空canvas中的属性
			c1.clearRect(0,0,180,180);//清空画布
	 
			var canvas2 = document.getElementById("canvas_circle_elec_low");
			var c2 = canvas2.getContext("2d");
			c2.beginPath();//清空canvas中的属性
			c2.clearRect(0,0,180,180);//清空画布
 
			//画圆形数量图
 			var arrCount = mdSmart.DB_P03.getArrayOfAmountPercent(maxArr, dateArr);
			mdSmart.DB_P03.drawChartCycle(c1,60,70,arrCount,'3');//最高用电时间
			mdSmart.DB_P03.drawChartCycle(c2,60,70,arrCount,'4');//最低用电时间
		}
	}

	//画坐标统计图
	mdSmart.DB_P03.drawChartXY = function(c,maxArr, dateArr,sitey,expendType,maxVal){
		var datalen = maxArr.length;
		var pi2 = Math.PI * 2;
		c.font ="12px Times New Roman";

		//绘制文字
		c.fillStyle = "#ffffff";//白色
		c.textAlign = "center";

		//add init sitex
		var sitex = 20;//折线图整体的x轴基准位置
		var basex = ($("#canvas_circle").width()-2*sitex)/datalen;//点间距基准量

		for(var i=0; i< datalen; i++){
			//在画布上写日期文本
			c.fillText(dateArr[i], sitex + basex * i, sitey );//(text,x,y,maxWidth)
		}

		c.lineWidth = 2;//线宽
		//绘制水量
		var g =c.createLinearGradient(sitex, 250, sitex, sitey);//(x0,y0,x1,y1)
		g.addColorStop(0,"#95e6cd");//绿色线
		//设置绘制颜色效果
		c.strokeStyle = g;
		//将画笔移动到坐标
		c.moveTo(sitex, mdSmart.DB_P03.trans(maxArr[0],maxVal));
 
		for(var i=0; i< datalen; i++){
			//从画笔坐标开始画直线
			c.lineTo(sitex + basex * i, mdSmart.DB_P03.trans(maxArr[i],maxVal));
		}

		//执行绘制(带边框)
		c.stroke();
		//属性设置
		c.fillStyle = "#fff";//白色
		//开始一条路径
		c.beginPath();
		for(var i=0; i< datalen; i++){
			c.moveTo(sitex + basex * i, mdSmart.DB_P03.trans(maxArr[i],maxVal));
			//创建圆形
			c.arc(sitex + basex * i, mdSmart.DB_P03.trans(maxArr[i],maxVal), 3, 0, pi2);//(x,y,r,sAngle,eAngle,counterclockwise)
			if(expendType==1){//用水量
				var showStr = 0;
				if(maxArr[i]!=0){
 					showStr =(parseInt(maxArr[i])/10).toFixed(1);
				}
 				c.fillText(showStr , sitex + basex * i, mdSmart.DB_P03.trans(maxArr[i],maxVal) - 10 );
			}else{//用电量
 				c.fillText(Math.round(parseInt(maxArr[i]) /10) / 100, sitex + basex * i, mdSmart.DB_P03.trans(maxArr[i],maxVal) - 10 );
			}
		}
		c.fill();
	}

	//画圆形数量图
	mdSmart.DB_P03.drawChartCycle = function(c,sitex,sitey,arrCount,pageFLag){
		var maxNum = arrCount[0];//最大值
		var minNum = arrCount[1];//最小值
		var totalNum = arrCount[2];//总量
		var maxNumName = arrCount[3];//最大值对应名称
		var minNumName = arrCount[4];//最小值对应名称
 
		//pageFlag:用水(弃用)：1；用电(弃用)：2；最多电：3；最少电：4；
		//画出灰色圆形
		c.moveTo(sitex, sitey);
		c.beginPath();
		var redius = 50;
		if(pageFLag=='1'){
			c.strokeStyle = "#3f4856";//gray
			redius = 45;
		}else if(pageFLag=='2'){
			c.strokeStyle = "#ffffff";//white
			redius = 45;
		}else if(pageFLag=='3'){
			c.strokeStyle = "gray";
			redius = 50;
		}else{
			c.strokeStyle = "gray";
			redius = 50;
		}
		c.arc(sitex, sitey, redius, 0, 2*Math.PI, true);
		c.lineWidth = 1.0;
		c.stroke();
 
		//画出绿色圆形(值)
		c.beginPath();
		//假定500为总量，50为圆的半径
		var percentCount = 0;
		if(pageFLag=='1'){
			c.strokeStyle = "#11d2b5";//blue
			redius = 45;
		}else if(pageFLag=='2'){
			c.strokeStyle = "#11d2b5";//blue
			redius = 45;
		}else if(pageFLag=='3'){
			c.strokeStyle = "red";
			redius = 50;
			if(totalNum!=0){
				percentCount = maxNum/totalNum;
			}
		}else{
			c.strokeStyle = "green";
			redius = 50;
			if(totalNum!=0){
				percentCount = minNum/totalNum;
			}
		}
		c.arc(sitex, sitey, redius, 1.5*Math.PI, (1.5+percentCount*2)*Math.PI, false);
		c.lineWidth = 5.0;
		c.stroke();
 
 		var resultType = $('#selected_model').val();
		var prefixChar = '';//前缀（占XX比）
		var suffixChar = '';//后缀(日)
		if(resultType==0){//日
 			prefixChar = '占今日';
			suffixChar = '点';
		}else if(resultType==1){//周
 			prefixChar = '占本周';
			suffixChar = '';
		}else if(resultType==2){//月
 			prefixChar = '占本月';
			suffixChar = '';
		}else{//年
 			prefixChar = '占今年';
			suffixChar = '';
		}
 
		//显示圆形中的文字(21点等)
		c.beginPath();
		c.moveTo(sitex, sitey);
		c.font ="24px Times New Roman";
		var showTimeChar = '';//点等汉字
		if(pageFLag=='1' || pageFLag=='2'){
			c.fillStyle = "#ffffff";//白色
		}else if(pageFLag=='3'){
			c.fillStyle = "red";
			c.font ="18px Times New Roman";
			showTimeChar = maxNumName+suffixChar;
		}else{
			c.fillStyle = "green";
			c.font ="18px Times New Roman";
			showTimeChar = minNumName+suffixChar;
		}
		c.fillText(showTimeChar, sitex-12, sitey-5);
		c.fill();
 
		//显示圆形中的文字(占今日%)
		if(pageFLag=='3' || pageFLag=='4'){
			c.beginPath();
			c.moveTo(sitex, sitey);
			c.font ="14px Times New Roman";
			c.fillStyle = "#c2ced3";//灰色
			var percentVal = 0;
			if(pageFLag=='3'){
				if(totalNum!=0){
 					percentVal=Math.round(maxNum/totalNum*100);
				}
 				c.fillText(prefixChar+percentVal+"%", sitex-30, sitey+15);
			}else{
				if(totalNum!=0){
 					percentVal=Math.round(minNum/totalNum*100);
				}
 				c.fillText(prefixChar+percentVal+"%", sitex-30, sitey+10);
			}
			c.fill();
		}
	}

	//Json转换为Array
	mdSmart.DB_P03.getArrayFromJson = function(data,destStr){
		var arr = new Array();
		for(var i in data) {
			if(destStr=='time'){
				var d = new Date(data[i].time);
				if($('#selected_model').val()==0){
					var str = d.getHours();
					arr.push(str);
				}else if($('#selected_model').val()==1){
					var str = "周" + "日一二三四五六".charAt(d.getDay());//星期几
					arr.push(str);
				}else if($('#selected_model').val()==2){
					var str = d.getDate()+"日";//几日
					arr.push(str);
				}else{
					var str = (d.getMonth()+1)+"月";
					arr.push(str);
				}
			}else if(destStr=='amount'){
				arr.push(data[i].amount==''?0:data[i].amount);
			}
		}
		return arr;
	}

	//移除非选中tab(日周月年)的选中状态
	mdSmart.DB_P03.removeEleActive = function(idName){
		var expendType = '';
		if($('#pageTitle').html()=='用水统计'){
 			expendType = '1';
		}else{
			expendType = '2';
		}
		switch(idName){
		case 'DB_P09_DAY':
			if($('#DB_P09_WEEK').hasClass('order_2_active')){
				$('#DB_P09_WEEK').removeClass('order_2_active');
			}
			if($('#DB_P09_MONTH').hasClass('order_2_active')){
				$('#DB_P09_MONTH').removeClass('order_2_active');
			}
			if($('#DB_P09_YEAR').hasClass('order_3_active')){
				$('#DB_P09_YEAR').removeClass('order_3_active');
			}
			$('#selected_model').val('0');//设置选中tab页的标志位
			mdSmart.DB_P03.initDB_P09Data(expendType);//重新加载图表
			break;
		case 'DB_P09_WEEK':
			if($('#DB_P09_DAY').hasClass('order_1_active')){
				$('#DB_P09_DAY').removeClass('order_1_active');
			}
			if($('#DB_P09_MONTH').hasClass('order_2_active')){
				$('#DB_P09_MONTH').removeClass('order_2_active');
			}
			if($('#DB_P09_YEAR').hasClass('order_3_active')){
				$('#DB_P09_YEAR').removeClass('order_3_active');
			}
			$('#selected_model').val('1');//设置选中tab页的标志位
			mdSmart.DB_P03.initDB_P09Data(expendType);//重新加载图表
			break;
		case 'DB_P09_MONTH':
			if($('#DB_P09_DAY').hasClass('order_1_active')){
				$('#DB_P09_DAY').removeClass('order_1_active');
			}
			if($('#DB_P09_WEEK').hasClass('order_2_active')){
				$('#DB_P09_WEEK').removeClass('order_2_active');
			}
			if($('#DB_P09_YEAR').hasClass('order_3_active')){
				$('#DB_P09_YEAR').removeClass('order_3_active');
			}
			$('#selected_model').val('2');//设置选中tab页的标志位
			mdSmart.DB_P03.initDB_P09Data(expendType);//重新加载图表
			break;
		case 'DB_P09_YEAR':
			if($('#DB_P09_DAY').hasClass('order_1_active')){
				$('#DB_P09_DAY').removeClass('order_1_active');
			}
			if($('#DB_P09_WEEK').hasClass('order_2_active')){
				$('#DB_P09_WEEK').removeClass('order_2_active');
			}
			if($('#DB_P09_MONTH').hasClass('order_2_active')){
				$('#DB_P09_MONTH').removeClass('order_2_active');
			}
			$('#selected_model').val('3');//设置选中tab页的标志位
			mdSmart.DB_P03.initDB_P09Data(expendType);//重新加载图表
			break;
		}
	}

 	//十进制转十六进制
 	mdSmart.DB_P03.toHex=function(num){
		var rs = "";
		var temp;
		while(num/16 > 0){
			temp = num%16;
			rs = (temp+"").replace("10","a").replace("11","b").replace("12","c").replace("13","d").replace("14","e").replace("15","f") + rs;
			num = parseInt(num/16);
		}
		return rs;
	}
	
	//非P03div提示框
	mdSmart.DB_P03.showAlertOutP03=function(suffixDiv,conts) {
		$("#ErrDlg"+suffixDiv).css('text-align','left');
		$("#errTitle"+suffixDiv).html(mdSmart.i18n['masterTip']);
		$("#errStr"+suffixDiv).html(conts);
		$("#ErrDlg"+suffixDiv).popup("open");
	}
 
 	mdSmart.DB_P03.initDB_P09Data = function(expendType) {
		$("#show_wait").show();//显示等待标志
		var applianceId = bridge.getCurrentApplianceID();
 		var appId16 = mdSmart.DB_P03.toHex(parseInt(applianceId))+"";
		if(appId16.substr(0,2).toUpperCase()=="FF"){
			var timer2S = window.setTimeout(mdSmart.DB_P03.showAlertOutP03("P09",mdSmart.i18n.linkError1), 0);
			return;
		}
		var resultType = $('#selected_model').val();
		var d = new Date();
		var mm = d.getMonth()+1;//月份
		var dd = d.getDate();//日期
		var time = d.getFullYear()+""+(mm>9?mm:"0"+mm)+(dd>9?dd:"0"+dd);
		//获取JSON
		var data = "handleType=GetWasherCost&applianceId=" + applianceId + "&resultType=" + resultType + "&expendType=" + expendType + "&time=" + time;
		//"serviceurl":"/v1/base2pro/data/transmit",
		var functionParamers = {
		queryStrings:{ "handleType":"GetWasherCost", "applianceId":applianceId, "resultType":resultType,"expendType":expendType,"time":time},
		transmitData: {"data":data}};
		mdSmartios.bridge.requestDataTransmit(functionParamers,
			function(data){
				if(data.errorCode!=0){//访问服务器失败等异常提示
					$("#show_wait").hide();//隐藏等待标志
					var timer2S = window.setTimeout(mdSmart.DB_P03.showAlertOutP03("P09",data.msg), 0);
					return;
				}
				mdSmartios.bridge.logToIOS("send data success:" + data);
				var jsonStr = data.result.returnData.result;
				var maxArr = mdSmart.DB_P03.getArrayFromJson(jsonStr,'amount');
				var dateArr = mdSmart.DB_P03.getArrayFromJson(jsonStr,'time');
				var weekday = "星期" + "日一二三四五六".charAt(d.getDay());//星期几
				$("#p_today").html(mm+"月"+dd+"日   "+weekday);//今日日期
				
				//根据显示数据的数量,调整画布宽度
				if(maxArr.length>24){//月
					document.getElementById("canvas_circle").style.width="1200px";//显示宽度
					document.getElementById("canvas_circle").width="1200";//绘图宽度
				}else if(maxArr.length>12 && maxArr.length<=24){//日
					document.getElementById("canvas_circle").style.width="900px";
					document.getElementById("canvas_circle").width="900";
				}else if(maxArr.length>7 && maxArr.length<=12){//年
					document.getElementById("canvas_circle").style.width="520px";
					document.getElementById("canvas_circle").width="520";
				}else{//周
					document.getElementById("canvas_circle").style.width="350px";
					document.getElementById("canvas_circle").width="350";
				}
				document.getElementById("canvas_circle").style.height="150px";
				
				mdSmart.DB_P03.drawChart("canvas_circle", maxArr, dateArr,expendType);
				var water_today_amount = 0;//今X用(水/电)量
				//显示今日/本周/本月/今年用量
				for(var i=0;i<maxArr.length;i++){//单位时间内数据相加
					water_today_amount+=parseInt(maxArr[i]);
				}
				if(expendType==1){//水量
					var showStr = 0;
					if(water_today_amount!=0){
						showStr =(parseInt(water_today_amount)/10).toFixed(1);
					}
					water_today_amount=showStr;
					//(parseInt(water_today_amount)/10).toFixed(1)--会显示40.0
				}else{//电量
					water_today_amount=Math.round(parseInt(water_today_amount) /10) / 100;
				}
				var prefixChar = '';
				if(resultType=='0'){
					prefixChar='今日';
				} else if(resultType=='1'){
					prefixChar='本周';
				} else if(resultType=='2'){
					prefixChar='本月';
				} else{
					prefixChar='今年';
				}
				var suffixChar = '';
				var imgName = '';
				var usedUnit = '';
				if(expendType=='1'){
					suffixChar='用水';
					imgName='images/water_today.png';
					usedUnit='升';
				} else{
					suffixChar='用电';
					imgName='images/electric_today.png';
					usedUnit='度';
				}
				$('#show_today_name').html(prefixChar+suffixChar);
				$('#icon_today_show').attr('src',imgName);
				$('#font_water_today').html(water_today_amount);//用量
				$('#usedUnit').html(usedUnit);//单位：度/升
				
				$("#div_canvas_circle").scrollLeft(0);
				$("#show_wait").hide();//隐藏等待标志
			},
			function(datafail){
				mdSmartios.bridge.logToIOS("send data failedda:" + datafail);
				$("#div_canvas_circle").scrollLeft(0);
				$("#show_wait").hide();//隐藏等待标志
				var timer2S = window.setTimeout(mdSmart.DB_P03.showAlertOutP03("P09",mdSmart.i18n.linkError2), 0);
			}
		);
	}
	/*****信息帮助(水电量统计) Add by lxz-----end*****/

    /* 页面显示 */
    mdSmart.DB_P03.showStatus = function(dataBack) {
		var msgLen = dataBack.length - 11;
		status = mdSmart.DB_P03.message.parseMessageForView(dataBack).status;
		var applianceCode = mdSmart.DB_P03.message.getApplianceCode();
        mdSmartios.bridge.logToIOS("mdSmart.DB_P03.showStatus 开始:Code=" + applianceCode);
        // [ADD] by yurc
        if((mdSmart.DB_P03.MODE_JSON == "") || (mdSmart.DB_P03.MODE_JSON == "(null)")){
            mdSmartios.bridge.logToIOS("机器码:" + applianceCode);
            mdSmart.DB_P03.MODE_TXT = mdSmart.DB_P03.MODE_TXT_PATH + applianceCode;
            mdSmart.DB_P03.PARAMETER_TXT = mdSmart.DB_P03.PARAMETER_TXT_PATH + applianceCode;
 
            // 配置文件加载
            var param = {"fileName":mdSmart.DB_P03.MODE_TXT};
            // 程序选择
            bridge.getConfigInfo(param,function(message){
                mdSmart.DB_P03.MODE_JSON = message;
            });
            var param = {"fileName":mdSmart.DB_P03.PARAMETER_TXT};
            // 参数设置
            bridge.getConfigInfo(param,function(message){
                mdSmart.DB_P03.PARAMETER_JSON = message;
            });
        }
 
        // 如果配置文件不存在，提示更新。
        mdSmartios.bridge.logToIOS("MODE_JSON:" + mdSmart.DB_P03.MODE_JSON);
        if (mdSmart.DB_P03.MODE_JSON == "(null)" || mdSmart.DB_P03.MODE_JSON == "" || mdSmart.DB_P03.PARAMETER_JSON == "(null)" || mdSmart.DB_P03.PARAMETER_JSON == ""){
 			mdSmartios.bridge.logToIOS("没获取到配置数据：ModeJson " + mdSmart.DB_P03.MODE_JSON);
 			mdSmartios.bridge.logToIOS("没获取到配置数据：ParamJson " + mdSmart.DB_P03.PARAMETER_JSON);
			mdSmart.DB_P03.showAlert(mdSmart.i18n.configNonexist);
            return;
        }
 
        // 解析程序设置配置文件、显示cycle程序
        var jsonStr1 = JSON.parse(mdSmart.DB_P03.MODE_JSON);
        var modeDataVaule1 = jsonStr1.modeData;
		var selectedMode; // 记录选中的mode
		var selectedCycle = parseInt(status.cycleProgram.value);
        for(var i=0;i < modeDataVaule1.length;i++) {
            mdSmartios.bridge.logToIOS("cycle程序:" + modeDataVaule1[i]);
            var indexI = modeDataVaule1[i];
			if(indexI.value == selectedCycle){
 				selectedMode = indexI;
			}
            var cycle = '#cycleProgram' + indexI.value;
            var yellowIcon = '#yellow' + indexI.value;
 
            $(cycle + '>span').html(indexI.modeName);
            $(cycle + '>span').css('color', '#7e8793');
 
            if(indexI.isNew){
                $(yellowIcon).show();
            }
 
            $(yellowIcon).bind('tap', { v : indexI.value, m : indexI.modeName }, mdSmart.DB_P03.setCycleProgram);
            $(cycle).bind('tap', { v : indexI.value, m : indexI.modeName }, mdSmart.DB_P03.setCycleProgram);
            $('#i' + indexI.value).show();
        }
        // 设置页面滚动
        cycleScrollArea();

		var timeStr;
		var timeValue;
		if((status.makeAppointment.value == 1) && (status.machineStatus.value == 6)) {// 预约执行中的话，使用预约设定时间，否则使用工作剩余时间
			timeValue = parseInt(status.reservationHM.value) << 8 | parseInt(status.reservationLM.value);
			timeStr = timeValue;
		} else {
			timeStr = status.remainderTime.value;
			timeValue = parseInt(status.remainderTime.value);
		}
        // 显示剩余时间、如果时间>59则显示xx:xx；
        if (timeValue > 59){
            var htime = parseInt(timeValue/60);
            var mtime = timeValue % 60;
 
            if(timeValue / 60 < 10) {
                htime = '0'+ htime;
            }
            if(timeValue % 60 < 10) {
                mtime = '0'+ mtime;
            }
            timeStr = htime + ':' + mtime;
            $('.minute_2').css('left', '188px');
            $('.text_2').css('left', '188px');
            $('.text_3').css('left', '188px');
            $('.time_2').css('font-size', '1.270em');
            $("#timeType").html(mdSmart.i18n['hour']);
        } else {
            $('.minute_2').css('left', '108px');
            $('.text_2').css('left', '108px');
            $('.text_3').css('left', '108px');
            $('.time_2').css('font-size', '1.370em');
            $("#timeType").html(mdSmart.i18n['minute']);
        }
 
        // 控制页头部显示
        // [ADD] by yurc.洗衣结束时，剩余时间要显示0分钟。
        if(status.machineStatus.value == 4)
        {
            timeStr = "0";
        }
        $('.time_2').html(timeStr);
		// 应该从配置文件中获取程序名来显示
        //$('.text_2').html(mdSmart.i18n['cycleProgram' + status.cycleProgram.value]);
 		$('.text_2').html(selectedMode.modeName);

		// 只有运行状态和预约执行中可以上锁，但任何情况下都能解锁
        mdSmart.DB_P03.isBh = parseInt(status.childLock.value) == 1 ? true : false;
		if((mdSmart.DB_P03.isBh == false && (status.machineStatus.value == 2 || status.machineStatus.value == 6)) || (mdSmart.DB_P03.isBh == true)) {
 			mdSmart.DB_P03.isStandby = true;
		} else {
 			mdSmart.DB_P03.isStandby = false;
		}
 
        // 程序运行状态
        if (status.machineStatus.value == 2){
            mdSmart.DB_P03.isRun = true;
        } else {
            mdSmart.DB_P03.isRun = false;
        }
 
        // 程序暂停状态
        if (status.machineStatus.value == 3) {
            mdSmart.DB_P03.isSuspended = true;
        } else {
            mdSmart.DB_P03.isSuspended = false;
        }
 
        // 启动、暂停
        if (status.machineStatus.value == 2){
			$("#pause").css("display", "block");
			$("#start").css("display", "none");
            //$('.footer_but_pause').show();
            //$('.footer_but_start').hide();
        // [ADD] by yurc.预约执行中，启动、暂停。
        }else if(status.machineStatus.value == 6){
			$("#pause").css("display", "block");
			$("#start").css("display", "none");
           // $('.footer_but_pause').show();
            //$('.footer_but_start').hide();
        } else {
			$("#start").css("display", "block");
			$("#pause").css("display", "none");
          //  $('.footer_but_start').show();
           // $('.footer_but_pause').hide();
        }
 
        // [ADD] by yurc.增加状态显示。
        // 判断状态显示（例如：待机中，漂洗中等）
        if (status.machineStatus.value == 2) {
 
            var washExpertsValue = status.washExperts.value;
 
            if (washExpertsValue == 0) {
 
                if (status.washState1.value == 1) {
                    $('.text_3').html(mdSmart.i18n['washState1']);
                }
                if (status.washState2.value == 1) {
                    $('.text_3').html(mdSmart.i18n['washState2']);
                }
                if (status.washState4.value == 1) {
                    $('.text_3').html(mdSmart.i18n['washState4']);
                }
                if (status.washState8.value == 1) {
                    $('.text_3').html(mdSmart.i18n['washState8']);
                }
                if (status.washState16.value == 1) {
                    $('.text_3').html(mdSmart.i18n['washState16']);
                }
                if (status.washState32.value == 1) {
                    $('.text_3').html(mdSmart.i18n['washState32']);
                }
                if (status.washState64.value == 1) {
                    $('.text_3').html(mdSmart.i18n['washState64']);
                }
                if (status.washState128.value == 1) {
                    $('.text_3').html(mdSmart.i18n['washState128']);
                }
            } else {
                $('.text_3').html(mdSmart.i18n['washExperts' + status.washExperts.value]);
            }
        } else if (status.machineStatus.value == 1){
            // 只要机器开机且未启动，此时在程序选择页面状态显示“程序选择”，在设置页面显示“设置中”；
            if ("cycle" == mdSmart.DB_P03.adjustParam) {
                $('.text_3').html(mdSmart.i18n['programSelect']);
            }else{
                $('.text_3').html(mdSmart.i18n['setting']);
            }
        } else if (status.machineStatus.value == 3){
            // 机器从启动到暂停时，此时状态显示“暂停中”；
            $('.text_3').html(mdSmart.i18n['machineStatus0']);
        } else {
            $('.text_3').html(mdSmart.i18n['machineStatus' + status.machineStatus.value]);
        }
 
        // 显示对应的cycle程序，以及显示对应的参数及附加功能
        var cycleValue = parseInt(status.cycleProgram.value);
        var jsonStr = JSON.parse(mdSmart.DB_P03.MODE_JSON);
        var modeDataVaule = jsonStr.modeData;
 
        for (var i = 0;i < modeDataVaule.length;i++){

            if (modeDataVaule[i].value == selectedCycle){
                // 当前的cycle程序(值)
                mdSmart.DB_P03.selectedCycle = cycleValue;
                // 当前的cycle程序(名称)
                mdSmart.DB_P03.selectedCycleName = modeDataVaule[i].modeName;
                // cycle程序
                mdSmart.DB_P03.showCycleBtn(mdSmart.DB_P03.selectedCycle,status);
                // 附加功能
                mdSmart.DB_P03.showAdditional(mdSmart.DB_P03.selectedCycleName);
            }
        }

        if ("cycle" == mdSmart.DB_P03.adjustParam) {
            // 程序设置页
            $('.wrapper1').show();
            $('#paramAdjust').hide();
        } else {
            // 处于参数设置页面的场合：其它设备切换cycle程序时、程序设置页自动刷新成与之对应的clcle程序参数
            //if (cycleValue != mdSmart.DB_P03.selectedCycleParm) {
                // 当前的cycle程序(值[参数设置页])
                mdSmart.DB_P03.selectedCycleParm = cycleValue;
 
 				//alert("["+cycleValue+"]");
                //var e = {data:{v:cycleValue, m:mdSmart.i18n['cycleProgram' + cycleValue]}};
 				var jsonStr3 = JSON.parse(mdSmart.DB_P03.MODE_JSON);
 				var modeData3 = jsonStr3.modeData;
				var cycleNamel='';
				for(var i=0;i<modeData3.length;i++)
				{
 					if(modeData3[i].value==cycleValue)
					{
						cycleNamel=modeData3[i].modeName;
						break;
					}
				}
 
				mdSmart.DB_P03.selectInfo(cycleNamel);
            //}
            // 参数设置页
           window.setTimeout(function() {
               mdSmart.DB_P03.setSlidNewData(status);
            }, 500);
        }
        // 记忆
        switch(parseInt(status.memory.value)) {
            case 1:
                $('.type_0').show();
                $('#memory').css('background-image', 'url(images/icon_ctl_1_b.png)');
                $('#memory span').css('color', '#fff');
                break;
            case 0:
                $('.type_0').hide();
                $('#memory').css('background-image', 'url(images/icon_ctl_1.png)');
                $('#memory span').css('color', '#7e8793');
                break;
        }
        // 童锁
        switch(parseInt(status.childLock.value)) {
            case 1:
                $('.type_3').show();
                mdSmart.DB_P03.isBh = true;
                $('#childLock').css('background-image', 'url(images/icon_ctl_2_b.png)');
                $('#childLock span').css('color', '#fff');
                break;
            case 0:
                $('.type_3').hide();
                mdSmart.DB_P03.isBh = false;
                $('#childLock').css('background-image', 'url(images/icon_ctl_2.png)');
                $('#childLock span').css('color', '#7e8793');
                break;
        }
        // 静音（夜间洗）
        switch(parseInt(status.washAtNight.value)) {
            case 1:
                $('.type_4').show();
                $('#mute').css('background-image', 'url(images/icon_ctl_6_b.png)');
                $('#mute span').css('color', '#fff');
                break;
            case 0:
                $('.type_4').hide();
                $('#mute').css('background-image', 'url(images/icon_ctl_6.png)');
                $('#mute span').css('color', '#7e8793');
                break;
        }
        // 筒灯
        switch(parseInt(status.downlight.value)) {
            case 1:
                $('.type_5').show();
                $('#downlight').css('background-image', 'url(images/lamp_b.png)');
                $('#downlight span').css('color', '#fff');
                break;
            case 0:
                $('.type_5').hide();
                $('#downlight').css('background-image', 'url(images/lamp.png)');
                $('#downlight span').css('color', '#7e8793');
                break;
        }
        // 雾态洗
        switch(parseInt(status.fogState.value)) {
            case 1:
                $('#fogWash').css('background-image', 'url(images/icon_ctl_11_b.png)');
                $('#fogWash span').css('color', '#fff');
                break;
            case 0:
                $('#fogWash').css('background-image', 'url(images/icon_ctl_11.png)');
                $('#fogWash span').css('color', '#7e8793');
                break;
        }
        // 轻松熨
        switch(parseInt(status.easyIroning.value)) {
            case 1:
				$('.type_7').show();
                $('#easyIroning').css('background-image', 'url(images/icon_ctl_7_b.png)');
                $('#easyIroning span').css('color', '#fff');
                break;
            case 0:
				$('.type_7').hide();
                $('#easyIroning').css('background-image', 'url(images/icon_ctl_7.png)');
                $('#easyIroning span').css('color', '#7e8793');
                break;
        }

		// 加速洗（小天鹅机器）
        switch(parseInt(status.speedUp.value)) {
            case 1:
				if(applianceCode!=""&&applianceCode!=null&&applianceCode.substr(0,1)=="l"){
					$('.type_8').show();
				}
				$('#speedWash').css('background-image', 'url(images/icon_ctl_13_b.png)');
				$('#speedWash span').css('color', '#fff');
				break;

            case 0:
				$('.type_8').hide();
				$('#speedWash').css('background-image', 'url(images/icon_ctl_13.png)');
                $('#speedWash span').css('color', '#7e8793');
                break;
        }
		
         // 预约
        switch(parseInt(status.makeAppointment.value)) {
            case 1:
				$('.type_6').show();
                $('#appointment').css('background-image', 'url(images/icon_ctl_4_b.png)');
                $('#appointment span').css('color', '#fff');
                break;
            case 0:
				$('.type_6').hide();
                $('#appointment').css('background-image', 'url(images/icon_ctl_4.png)');
                $('#appointment span').css('color', '#7e8793');
                break;
        }
 
		// 新旧版本协议兼容性处理
		if((msgLen > 25) && (status.messageTypeCode.value != 5))
		{
			// 预洗
			switch(parseInt(status.preWash.value)) {
				case 1:
					$('.type_10').show();
					$('#preWash').css('background-image', 'url(images/icon_ctl_14_b.png)');
					$('#preWash span').css('color', '#fff');
					break;
				case 0:
					$('.type_10').hide();
					$('#preWash').css('background-image', 'url(images/icon_ctl_14.png)');
					$('#preWash span').css('color', '#7e8793');
					break;
			}
			// 超净漂洗
			switch(parseInt(status.ultraCleanRinse.value)) {
				case 1:
					$('.type_11').show();
					$('#ultraCleanRinse').css('background-image', 'url(images/icon_ctl_15_b.png)');
					$('#ultraCleanRinse span').css('color', '#fff');
					break;
				case 0:
					$('.type_11').hide();
					$('#ultraCleanRinse').css('background-image', 'url(images/icon_ctl_15.png)');
					$('#ultraCleanRinse span').css('color', '#7e8793');
					break;
			}
			// 智能漂洗
			switch(parseInt(status.smartRinse.value)) {
				case 1:
					$('.type_12').show();
					$('#smartRinse').css('background-image', 'url(images/icon_ctl_16_b.png)');
					$('#smartRinse span').css('color', '#fff');
					break;
				case 0:
					$('.type_12').hide();
					$('#smartRinse').css('background-image', 'url(images/icon_ctl_16.png)');
					$('#smartRinse span').css('color', '#7e8793');
					break;
			}
			// 强力洗
			switch(parseInt(status.strongWash.value)) {
				case 1:
					$('.type_13').show();
					$('#strongWash').css('background-image', 'url(images/icon_ctl_17_b.png)');
					$('#strongWash span').css('color', '#fff');
					break;
				case 0:
					$('.type_13').hide();
					$('#strongWash').css('background-image', 'url(images/icon_ctl_17.png)');
					$('#strongWash span').css('color', '#7e8793');
					break;
			}
			// 蒸汽洗
			switch(parseInt(status.streamWash.value)) {
				case 1:
					$('.type_14').show();
					$('#streamWash').css('background-image', 'url(images/icon_ctl_18_b.png)');
					$('#streamWash span').css('color', '#fff');
					break;
				case 0:
					$('.type_14').hide();
					$('#streamWash').css('background-image', 'url(images/icon_ctl_18.png)');
					$('#streamWash span').css('color', '#7e8793');
					break;
			}
			// 快净(美的机器)
			switch(parseInt(status.FastClean.value)) {
				case 1:
					if(applianceCode!=""&&applianceCode!=null&&applianceCode.substr(0,1)=="m"){
						$('.type_15').show();
					}
					$('#fastClean').css('background-image', 'url(images/icon_ctl_19_b.png)');
					$('#fastClean span').css('color', '#fff');
					break;
				case 0:
					$('.type_15').hide();
					$('#fastClean').css('background-image', 'url(images/icon_ctl_19.png)');
					$('#fastClean span').css('color', '#7e8793');
					break;
			}
			// 特渍洗
			if(parseInt(status.specialStainsWash.value) != 0) { // 设置了特渍洗
				$('.type_16').show();
				$('#stainsWash').css('background-image', 'url(images/icon_ctl_20_b.png)');
				$('#stainsWash span').css('color', '#fff');
			}else {
				$('.type_16').hide();
				$('#stainsWash').css('background-image', 'url(images/icon_ctl_20.png)');
				$('#stainsWash span').css('color', '#7e8793');
			}
		}

        // [ADD] by yurc.0x05时弹框。
        mdSmartios.bridge.logToIOS("当前消息类型值：" + status.messageTypeCode.value);
        if(status.messageTypeCode.value == 5)
        {
            var totalWater = status.totalWaterL.value | status.totalWaterH.value << 8;
            var totalPower = status.totalPowerL.value | status.totalPowerH.value << 8;
            var promptStr = "";
			var washEndMsg ="";

            if((parseInt(status.totalWaterL.value) == 0 && parseInt(status.totalWaterH.value) == 0) || (parseInt(status.totalWaterL.value) == 255 && parseInt(status.totalWaterH.value) == 255)){
 
            }else{
                washEndMsg = mdSmart.i18n['washEnd'] + mdSmart.i18n['washWtrStr'] + (parseInt(totalWater)/10).toFixed(1) + "升";
            }
            if((parseInt(status.totalPowerL.value) == 0 && parseInt(status.totalPowerH.value) == 0) || (parseInt(status.totalPowerL.value) == 255 && parseInt(status.totalPowerH.value) == 255)){
 
            }else{
				if(washEndMsg != "") {
					washEndMsg = washEndMsg + "," + mdSmart.i18n['washPwrStr'] + Math.round(parseInt(totalPower) /10) / 100 + "度";
				} else {
					washEndMsg = mdSmart.i18n['washEnd'] + mdSmart.i18n['washPwrStr'] + Math.round(parseInt(totalPower) /10) / 100 + "度";
				}
            }
			mdSmartios.bridge.logToIOS("wanghc washEndMsg: " + washEndMsg);
			if(washEndMsg != "") {
				washEndMsg = washEndMsg + "!";				
			}

			if((parseInt(status.selfClean.value) == 1) || (washEndMsg != "")) {
				if(parseInt(status.selfClean.value) == 1){ 
					promptStr = mdSmart.i18n['cleanTip'] + "<br/>";
				}

				promptStr = promptStr + washEndMsg;
				mdSmartios.bridge.logToIOS("wanghc promptStr: " + promptStr);

				var timer2S = window.setTimeout(function() {
					$("#ErrDlg").css('text-align','left');
					$("#errTitle").html(mdSmart.i18n['masterTip']);
					$("#errStr").html(promptStr);
					$("#ErrDlg").popup("open");
				}, 0);
			}
 
            return;
        }
 
        /* 错误提示 */
        var errValue = parseInt(status.washErr.value);
 
        // [UPD] by yurc.只有规定的几种错误提示，其他不提示。改为不自动消失弹框，全部为点击确定按钮。
        /*if (errValue != 0) {
            var timer2S = window.setTimeout(function() {
                $("#ErrDlg").css('text-align','left');
                $("#errTitle").html(mdSmart.i18n['washErrTitle']);
                $("#errStr").html(mdSmart.i18n['washErr' + errValue]);
                $("#ErrDlg").popup("open");
            }, 2000);
        }*/
        var errContent = mdSmart.i18n['washErr' + errValue];
        if((errValue != 0) && (errContent != '') && (errContent != undefined) && (errContent != '(null)')){
            var timer2S = window.setTimeout(function() {
                $("#ErrDlg").css('text-align','left');
                $("#errTitle").html(mdSmart.i18n['washErrTitle']);
                if(String.fromCharCode(status.applianceTypeH.value) == "l"){
                    $("#errStr").html(errContent + mdSmart.i18n['washErrTelL']);
                }else{
                    $("#errStr").html(errContent + mdSmart.i18n['washErrTelM']);
                }
                $("#ErrDlg").popup("open");
            }, 0);
        }
 
        // 洗衣机上报关机
        mdSmartios.bridge.logToIOS("开关机（DB_P03）：" + status.power.value);
        if (status.power.value == 0) {
            bridge.goBack();
        }
    };
})(mdSmart);