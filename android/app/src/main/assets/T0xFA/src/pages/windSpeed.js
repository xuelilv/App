import Vue from 'vue';
import store from "../store";
var mySwiper = null;

export var WindSpeed = Vue.component('WindSpeed', {
    template: "#windSpeed",
    props:{
        windSpeed:{
            type:Number,
            required:true
        },
        bookTime:{
            type:Object,
            required:true
        },
        model:{
            required:true
        }
    },
    computed:{
        'swiperWidth':function(){
            return store.state.swiperWidth;
        },
        'swiperActiveIndex':function(){
            return this.windSpeed - 1;
        },
        'shake':function(){
            return store.state.shake;
        },
        'status':function(){
            return store.state.statusJson;
        },
        'deviceInfo':function(){
            //FTS30-16BR 0x0004 || FS40-15DRW 0x0001 || FTS30-13HRA 0x0002
            return store.state.deviceInfo;
        },
        gearMax:function(){
            if(this.deviceInfo == 1 || this.deviceInfo == 8){
                return 12;
            }else{
                return 26;
            }
        },
        'sceneType':function(){
            return store.state.sceneType;
        },
        'isActive':function(){
            return store.state.swiperActiveType == 'wind';
        }
    },
    ready: function() {
        var lockSwiper = true;
        var self = this;
        mySwiper = new Swiper('#windSpeedSwiper', {
            slidesPerView : 3,
			centeredSlides : true,
            initialSlide:this.windSpeed-1,
            onTouchMove:function(){
                lockSwiper = false;
            },
			onSlideChangeEnd:function(swiper){
				var index = swiper.activeIndex;
                console.log("ll"+swiper.slides[index].innerText);

                if(!lockSwiper){
                    store.actions.setSwiperType('wind');
                    if(this.sceneType == 0){
                        self.fixDeviceTypeGear(swiper.slides[index].innerText);  
                    }else{
                        mdSmart.FA_P03.cmdControlSceneAndGear(this.sceneType,swiper.slides[index].innerText);              
                    }
                }
                
			}.bind(this)
        });
    },
    watch:{
        'status':function(newVal){
            this.updateStatus(newVal);
        }
    },
    events:{
        'setDefineScene':function(){
            var activeIndex = mySwiper.activeIndex;
            store.actions.setDefineScene({'gear':parseInt(mySwiper.slides[activeIndex].innerText.trim())});
        }
    },
    methods:{
    	setWind(index,e) {
            console.log(this.swiperActiveIndex == index,this.swiperActiveIndex,this.windSpeed,index);
    		if(this.swiperActiveIndex == index){
    			//this.isActive = this.isActive ? false : true;
                store.actions.setSwiperType('wind');
    			console.log(index);
    		}
            //this.itemVal = item + 1 ;
    		//this.activeId = index;
    		e.preventDefault();
    	},
        fixDeviceTypeGear(gear){ 
            mdSmart.FA_P03.cmdControlGear(gear);
        },
        updateStatus(jsonStatus){
            var gear = parseInt(jsonStatus.gear);
            console.log(gear,"gear+++++++++++");
            if(gear >= 1){
                mySwiper.slideTo(gear - 1,0,false);
                store.actions.setGear(gear - 1);
            }else{
                mySwiper.slideTo(0,0,false);
                store.actions.setGear(0);
            }
            
        }
    }
});
