import Vue from 'vue';
import store from "../store";

export var Explain = Vue.component('Explain', {
    template: "#explain",
    route:{
        data(){
            store.actions.setShowMore(false);
        }
    }
});