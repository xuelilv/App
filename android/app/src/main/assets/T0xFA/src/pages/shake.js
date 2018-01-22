import Vue from 'vue';
import store from "../store";

var mySwiper = null;
export var Shake = Vue.component('Shake', {
    template: "#shake",
    props:{
        shake:{
            required:true
        }
    },
    data:function(){
    	return {
            baseList:[this.$t("SHAKEOFF"),'30°','60°','90°','120°']
    	}
    },
    computed:{
        'swiperWidth':function(){
            return store.state.swiperWidth;
        },
        'shakeList':function(){
            var shakeArr = [], typeArr = [];
            shakeArr[0] = this.filterBaseShakeArr([0,2,3,4]);
            shakeArr[1] = this.filterBaseShakeArr([0,2,3,4]);
            shakeArr[2] = this.filterBaseShakeArr([0,2,3]);
            typeArr[1] = [this.$t("SHAKEOFF"),this.$t("SHAKEON")];
            typeArr[2] = this.filterBaseShakeArr([0,1,2,3]);
            typeArr[4] = (this.sceneType == 0) ? shakeArr[this.model] : shakeArr[0];
            typeArr[8] = typeArr[1];
            return typeArr[this.deviceInfo];
        },
        'model':function(){
            return store.state.model;
        },
        'gear':function(){
            return store.state.gear;
        },
        'status':function(){
            return store.state.statusJson;
        },
        'deviceInfo':function(){
            //FTS30-16BR 0x0004 || FS40-15DRW 0x0001 || FTS30-13HRA 0x0002
            return store.state.deviceInfo;
        },
        'swiperActiveIndex':function(){
            var currArr = this.shakeList;
            return this.shake ? currArr.indexOf(this.baseList[this.shake]) : 0;
        },
        'sceneType':function(){
            return store.state.sceneType;
        },
        'isActive':function(){
            return store.state.swiperActiveType == 'shake';
        }
    },
    ready: function() {
        var lockSwiper = true;
        mySwiper = new Swiper('#windShakeSwiper', {
            slidesPerView : 3,
			centeredSlides : true,
            initialSlide:this.swiperActiveIndex,
            onTouchMove:function(){
                lockSwiper = false;
            },
			onSlideChangeEnd:function(swiper){
				var index = swiper.activeIndex;
				console.log(index);
                
                if(!lockSwiper){
                    store.actions.setSwiperType('shake');
                    this.setShakeAndScene(index);  
                }
			}.bind(this)
        });
    },
    watch:{
        'status':function(newVal){
            this.updateStatus(newVal);
        },
        'shakeList':function(newVal){
            var that = this;
            this.$nextTick(function() {
                try{
                    mySwiper.onResize();
                    mySwiper.updateSlidesSize();                   
                }catch(e){
                    console.log(e);
                }

            });
        }
    },
    events:{
        'setDefineScene':function(){
            var text = mySwiper.slides[mySwiper.activeIndex].innerText.trim();
            var index = this.baseList.indexOf(text);
            store.actions.setDefineScene({'shake':index});
        }
    },
    methods:{
    	setShake(index,e) {
            console.log(this.swiperActiveIndex,index);
    		if(this.swiperActiveIndex == index){
    			//this.isActive = this.isActive ? false : true;
                store.actions.setSwiperType('shake');
    			console.log(index);
    		}
    		e.preventDefault();
    	},
        filterBaseShakeArr(arr){
            var filter = function(val,index){
                if(arr.indexOf(index) > -1){
                    return val;
                }
            };
            return this.baseList.filter(filter);
        },
        getBaseShakeIndex(index){
            return this.baseList.indexOf(this.shakeList[index]);
        },
        getSlideIndex(shake){
            return this.shakeList.indexOf(this.baseList[shake]);
        },
        setShakeTo4(index){
            var controlShakeTem = function(){
                if(index == 0){
                    mdSmart.FA_P03.cmdControlShakeSwitchOff();
                }else{
                    mdSmart.FA_P03.cmdControlShakeAngle(this.getBaseShakeIndex(index));
                }                           
            }.bind(this);

            console.log(this.sceneType,"sceneType--------");
            if(this.sceneType == 0 || this.sceneType == 5 || this.sceneType == 6){
                controlShakeTem();  
            }else{
                if(index == 0){
                    mdSmart.FA_P03.cmdControlSceneAndCloseShake(this.sceneType);
                }else{
                    mdSmart.FA_P03.cmdControlSceneAndShake(this.sceneType,this.getBaseShakeIndex(index));                                            
                }
            } 
        },
        setShakeTo1(index){
            if(index){
                mdSmart.FA_P03.cmdControlShakeAngle(3);
            }else{
                mdSmart.FA_P03.cmdControlShakeSwitchOff();                
            }
        },
        setShakeTo2(index){
            if(!!index){
                mdSmart.FA_P03.cmdControlShakeAngle(index);                
            }else{
                mdSmart.FA_P03.cmdControlShakeSwitchOff();              
            }
        },
        setShakeTo8(index){
            this.setShakeTo1(index);
        },
        setShakeAndScene(index){
            this["setShakeTo"+this.deviceInfo](index);
        },
        swipeToSlide(angle){
            mySwiper.slideTo(angle,0,false);
            store.actions.setShake(angle);            
        },
        updateStatus(jsonStatus){
            var angle = parseInt(jsonStatus.angle),
                shakeSwitch = jsonStatus.shakeSwitch;

            if(shakeSwitch == 0x01){
                (this.deviceInfo == 1 || this.deviceInfo == 8) ? this.swipeToSlide(1) : this.swipeToSlide(this.getSlideIndex(angle));
            }else if(shakeSwitch == 0x00 || shakeSwitch == 0x02){
                this.swipeToSlide(0);
            }
            
        }
    }
});
