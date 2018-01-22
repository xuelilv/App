import Vue from 'vue';
import store from "../store";
var mySwiper = null;

export var SleepOffOn = Vue.component('SleepOffOn', {
    template: "#sleepOffOn",
    props:['isSleepChart','sleepCurveId'],
    data(){
        return {
            sleepOffOnList:[this.$t("SLEEPOFF"),this.$t("SLEEPON")]
        }
    },
    computed:{
        'swiperWidth':function(){
            return store.state.swiperWidth;
        },
        'swiperActiveIndex':function(){
            return this.isSleepChart;
        },
        'isActive':function(){
            return store.state.swiperActiveType == 'sleepChart';
        }
    },
    watch:{
        'isSleepChart':function(newVal){
            mySwiper.slideTo(newVal,0,false);
        }
    },
    ready: function() {
        var _this = this;
        var lockSwiper = true;
        mySwiper = new Swiper('#sleepOffOnSwiper', {
            slidesPerView : 2,
			centeredSlides : true,
            initialSlide:this.isSleepChart,
            onTouchMove:function(){
                lockSwiper = false;
            },
			onSlideChangeEnd:function(swiper){
				var index = swiper.activeIndex;
                console.log("ll"+swiper.slides[index].innerText);
                console.log(lockSwiper,"lockSwiper");

                if(!lockSwiper){
                    store.actions.setSwiperType('sleepChart');
                    if(index == 0){
                        _this.$dispatch('closeSleepChart');
                    }else{
                        _this.$dispatch('startSleepChart');
                    } 
                }

			}.bind(this)
        });
    },
    methods:{
        setSleepOffOn(index,e){
            console.log(index,this.swiperActiveIndex);
            if(this.swiperActiveIndex == index){
                store.actions.setSwiperType('sleepChart');
                console.log(index);
            }
            e.preventDefault();           
        }
    }
});
