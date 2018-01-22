import Vue from 'vue';
import store from "../store";

var mySwiper = null;
export var Model = Vue.component('Model', {
    template: "#model",
    props:{
        model:{
            type:Number,
            required:true
        }
    },
    data:function(){
    	return {
            normal:{'img':'./images/normalwind.png','activeImg':'./images/click_normal.png','name':this.$t('NORMAL_WIND')},
            sleep:{'img':'./images/sleepwind.png','activeImg':'./images/click_sleep.png','name':this.$t('SLEEP_WIND')},
            baby:{'img':'./images/babywind.png','activeImg':'./images/click_baby.png','name':this.$t('BABY_WIND')},
            silent:{'img':'./images/mute.png','activeImg':'./images/sel_mute.png','name':this.$t('SILENCE_WIND')},
            nature:{'img':'./images/comfort.png','activeImg':'./images/sel_comfort.png','name':this.$t('NATURE_WIND')},
            comfort:{'img':'./images/babywind.png','activeImg':'./images/click_baby.png','name':this.$t('COMFORTABLE_WIND')}
        }
    },
    computed:{
        'swiperWidth':function(){
            return store.state.swiperWidth;
        },
        'isActive':function(){
            return store.state.swiperActiveType == 'model';
        },
        'status':function(){
            return store.state.statusJson;
        },
        'deviceInfo':function(){
            //FTS30-16BR 0x0004 || FS40-15DRW 0x0001 || FTS30-13HRA 0x0002
            return store.state.deviceInfo;
        },
        'models':function(){
            var arr = [];
            arr[1] = [this.normal,this.nature,this.sleep,this.silent];
            arr[2] = [this.normal,this.nature,this.sleep,this.comfort,this.silent];
            arr[4] = [this.normal,this.sleep,this.baby];
            arr[8] = arr[1];
            return arr[this.deviceInfo];
        },
        'swiperActiveIndex':function(){
            return this.model;
        }
    },
    ready: function() {
        var lockSwiper = true;
        mySwiper = new Swiper('#modelSwiper', {
            slidesPerView : 3,
			centeredSlides : true,
            initialSlide:this.model,
            onTouchMove:function(){
                lockSwiper = false;
            },
			onSlideChangeEnd:function(swiper){
                var index = swiper.activeIndex;
                
                if(!lockSwiper){
                    store.actions.setModel(index);
                    store.actions.setSwiperType('model'); 
                    this.setModelType(index);
                }
			}.bind(this)
        });
    },
    watch:{
        'status':function(newVal){
            this.updateStatus(newVal);
        }
    },
    methods:{
    	setModel(index,e) {
    		if(this.swiperActiveIndex == index){
    			//this.isActive = this.isActive ? false : true;
               // this.isActive = true;
                store.actions.setSwiperType('model');
    			console.log(index);
    		}
    		//this.activeId = index;
    		e.preventDefault();
    	},
        setModelTo1(index){
            var arr = ["0x01","0x02","0x03","0x05"];
            return arr[index];                          
        },
        setModelTo2(index){
            return index + 1;
        },
        setModelTo4(index){
            var arr = ["0x01","0x03","0x06"];
            return arr[index];                            
        },
        setModelTo8(index){
            return this.setModelTo1(index);
        },
        setModelType(index){
            var type = null;
            var self = this;
            var cmdType = function(angle){
                mdSmart.FA_P03.cmdControlShakeAngle(angle);
            };
            type = this["setModelTo"+this.deviceInfo](index);
            mdSmart.FA_P03.cmdControlWindType(type)
                    .then(function(){
                        var shakeArrTo4 = [3,3,2];
                        //alert(shakeArrTo4[index]);
                        self.deviceInfo == 4 ?
                        cmdType(shakeArrTo4[index]) :
                        mdSmart.FA_P03.cmdControlShakeSwitchOff();
                    })
                    .catch(function(){

                    });           
        },
        updateStatus(jsonStatus){
            var model = store.state.model;
            mySwiper.slideTo(model,0,false);
        }
    }
});
