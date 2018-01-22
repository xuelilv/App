import Vue from 'vue';
import { Model } from "./model";
import { WindSpeed } from "./windSpeed";
import { BookTime } from "./bookTime";
import { Shake } from "./shake";
import { Scene } from "./scene";
import { Temper } from "./temper";
import { LinkAir } from "./linkAir";
import {SleepOffOn} from "./sleepOffOn";
import { Air } from "./air";
import store from "../store";
import { Util} from "../util";
import {DefineChart} from "../defineChart";

var airListSwiper = null,
    sleepTimeSwiper = null,
    sleepGearSwiper = null;
var sleepChart = null;
export var Main = Vue.component('Main', {
    template: "#main",
    data: function() {
        return {
            windSpeed: 17, //风速
            inDoorTemp: 29, //室温
            shake: false, //摇头
            bookTime: { hour: "00", min: "00" }, //预约
            scene: 0, //场景
            isBookOff: false,
            isVoice: false,
            clientHeight: 0,
            clientWidth:0,
            version: 1.0,
            isBookOn: false,
            defineSceneTit: '',
            linkAirStatus: this.$t('LINKSTATE_CONNECT'),
            isSleepChart: false, //睡眠曲线
            airBind: { name: '', id: null },
            isLinkAir: false,
            isBindAir:false,
            initAirListSlide: 0,
            slidesPerView:1,
            isShowSleepChartList:false,
            sleepCurveId:null,
            initSleepTime:null,
            sleepChartArr:[],
            setSleepChartArr:[],
            scrollHeight:0,
            myScroll:null,
            isShowDel:false,
            isDefineAdd:false,
            isShowFirstAlert:false
        };
    },
    computed: {
        'sceneList':function () {
            var self = this;
            var localKey = ["DEFAULTSCENE","OLDMANSCENE","SLEEPSCENE","READSCENE"];
            var arr = localKey.map(function (val) {
                return self.$t(val);
            });
            return arr;
        },
        'model': function() {
            return store.state.model;
        },
        'deviceState': function() {
            return store.state.deviceState;
        },
        'deviceInfo': function() {
            //FTS30-16BR 0x0004 || FS40-15DRW 0x0001 || FTS30-13HRA 0x0002
            return store.state.deviceInfo;
        },
        'airList': function() {
            var list = store.state.airDeviceList;
            return list.length > 0 ? list : [];
        },
        'airCount': function() {
            return this.airList.length;
        },
        'deviceName': function() {
            return store.state.deviceName;
        },
        'isShowMore': function() {
            console.log(store.state.isShowMore,"isShowMore");
            return store.state.isShowMore;
        },
        'isShowSave':function(){
            return this.isOpen && this.scene == 4;
        },
        'isShowAirList': function() {
            return store.state.isShowAirList;
        },
        'isShowSleepChart': function() {
            return store.state.isShowSleepChart;
        },
        'deviceStateTxt': function() {
            if (this.deviceState == 0) {
                return this.$t("DEVICESTATEOFF");
            } else if (this.deviceState == 1) {
                return this.$t("DEVICESTATEON");
            }
        },
        'menuToTop': function() {
            if (this.isVoice == 1 || this.isVoice == 2) {
                return this.clientHeight - 120;
            } else {
                return this.clientHeight - 80;
            }
        },
        'airListTop': function() {
            return this.clientHeight - this.airListHeight;
        },
        'sleepChartListTop':function(){
            return this.clientHeight - 190;
        },
        'airListHeight': function() {
            return this.airListSwipeHeight + 40;
        },
        'airListSwipeHeight': function() {
            if(this.airCount <= 3 && this.airCount >0){
                this.slidesPerView = 1;
                return 50;
            }else if(this.airCount > 3){
                this.slidesPerView = 3;
                return 150;
            }
        },
        'isOpen': function() {
            return !!this.deviceState;
        },
        'sceneIcon': function() {
            return this.isOpen ? {
                'sceneIcon-default': this.scene == 0,
                'sceneIcon-oldman': this.scene == 1,
                'sceneIcon-sleep': this.scene == 2,
                'sceneIcon-read': this.scene == 3,
                'sceneIcon-define': this.scene == 4
            } :
            {
                'sceneIcon-default': true
            };
        },
        'sceneTitle': function() {
            return store.state.sceneTitle;
        },
        'isShowDoorTemp': function() {
            return this.deviceInfo == 2 || this.deviceInfo == 4;
        },
        'isShowModel': function() {
            return this.isOpen && this.scene == 0;
        },
        'isShowBookTime': function() {
            return this.scene == 4 || this.scene == 0 || !this.isOpen;
        },
        'isShowShake': function() {
            var filter = [2, 5];
            return this.isOpen && (filter.indexOf(this.scene) == -1);
        },
        'isShowWindSpeed': function() {
            var filter = [2, 5, 6];
            var filterModel = [];
            filterModel[1] = filterModel[2] = filterModel[8] = 2,filterModel[4] = 1;
            if (this.scene == 0) {
                return (this.model == 0 || (this.deviceInfo == 4 ? (this.model == filterModel[this.deviceInfo]) : false)) && this.isOpen;
            } else {
                return (filter.indexOf(this.scene) == -1) && this.isOpen;
            }
        },
        'isShowLinkAir': function() {
            return this.isOpen && this.scene == 5;
        },
        'isShowChart': function() {
            return this.isOpen && this.scene == 6;
        },
        'isShowScene': function() {
            if (this.deviceInfo !== 4) {
                return false;
            }

            if (this.scene == 0) {
                return this.model == 0 && this.isOpen;
            } else {
                return this.isOpen;
            }

        },
        'isShowTemper': function() {
            return this.isOpen && this.scene == 2;
        },
        'status': function() {
            return store.state.statusJson;
        },
        'isActiveBook': function() {
            return store.state.swiperActiveType == 'bookTime';
        },
        'isActiveModel': function() {
            return store.state.swiperActiveType == 'model';
        },
        'isActiveShake': function() {
            return store.state.swiperActiveType == 'shake';
        },
        'isActiveScene': function() {
            return store.state.swiperActiveType == 'scene';
        },
        'isActiveWindSpeed': function() {
            return store.state.swiperActiveType == 'wind';
        },
        'isActiveLinkAir': function() {
            return store.state.swiperActiveType == 'linkAir';
        },
        'isActiveSleepChart':function(){
            return store.state.swiperActiveType == 'sleepChart';    
        }
    },
    component: {
        Model,
        WindSpeed,
        BookTime,
        Shake,
        Scene,
        Temper,
        LinkAir,
        SleepOffOn,
        Air
    },
    watch: {
        'status': function(jsonStatus) {
            this.setVersion(jsonStatus.versionHigh,jsonStatus.versionLow);
            this.setVoice(jsonStatus.voice);
            this.setGear(jsonStatus.gear);
            this.setShake(jsonStatus.shakeSwitch,jsonStatus.angle);
            this.setTemperature(jsonStatus.inDoorTemp);
            this.setPownOnOff({
                'powerOnOff':jsonStatus.powerOnOff,
                'timingOffHour':jsonStatus.timingOffHour,
                'timingOffMinute':jsonStatus.timingOffMinute,
                'timingOnHour':jsonStatus.timingOnHour,
                'timingOnMinute':jsonStatus.timingOnMinute
            });
            console.log(this.scene,"scene-----++++++---------");
            if(this.scene !== 5 && this.scene !== 6){
                this.updateStatus(jsonStatus);
            }else{
                store.actions.setSceneType(this.scene);
            }
            
            this.$nextTick(function(){
                this.myScroll.refresh();
            }.bind(this));
        },
        'isShowMore':function(newVal){
            this.scrollOnOff(newVal);
        },
        'isShowFirstAlert':function(newVal){
            this.scrollOnOff(newVal);
        },
        'isShowLinkAir':function(){
            this.$nextTick(function(){
                this.myScroll.refresh();
            }.bind(this));
        },
        'scene':function(newVal){
            this.$nextTick(function(){
                this.myScroll.refresh();
            }.bind(this));
        },
        'isShowAirList': function(newVal) {
            var _this = this;
            if (newVal) {
                this.$nextTick(function() {
                    var lockSwiper = true;
                    _this.$emit("scrollToTop");
                    _this.myScroll.disable();
                    this.scrollHeight =  this.$el.scrollTop;
                    airListSwiper = new Swiper('#airListSwiper', {
                        slidesPerView: _this.slidesPerView,
                        direction: 'vertical',
                        initialSlide: _this.initAirListSlide,
                        centeredSlides: true,
                        onTouchMove:function(){
                            lockSwiper = false;
                        },
                        onSlideChangeEnd: function(swiper) {
                            var index = swiper.activeIndex;
                            var activeSlide = swiper.slides[index];

                            if(!lockSwiper){
                                _this.airBind.name = activeSlide.innerText;
                                _this.airBind.id = activeSlide.getAttribute("data-applicationId");
                            }

                            console.log("airListSwiper" + swiper.slides[index].innerText);
                        }
                    });
                });
            } else {
                airListSwiper = null;
                this.myScroll.enable();
            }
        },
        'isShowChart':function(newVal){
        	var _this = this;
        	if(newVal){
        		this.$nextTick(function() {
					var chartConfig={
						chartWidth:_this.clientWidth - 65,
						chartHeight:300,
						xAxisUnitsNum:1,//X轴标注间隔数字
						xAxisMin:1,
						xAxisMax:12,
						xAxisText:'s',//X轴标题
						yAxisText:'',//Y轴标题
						yAxisUnitsNum:2,//Y轴标注间隔数字
						yAxisMax:26,
						yAxisFontSize:15,
						opacityGride:0,
						callback:function (returnData){
							_this.initSleepSwiper(returnData);
						}

					};

                    sleepChart = new DefineChart('sleepChart',chartConfig,_this.sleepChartArr);
        		});
        	}else{
        		sleepChart = null;
                this.$nextTick(function(){
                    this.myScroll.refresh();
                }.bind(this));
        	}
        },
        'isShowSleepChartList':function(newVal){
            var _this = this;
            var initGear = this.sleepChartArr[this.initSleepTime-1] - 1;
            if(newVal){
                this.setSleepChartArr = this.sleepChartArr;

                this.$nextTick(function() {
                    var lockTimeSwiper = true,lockGearSwiper = true;
                    _this.$emit("scrollToTop");
                    _this.myScroll.disable();
                    this.scrollHeight =  this.$el.scrollTop;
                    sleepTimeSwiper = new Swiper('#sleepTimeListSwiper', {
                        slidesPerView: 3,
                        direction: 'vertical',
                        initialSlide: this.initSleepTime - 1,
                        centeredSlides: true,
                        onTouchMove:function(){
                            lockTimeSwiper = false;
                        },
                        onSlideChangeEnd: function(swiper) {
                            var index = swiper.activeIndex;
                            var activeSlide = parseInt(swiper.slides[index].innerText,10);
                            
                            if(!lockTimeSwiper && sleepGearSwiper != null){
                                sleepGearSwiper.slideTo(_this.setSleepChartArr[activeSlide - 1] - 1);
                                console.log("sleepGearSwiper");
                            }

                        }
                    });
                    try{
                        sleepGearSwiper = new Swiper('#sleepGearListSwiper', {
                            slidesPerView: 3,
                            direction: 'vertical',
                            initialSlide: initGear || 0,
                            centeredSlides: true,
                            onTouchMove:function(){
                                lockGearSwiper = false;
                            },
                            onSlideChangeEnd: function(swiper) {
                                var index = swiper.activeIndex;
                                var activeSlide = parseInt(swiper.slides[index].innerText,10);
                                var timeActiveSlide = 0;

                                $("#sleepTimeListSwiper").find(".swiper-slide").each(function(){
                                    if($(this).hasClass("swiper-slide-active")){
                                        timeActiveSlide = parseInt($(this).html());
                                    }
                                });

                                if(!lockGearSwiper){
                                    _this.setSleepChartArr.$set(timeActiveSlide - 1,activeSlide);
                                }
                            }
                        });
                    }catch(e){
                        console.log(e);
                    }
                });  
            }else{
                sleepTimeSwiper = null;
                sleepGearSwiper = null;
                this.myScroll.enable();
            }
        }
    },
    ready() {
        var self = this;
        this.clientHeight = document.body.clientHeight;
        this.clientWidth = document.body.clientWidth;

        this.myScroll = new IScroll("#scroll");
        setTimeout(function(){
            self.isShowFirstAlert = false;
        }, 3000);
    },
    events: {
        'scrollToTop':function(){
            this.myScroll.scrollToElement(document.getElementById('scroll'),0,0,0,'bounce');
        },
        'disableScroll':function(){
            this.myScroll.disable();
        },
        'enableScroll':function(){
            this.myScroll.enable();
        },
        'setAirLinkInfo': function(status,scene) {
        	//console.log(status);
            console.log("setAirLinkInfo",scene);
            if(scene != undefined){
                this.scene = scene;
            }
            
            if(status && this.deviceInfo == 4){
                mdSmart.FA_P03.cmdControlWindType(3)
                .then(function(){
                    mdSmart.FA_P03.cmdControlShakeAngle(3);
                })
                .catch(function(){

                });
            }

            mdSmart.FA_P03.setAirLinkInfo(this.airBind.id,status,function(res){
                if(res.errorCode == "0"){
                    if(!status) {
                        this.isLinkAir = !!0;
                    }
                }else{
                    this.$emit('showAlert',res.msg);
                }
            }.bind(this));
        },
        'toAirLink':function(){
        	this.scene = 5;
        },
        'toSleepChart':function(){
            this.scene = 6;
        },
        'showAlert':function(message){
            Util.showAlert("alertDia animated bounceIn", message);
        },
        'showConfirm':function(message,callbackConfirm){
            var cancelFn = function(){
                $("#DialogConfirm").hide();
            };

            Util.showConfirm(message, cancelFn, callbackConfirm);
        },
        'startSleepChart':function(){
        	var _this = this;
            mdSmart.FA_P03.startSleepChart(this.sleepCurveId,function(res){
                if(res.errorCode == "0"){
                	_this.updateSleepChart(_this.setSleepChartArr);
		        	_this.isSleepChart = !!1;
		        	
                }else{
                    _this.$emit('showAlert',res.msg);
                }
            });
        },
        'closeSleepChart':function(scene){
            console.log("closeSleepChart",scene);
            if(scene != undefined){
                this.scene = scene;
            }
        	var _this = this;

            mdSmart.FA_P03.closeSleepChart(this.sleepCurveId,function(res){
                if(res.errorCode == "0"){
		        	_this.isSleepChart = !!0;
                }else{
                    _this.$emit('showAlert',res.msg);
                }
            });
        },
        'getDefineInfo':function(res){
            var setDefine = function(res){
                store.actions.initDefineSceneList(res.result.defineData);
                store.actions.initCurrDefineScene(res.result.currDefineId);
                $("#defineSceneName").val(store.state.defineSceneStatus.name);
                this.defineSceneTit = store.state.defineSceneStatus.name;
            }.bind(this);
            res.errorCode == "0" ? 
                (res.result != null ? 
                    setDefine(res) : this.defineSceneTit = this.$t("SCENEDEFINE")) :
                "";
        },
        'changeDefineName':function(name){
            this.$nextTick(function(){
                $("#defineSceneName").val(name);
            }); 
        },
        'showDelDefine':function(isShow){
            this.isShowDel = isShow;
        },
        'delDefineToLoc':function(){
            mdSmart.FA_P03.setDefineInfo({
                "currDefineId":store.state.defineSceneStatus.defineId,
                "defineData":store.state.defineSceneList
            },function(res){
                
                if(res.errorCode == "0") {
                    this.$emit('showAlert',this.$t("DELSUCCESS"));
                }
            }.bind(this));
        },
        'isHandleAddDefine':function(isAdd){
            this.isDefineAdd = isAdd;
        }
    },
    methods: {
        scrollOnOff(newVal){
            console.log(newVal,"scrollOnOff");
            newVal ? 
            this.$nextTick(function(){
                this.$emit("scrollToTop");
                this.myScroll.disable();
            }.bind(this)) :
            this.$nextTick(function(){
                this.myScroll.enable();
            }.bind(this));
        },
        powerOnOff(e) {
            store.actions.setSwiperType(' ');

            if (this.isOpen) {
                this.scene = 0;
                mdSmart.FA_P03.cmdCtrolPowerCloseConfirm();
            } else {
                if(this.isLinkAir){
                    this.scene = 5;
                }
                if(this.isSleepChart){
                    this.scene = 6;
                }
                mdSmart.FA_P03.cmdControlPowerOnAndScene(this.scene);
            }
            e.preventDefault();
        },
        preventScroll(e){
            //this.myScroll.disable();
            //e.preventDefault();
        },
        goBack(e) {
            mdSmart.FA_P03.gotoCardPage();
            e.preventDefault();
        },
        cancelMore(e) {

            store.actions.setShowMore(false);
            e.preventDefault();
        },
        cancelFirstAlert(e){
            this.isShowFirstAlert = false;
            e.preventDefault();
        },
        cancelAirList(e) {
            store.actions.setShowAirList(false);
            e.preventDefault();
        },
        initSleepSwiper(time){
            if(time > 0){
                this.initSleepTime = time;
            }

            this.isShowSleepChartList = !!1;
        },
        cancelSleepChartList(e){
            this.isShowSleepChartList = !!0;
            e.preventDefault();
        },
        setShowMore(e) {
            store.actions.setShowMore(true);
            e.preventDefault();
        },
        openVoice(e) {
            //mdSmart.FA_P03.cmdControlDevVoice(0x01);
            mdSmart.FA_P03.cmdControlDevVoiceAndScene(0x01, this.scene);
            store.actions.setShowMore(false);
            e.preventDefault();
        },
        closeVoice(e) {
            //mdSmart.FA_P03.cmdControlDevVoice(0x0A);
            mdSmart.FA_P03.cmdControlDevVoiceAndScene(0x0A, this.scene);
            store.actions.setShowMore(false);
            e.preventDefault();
        },
        goHealth(e) {
            this.$route.router.go('/health');
        },
        saveDefineScene() {
            var defineName = $("#defineSceneName").val().replace(/\s/gi,"");
            var delDefineScene = $(".delDefineScene").length;
            var sceneItem = $("#sceneSwiper").find(".swiperItem").length;
            //自定义场景至多5个
            if(sceneItem > 8 && this.isDefineAdd && delDefineScene == 0){
                this.$emit('showAlert',this.$t("SCENECOUNTALERT"));
                return false;
            }

            if(!this.checkDefineName(defineName)){
                return false;
            }

            this.$broadcast('setDefineScene');
            var time = new Date();
            var defineId = "";
            var hasCurrDefineId = store.state.defineSceneStatus.hasOwnProperty("defineId");
            var defineData = store.state.defineSceneList;

            store.actions.setDefineScene({ 'name': defineName});
            !hasCurrDefineId ? 
            store.actions.setDefineScene({'defineId':"define"+time.getTime()}) : 
            (defineId = store.state.defineSceneStatus.defineId);
            store.actions.addOrSetDefineScene();

            mdSmart.FA_P03.setDefineInfo({"currDefineId":defineId,defineData},function(res){
                //this.$emit("getDefineInfo",res);
                if(res.errorCode == "0") {
                    this.$emit('showAlert',this.$t("SAVESUCCESS"));
                    store.actions.initCurrDefineScene(defineId);
                    if(this.isDefineAdd && delDefineScene == 0){
                        this.$emit("changeDefineName",store.state.defineSceneStatus.name);
                    }
                    
                    if((!this.isDefineAdd && delDefineScene > 0) || delDefineScene > 0){
                        this.$broadcast("setDefineName",store.state.defineSceneStatus.name);
                    }

                }
            }.bind(this));
        },
        delDefineScene(){
            store.actions.delDefineScene();
            this.$emit('delDefineToLoc');
        },
        checkDefineName(name){
            var re = /[@\/'\\"#$%&\^*]+/gi;
            var currDefineNameArr = [this.$t("SCENEDEFINE")].concat(store.state.defineSceneNameList);

            if(name == ""){
                this.$emit('showAlert',this.$t("DEFINENAME_NOT_NULL"));
                return false;
            }

            if(re.test(name)){
                this.$emit('showAlert',this.$t("DEFINENAME_NOT_INVALID"));
                return false;
            }

            if(this.isDefineAdd && currDefineNameArr.indexOf(name) > -1){
                this.$emit('showAlert',this.$t("DEFINENAME_EXIST"));
                return false;
            }

            return true;
        },
        saveBindAir(e) {
            if(this.airCount == 1){
                this.airBind.id = store.state.airDeviceList[0].applicationId;
                this.airBind.name = store.state.airDeviceList[0].name;
            }
            this.$emit("setAirLinkInfo",1);
            store.actions.setShowAirList(false);
            e.preventDefault();
        },
        saveSleepChart(e){
        	var _this = this;
            console.log(this.setSleepChartArr,"this.setSleepChartArr");
            mdSmart.FA_P03.setSleepChart(this.sleepCurveId,this.setSleepChartArr,function(res){
                _this.getSleepChartData(res);
                _this.isShowSleepChartList = !!0;
            });
            e.preventDefault();
        },
        getSleepChartData(res){
           //console.log(JSON.stringify(res));
            if(res.errorCode == "0"){
                var returnData = res.result.returnData;
                var sleepCurve = returnData.sleepCurve[0];
                var status = sleepCurve.status;
                if(status == 1){
                    this.isSleepChart = !!0;
                }else if(status == 2){
                    this.isSleepChart = !!1;
                    this.scene = 6;
                    store.actions.setSceneType(6);
                }
             
                this.sleepCurveId = sleepCurve.id;

                for(var k in sleepCurve){
                    if(k.indexOf("value") > -1){
                        var arrIndex = k.replace(/[^0-9]/ig,"");
                        var data = parseInt(sleepCurve[k],10);
                        this.sleepChartArr.$set(arrIndex,data);
                        this.setSleepChartArr.$set(arrIndex,data);
                    }
                }
                this.updateSleepChart(this.sleepChartArr);
            }else{
                this.$emit('showAlert',res.msg);
            }
        },
        updateSleepChart(seriesDate){
        	if(sleepChart !== null){
        		sleepChart.drawPlot(seriesDate).updateChart();
        		this.sleepChartArr = seriesDate;
        	}
        },
        setScene(scene){
            var fixScene = function(){
                var arr = [0,4];
                console.log(this.isSleepChart,"isSleepChart",this.isLinkAir,"isLinkAir");
                if(this.isSleepChart){
                    this.scene = 6;
                    return false;
                }

                if(this.isLinkAir){
                    this.scene = 5;
                    return false;
                }

                
                if(this.scene !== 5 && this.scene !== 6){
                    if(arr.indexOf(scene) > -1){
                        this.scene = scene;
                    }else{
                        this.scene = 0;
                    }
                }
            }.bind(this);

            if (this.deviceInfo !== 4) {
                this.scene = 0;
            } else {
                fixScene(scene);
            }

            store.actions.setSceneType(this.scene);
            if (this.scene !== 4) {
                this.isShowDel = false;
                store.actions.setSceneTitle(this.sceneList[this.scene]);
            } else {
                store.actions.setSceneTitle(this.defineSceneTit);
            }
        },
        setShake(shakeSwitch,angle){
            //设置摇头
            if (shakeSwitch == 0x01) {
                if (this.deviceInfo !== 4) {
                    this.shake = 1; //开启
                } else {
                    this.shake = parseInt(angle, 16);
                }

            } else if (shakeSwitch == 0x00 || shakeSwitch == 0x02) {
                this.shake = false;
            }
        },
        setVoice(voice){
            //语音控制
            if (voice == 0x01) {
                this.isVoice = 1;
            } else if (voice == 0x0a) {
                this.isVoice = 2;
            } else {
                this.isVoice = 0;
            }
        },
        setModel(windType){
            windType = windType > 0 ? windType : 1;
            //设置模式
            var model = 0; //风类型
            var setModelTo1 = function() {//设备类型一
                var typeArr = [1,2,3,5];
                model = typeArr.indexOf(windType);
            };
            var setModelTo2 = function() {//设备类型二
                if (windType > 0) {
                    model = windType - 1;
                } else {
                    model = 0;
                }
            };
            var setModelTo4 = function() {
                var typeArr = [1,3,6];
                model = typeArr.indexOf(windType);
            };
            var setModelTo8 = function(){
                setModelTo1();  
            };
            var typeFn = {setModelTo1,setModelTo2,setModelTo4,setModelTo8};
            typeFn["setModelTo"+this.deviceInfo]();

            console.log(model, "model");
            store.actions.setModel(model);  
        },
        setGear(gear) { //设置风速
            this.windSpeed = gear < 1 ? 1 : gear;
        },
        setTemperature(inDoorTemp) {
            this.inDoorTemp = inDoorTemp;
        },
        setPownOnOff(json){
            //设置开关机和定时
            if (json.powerOnOff == 0x01) {
                store.actions.setDeviceState(1);
                this.bookTime.hour = mdSmart.common.formatNumberByZero(json.timingOffHour, 2);
                this.bookTime.min = mdSmart.common.formatNumberByZero(json.timingOffMinute, 2);
            } else {
                store.actions.setDeviceState(0);
                this.isShowDel = false;
                this.isShowSave = false;
                this.bookTime.hour = mdSmart.common.formatNumberByZero(json.timingOnHour, 2);
                this.bookTime.min = mdSmart.common.formatNumberByZero(json.timingOnMinute, 2);
            }
        },
        setBook(json){
            
            if (json.timingOffMinute == 0x06 ||
                (json.timingOffHour == 0 &&
                    json.timingOffMinute == 0 &&
                    json.timingOffMinuteLow == 0)) {
                this.isBookOff = false;

            } else {
                this.isBookOff = true;
            }

            if (json.timingOnMinute == 0x06 ||
                (json.timingOnHour == 0 &&
                    json.timingOnMinute == 0 &&
                    json.timingOnMinuteLow == 0)) {
                this.isBookOn = false;
            } else {
                this.isBookOn = true;
            }
        },
        setVersion(versionHigh,versionLow){
            //设置版本
            this.version = versionHigh + '.' + versionLow;
        },
        setStatusOnChart(jsonStatus){
            this.setScene(jsonStatus.scene);
        },
        updateStatus(jsonStatus) {

            this.setScene(jsonStatus.scene);
            this.setModel(jsonStatus.windType);
            this.setPownOnOff({
                'powerOnOff':jsonStatus.powerOnOff,
                'timingOffHour':jsonStatus.timingOffHour,
                'timingOffMinute':jsonStatus.timingOffMinute,
                'timingOnHour':jsonStatus.timingOnHour,
                'timingOnMinute':jsonStatus.timingOnMinute
            });
            this.setBook({
              'timingOffHour':jsonStatus.timingOffHour,
              'timingOffMinute':jsonStatus.timingOffMinute,
              'timingOffMinuteLow':jsonStatus.timingOffMinuteLow,
              'timingOnHour':jsonStatus.timingOnHour,
              'timingOnMinute':jsonStatus.timingOnMinute,
              'timingOnMinuteLow':jsonStatus.timingOnMinuteLow  
            });
            console.log("scene", this.scene);

        }
    },
    route: {
        data() {
            var _this = this;

            var getAirinfo = function(){
                mdSmart.FA_P03.getAirLinkInfo(function(res) {
                    console.log(JSON.stringify(res));
                    var airList = store.state.airDeviceList;
                    if(res.errorCode == "0"){
                    	var returnData = res.result.returnData;
                        if (returnData.hasOwnProperty("result")) {
                            _this.isLinkAir = returnData.result.status;
                            //console.log(_this.isLinkAir);
                            _this.airBind.id = returnData.result.acId;

                            airList.length >0 ?
                            airList.map(function(item, index) {
                                if (item.applicationId == _this.airBind.id) {
                                    _this.isBindAir = !!1;
                                    _this.airBind.name = item.name;
                                    _this.initAirListSlide = index;
                                }
                            }) :
                            _this.isBindAir = !!0;

                            if (_this.isLinkAir) {
                                _this.scene = 5;
                                store.actions.setSceneType(5);
                            }

                        } else {
                            _this.isBindAir = !!0;
                        }
                    }else{
                        _this.$emit('showAlert',res.msg);
                    }

                });             
            };

            var getSleepChartInfo = function(){
                mdSmart.FA_P03.getSleepChart(function(res){
                    _this.getSleepChartData(res);
                });           
            };
            var iosFirstVisited = function(){
                var getLoc = window.localStorage.getItem("visited");
                var setLoc = function(){
                     _this.isShowFirstAlert = true;
                    window.localStorage.setItem("visited","true");
                };
                (getLoc !== "" && getLoc != null) ? 
                _this.isShowFirstAlert = false :
                setLoc();
            };
            
            store.actions.setShowMore(false);
            
            //首次访问提示
            mdSmart.FA_P03.isAndroid() ?
            mdSmart.FA_P03.getStorage("visited",function(){
            	_this.isShowFirstAlert = false;
            },function(){
                _this.isShowFirstAlert = true;
                mdSmart.FA_P03.setStorage("visited","true");
            }) : 
            iosFirstVisited();
                
            mdSmart.FA_P03.cmdRequestHomeApplianceInfo()
                .then(function() {
                    var localStatus = window.localStorage.getItem("FA_"+mdSmart.FA_P03.CurrentApplianceID());
                    console.log(localStatus);
                    if(localStatus != null && localStatus !== ""){
                        mdSmart.FA_P03.showStatusByJson(JSON.parse(localStatus));
                    }
                    mdSmart.FA_P03.cmdRequestStatus();
                    getSleepChartInfo();
                    getAirinfo();
                    mdSmart.FA_P03.getDefineInfo(function(res){
                        console.log(res);
                        //alert(JSON.stringify(res));
                        _this.$emit("getDefineInfo",res);
                    });
                })
                .catch(function() {

                });
        }
    }
});
