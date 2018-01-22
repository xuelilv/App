import Vue from 'vue';
import store from "../store";

var bookHour = null,
    bookMin = null;
export var BookTime = Vue.component('BookTime', {
    template: "#bookTime",
    props:{
        bookTime:{
            type:Object,
            required:true
        },
        isBookOn:{
            type:Boolean,
            required:true
        },
        isBookOff:{
            type:Boolean,
            required:true
        },
        clientWidth:{
            required:true
        }        
    },
    data: function() {
        return {
            activeId: null,
            swiperActiveIndex: 0,
            itemVal: 0,
            listMin:[0,30],
            swiperHour:null,
            swiperMin:null
        }
    },
    computed:{
        'deviceState':function(){
            return store.state.deviceState;
        },
        'swiperLeft':function(){
            return (this.clientWidth-this.swiperWidth-120)/2;
        },
        'hour':function(){
            return this.bookTime.hour;
        },
        'min':function(){
            return this.bookTime.min;
        },
        'swiperWidth':function(){
            return store.state.swiperWidth;
        },
        'sceneType':function(){
            return store.state.sceneType;
        },
        'isActive':function(){
            return store.state.swiperActiveType == 'bookTime';
        }
    },
    watch: {
        'isActive': function(newVal) {
            var self = this;
            if (newVal) {
                this.$nextTick(function() {
                    var lockHourSwiper = true;
                    self.$dispatch("disableScroll");
                    bookHour = new Swiper('#bookHourSwiper', {
                        direction: 'vertical',
                        slidesPerView: 3,
                        centeredSlides: true,
                        initialSlide:parseInt(this.hour,10),
                        onTouchMove:function(){
                            lockHourSwiper = false;
                        },
                        onSlideChangeEnd: function(swiper) {
                            var hour = parseInt(swiper.slides[swiper.activeIndex].innerText,10);
                            if(!lockHourSwiper){
                                this.listMin = (hour == 12) ? [0] : [0,30];
                            }
                        }.bind(this)
                    });
                    bookMin = new Swiper('#bookMinSwiper', {
                        direction: 'vertical',
                        slidesPerView: 3,
                        centeredSlides: true,
                        initialSlide:Math.floor(parseInt(this.min,10)/10),
                        onSlideChangeEnd: function(swiper) {
                            
                        }.bind(this)
                    });
                });
            } else {
                bookHour = null;
                bookMin = null;
                this.$nextTick(function(){
                    this.$dispatch("enableScroll");
                }.bind(this));
            }
        },
        'listMin':function(newVal){
            this.$nextTick(function(){
                bookMin.update(true);
            });
        }
    },
    events:{
        'setDefineScene':function(){
            var h = null,m = null,defaultH = null, defaultM = null;
            var status = store.state.defineSceneStatus;
            var setHM = function(hour,min){
                h = hour;
                m = min;
            };

            if(status.hasOwnProperty("hour") && status.hasOwnProperty("min")){
                defaultH = status.hour;
                defaultM = status.min;
            }

            (this.deviceState == 1 && !this.isBookOff) ? setHM(0,0) :
                ((this.swiperHour != null && this.swiperMin != null) ? 
                    setHM(this.swiperHour,this.swiperMin) : 
                    setHM(defaultH,defaultM));
            
            store.actions.setDefineScene({
                'hour':h,
                'min':m
            });
        }
    },
    filters:{
        'zero':function(val){
            if(val < 10){
                val = "0" + val;
            }
            return val;
        }
    },
    methods: {
        setTime(e) {
            //this.isActive = this.isActive ? false : true;
            store.actions.setSwiperType('bookTime');
            e.preventDefault();
        },
        cancelBook(e) {
            //this.isActive = false;
            store.actions.setSwiperType('');
            this.swiperHour = 0;
            this.swiperMin = 0;
            this.cmdCancelBook();
            e.preventDefault();
        },
        hiddenBook(e){
            store.actions.setSwiperType('');
            //e.preventDefault();
        },
        cmdCancelBook(){
            if(!this.deviceState){
                mdSmart.FA_P03.cmdControlCancelTimerPowerOn();
            }else{
                if(this.sceneType == 4){
                    mdSmart.FA_P03.cmdControlCancelTimerPowerOffAndScene(this.sceneType);            
                }else{
                    mdSmart.FA_P03.cmdControlCancelTimerPowerOff();   
                }               
            }            
        },
        cmdSetBook(){
            if(!this.deviceState){
                mdSmart.FA_P03.cmdPowerOffAndTimerPowerOnHourAndMinutesFunction(this.swiperHour,this.swiperMin);
            }else{
                if(this.sceneType == 4){
                    mdSmart.FA_P03.cmdControlSceneAndBookTime(4,this.swiperHour,this.swiperMin);         
                }else{
                    mdSmart.FA_P03.cmdPowerOnAndTimerPowerOffHourAndMinutesFunction(this.swiperHour,this.swiperMin);                    
                }
            }            
        },
        confirmBook(e){
            //this.isActive = false;
            this.swiperHour = parseInt(bookHour.slides[bookHour.activeIndex].innerText,10);
            this.swiperMin = parseInt(bookMin.slides[bookMin.activeIndex].innerText,10);
            store.actions.setSwiperType('');
            if(this.swiperHour == 0 && this.swiperMin == 0){
                this.cmdCancelBook();
            }else{
                this.cmdSetBook();
            }

            e.preventDefault(); 
        }
    }
});
