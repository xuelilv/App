import Vue from 'vue';
import store from "../store";

var mySwiper = null;
export var Scene = Vue.component('Scene', {
    template: "#scene",
    props:{
        scene:{
            type:Number,
            required:true
        },
        bookTime:{
            type:Object,
            required:true
        },
        isLinkAir:{
            required:true
        },
        isSleepChart:{
           required:true 
        },
        airBind:{
            type:Object,
            required:true
        }
    },
    data:function(){
    	return {
            baseSceneArr:[0,5,6]
            //sceneList:['默认','空调联动','专属睡眠风']//['默认','老人','睡眠风','阅读','自定义','空调联动','专属睡眠风']
    	}
    },
    computed:{
        'swiperWidth':function(){
            return store.state.swiperWidth;
        },
        'swiperActiveIndex':function(){
            return this.initScene(this.scene);
        },
        'sceneList':function(){
            const defaultArr = [this.$t("SCENEDEFAULT"),this.$t("SCENEAIRLINK"),this.$t("SCENESLEEP")];
            var nameArr = store.state.defineSceneNameList;
            var concatArr = (nameArr.length > 0 ? defaultArr.concat(nameArr) : defaultArr);
            concatArr.push(this.$t("SCENEDEFINE"));
            console.log(concatArr);
            return concatArr;
        },
        'sceneListLen':function(){
            return this.sceneList.length;
        },
        'currDefineSceneIndex':function(){
            return store.state.defineSceneStatus.hasOwnProperty("defineId") ? 
            store.state.defineSceneIdList.indexOf(store.state.defineSceneStatus.defineId) : 
            0;
        },
        'sceneType':function(){
            return store.state.sceneType;
        },
        'status':function(){
            return store.state.statusJson;
        },
        'deviceInfo':function(){
            //FTS30-16BR 0x0004 || FS40-15DRW 0x0001 || FTS30-13HRA 0x0002
            return store.state.deviceInfo;
        },
        'isActive':function(){
            return store.state.swiperActiveType == 'scene';
        }  
    },
    ready: function() {
        console.log(this.scene,"llll");
        var lockSwiper = true;
        mySwiper = new Swiper('#sceneSwiper', {
            slidesPerView : 3,
			centeredSlides : true,
            initialSlide: this.initScene(this.scene),//this.scene
            onTouchMove:function(){
                lockSwiper = false;
            },
			onSlideChangeEnd:function(swiper){
				var index = swiper.activeIndex;

                if(index > 2 && this.sceneList.length > 4) {
                    store.actions.initCurrDefineScene(store.state.defineSceneIdList[index-3]);
                    this.$dispatch('showDelDefine',true);
                    this.$dispatch("isHandleAddDefine",false);
                }else{
                    this.$dispatch('changeDefineName',"");
                    this.$dispatch("isHandleAddDefine",true);
                    this.$dispatch('showDelDefine',false);
                }

                if(index == this.sceneList.length - 1){
                    store.actions.clearCurrDefineScene();
                    this.$dispatch('showDelDefine',false);
                }
                
                //屏蔽其他场景
                var fixIndex = index < 3 ? this.baseSceneArr[index] : 4;

                if(!lockSwiper){
                    store.actions.setSceneType(fixIndex);
                    store.actions.setSwiperType('scene');
                    
                    if(fixIndex == 4){
                        this.setDefineSceneTitle();
                        (index !== this.sceneList.length - 1) ? this.cmdDefineCustom() : this.cmdDefineDefault();
                    }else{
                        store.actions.setSceneTitle(swiper.slides[swiper.activeIndex].innerText);
                        this.clearLocDefineId();
                    }
                    
                    this.cmdScene()["cmd"+fixIndex](); 
                }

			}.bind(this)
        });
    },
    watch:{
        'status':function(newVal){
            this.updateStatus(newVal);
        },
        'sceneType':function(newVal){
            this.scrollSwiper(this.initScene(newVal));
        },
        'sceneListLen':function(newVal,oldVal){
            this.$nextTick(function(){
                mySwiper.updateSlidesSize();
                var lastDefineFn = function(){
                    this.$dispatch('changeDefineName',"");
                    this.$dispatch('showDelDefine',false);
                }.bind(this);
                var customFn = function(){
                    this.$dispatch('changeDefineName',store.state.defineSceneNameList[this.currDefineSceneIndex]);
                }.bind(this);

                if(newVal > oldVal){
                    mySwiper.slideTo(newVal-2,0,false);
                    this.$dispatch('showDelDefine',true);
                } else {
                    console.log(this.currDefineSceneIndex,"lllll00000");
                    mySwiper.slideTo(this.currDefineSceneIndex + 3,0,false);
                    if(!store.state.defineSceneStatus.hasOwnProperty("defineId"))
                        store.actions.initCurrDefineScene(store.state.defineSceneIdList[0]);
                    if(this.currDefineSceneIndex + 4 < this.sceneListLen){
                        customFn();
                    }else if(this.currDefineSceneIndex + 4 == this.sceneListLen){
                        lastDefineFn();
                    }
                    
                }

                mdSmart.FA_P03.setDefineInfo({
                    "currDefineId":store.state.defineSceneStatus.defineId,
                    "defineData":store.state.defineSceneList
                },function(res){

                });
            }.bind(this)); 
        }
    },
    events:{
        'setDefineName':function(name){
            mySwiper.slides[this.currDefineSceneIndex+3].querySelectorAll(".swiperItemTxt")[0].innerText = name;
        }
    },
    methods:{
        setScene(index,e){
            console.log(this.swiperActiveIndex,index);
            if(this.swiperActiveIndex == index){
                store.actions.setSwiperType('scene');
                console.log(index);
            }
            e.preventDefault();
        },
        initScene(index){
            console.log(this.currDefineSceneIndex,index);
            return index == 4 ? 
            (store.state.defineSceneStatus.hasOwnProperty("defineId") ? 
            (this.currDefineSceneIndex + 3) : this.sceneListLen-1) : 
            this.baseSceneArr.indexOf(index);
        },
        cmdScene(){

            var cmd0 = function(){
                mdSmart.FA_P03.cmdControlScene(0);
                this.closeAirLink(0);
                this.$dispatch('closeSleepChart',0);
                store.actions.clearCurrDefineScene();
            }.bind(this);

            var cmd1 = function(){
                mdSmart.FA_P03.cmdControlSceneAndGear(1,17)
                        .then(function(res){
                            mdSmart.FA_P03.cmdControlSceneAndShake(1,1);
                        }).catch(function(){

                        });
            };

            var cmd2 = function(){
                mdSmart.FA_P03.cmdControlScene(2);
            };

            var cmd3 = function(){
                mdSmart.FA_P03.cmdControlSceneAndGear(3,1)
                        .then(function(res){
                            mdSmart.FA_P03.cmdControlSceneAndShake(3,1);
                        }).catch(function(){

                        });
            };

            var cmd4 = function(){
                this.closeAirLink(4);
                this.$dispatch('closeSleepChart',4);
            }.bind(this);

            var cmd5 = function(){
                this.$dispatch("toAirLink");
                this.$dispatch('closeSleepChart',5);
                store.actions.clearCurrDefineScene();
            }.bind(this);

            var cmd6 = function(){
                this.closeAirLink(6);
                this.$dispatch("toSleepChart",6);
                store.actions.clearCurrDefineScene();
            }.bind(this);
            return {
                'cmd0':cmd0,
                'cmd1':cmd1,
                'cmd2':cmd2,
                'cmd3':cmd3,
                'cmd4':cmd4,
                'cmd5':cmd5,
                'cmd6':cmd6
            };
        },
        closeAirLink(scene){
            this.$dispatch("setAirLinkInfo",0,scene);           
        },
        setDefineSceneTitle(){
            var status = store.state.defineSceneStatus;
            status.hasOwnProperty("name") ? store.actions.setSceneTitle(status.name) : store.actions.setSceneTitle("自定义");       
        },
        cmdDefineCustom(){
            this.$dispatch('changeDefineName',store.state.defineSceneStatus.name);
            this.$dispatch('showDelDefine',true);
            this.$dispatch("isHandleAddDefine",false);
            var cmdDefine = function(dGear,dShake,dHour,dMin){
                mdSmart.FA_P03.cmdControlSceneAndGear(4,parseInt(dGear))
                        .then(function(res){
                            if(dShake == 0){
                                return mdSmart.FA_P03.cmdControlSceneAndCloseShake(4);
                            }else{
                                return mdSmart.FA_P03.cmdControlSceneAndShake(4,parseInt(dShake));                
                            }                            
                        })
                        .then(function(){
                            if(dHour != null && dMin != null){
                                (parseInt(dHour) == 0 && parseInt(dMin) == 0) ? 
                                mdSmart.FA_P03.cmdControlCancelTimerPowerOffAndScene(4) :
                                mdSmart.FA_P03.cmdControlSceneAndBookTime(4,parseInt(dHour),parseInt(dMin)); 
                            }
                            
                        }).catch(function(){

                        });
            };
            var statusObj = store.state.defineSceneStatus;
            cmdDefine(statusObj.gear,statusObj.shake,statusObj.hour,statusObj.min);
            mdSmart.FA_P03.setDefineInfo({
                "currDefineId":store.state.defineSceneStatus.defineId,
                "defineData":store.state.defineSceneList
            },function(res){
                
            });
        },
        cmdDefineDefault(){
            this.$dispatch('changeDefineName',"");
            this.$dispatch('showDelDefine',false);
            this.$dispatch("isHandleAddDefine",true);
            mdSmart.FA_P03.cmdControlSceneAndGear(4,17)
                    .then(function(){
                        return mdSmart.FA_P03.cmdControlSceneAndShake(4,2);
                    })
                    .then(function(){
                        mdSmart.FA_P03.cmdControlCancelTimerPowerOffAndScene(4);
                    }.bind(this))
                    .catch(function(){

                    });
            this.clearLocDefineId();
        },
        clearLocDefineId(){
            mdSmart.FA_P03.setDefineInfo({
                "currDefineId":"",
                "defineData":store.state.defineSceneList
            },function(res){
                
            });
        },
        scrollSwiper(index){
            console.log(index,"scene-----------");
            
            //this.cmdScene(scene);
            if(this.deviceInfo == 4){
                mySwiper.slideTo(index,0,false);                
            }
        },
        updateStatus(jsonStatus){
            console.log(jsonStatus.scene,"sceneType++++");
            this.scrollSwiper(this.initScene(jsonStatus.scene));
            
        }
    }
});
