import Vue from 'vue';
import store from "../store";
var mySwiper = null;

export var Temper = Vue.component('Temper', {
    template: "#temper",
    props:{
        temper:{
            type:Number,
            required:true
        }
    },
    computed:{
        temperList:function(){
            var temp = [];
            for (var i = 20; i < 34; i++) {
                temp.push(i);
            }
            return temp;           
        },
        'swiperActiveIndex':function(){
            return this.filterSwiper(this.temper);
        },
        'swiperWidth':function(){
            return store.state.swiperWidth;
        },
        'status':function(){
            return store.state.statusJson;
        },
        'isActive':function(){
            return store.state.swiperActiveType == 'temper';
        }
    },
    ready: function() {
        var lockSwiper = true;
        mySwiper = new Swiper('#temperSwiper', {
            slidesPerView : 3,
			centeredSlides : true,
            initialSlide:this.filterSwiper(this.temper),
            onTouchMove:function(){
                lockSwiper = false;
            },
			onSlideChangeEnd:function(swiper){
				var index = swiper.activeIndex;
                
                if(!lockSwiper){
                    store.actions.setSwiperType('temper');
                }
                
                //mdSmart.FA_P03.cmdControlTemperature(swiper.slides[index].innerText);
			}.bind(this)
        });
    },
    watch:{
        'status':function(newVal){
            this.updateStatus(newVal);
        }
    },
    methods:{
    	setTemp(index,e) {
            console.log(this.isActive);
            store.actions.setSwiperType('temper');
    		// if(this.swiperActiveIndex == index){
    		// 	store.actions.setSwiperType('temper');
    		// 	console.log(index);
    		// }
    		e.preventDefault();
    	},
        filterSwiper(num){
            if(num >=20 && num <= 33){
                return num-20;
            }else{
                return 0;
            }
        },
        updateStatus(jsonStatus){
            var temper = jsonStatus.temperatureFeedback - 41;
            mySwiper.slideTo(this.filterSwiper(temper),0,false);
            
        }
    }
});
