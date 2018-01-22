import Vue from 'vue';
import store from "../store";

export var Air = Vue.component('Air', {
    template: "#air",
    props:['isAir','airs'],
    computed:{
        'swiperWidth':function(){
            return store.state.swiperWidth;
        },
        'isBindAir':function(){
            return this.isAir;
        }
    },
    methods:{
        showAirList(e){
            if(this.airs >0){
                store.actions.setShowAirList(true);               
            }else{ 
                this.$dispatch("showAlert",this.$t("NOAIRALERT"));
            }
            e.preventDefault();
        }
    }
});
