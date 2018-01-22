import Vue from 'vue';
import store from "../store";
var mySwiper = null;

export var LinkAir = Vue.component('LinkAir', {
    template: "#linkAir",
    props:{
        airBind:{
            type:Object
        },
        isLink:{
            required:true 
        }
    },
    data(){
        return {
            linkAirList:[this.$t("AIRLINKOFF"),this.$t("AIRLINKON")]
        }
    },
    computed:{
        'swiperWidth':function(){
            return store.state.swiperWidth;
        },
        'swiperActiveIndex':function(){
            return this.isLink ? 1 : 0;
        },
        'isActive':function(){
            return store.state.swiperActiveType == 'linkAir';
        }
    },
    ready: function() {
        var _this = this;
        var lockSwiper = true;
        mySwiper = new Swiper('#linkAirSwiper', {
            slidesPerView : 2,
			centeredSlides : true,
            initialSlide:this.isLink ? 1 : 0,
            onTouchMove:function(){
                lockSwiper = false;
            },
			onSlideChangeEnd:function(swiper){
				var index = swiper.activeIndex;
                console.log("ll"+swiper.slides[index].innerText);
                
                if(!lockSwiper){
                    store.actions.setSwiperType('linkAir');
                    _this.$dispatch("setAirLinkInfo",index);
                }
			}.bind(this)
        });
    },
    methods:{
        setLinkAir(index,e){
            if(this.swiperActiveIndex == index){
                store.actions.setSwiperType('linkAir');
                console.log(index);
            }
            e.preventDefault();           
        }
    }
});
