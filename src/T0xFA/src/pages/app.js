import Vue from 'vue';
import store from "../store";

export var App = Vue.component('App', {
    template: "#app",
    data:function(){
    	return {
    		version:1.0
    	}
    },
    computed:{
        'status':function(){
            return store.state.statusJson;
        }    	
    },
	watch:{
		'status':function(newVal){
			this.updateStatus(newVal);
		}
	},
	methods:{
		updateStatus(jsonStatus){
			this.version = jsonStatus.versionHigh+'.'+jsonStatus.versionLow;
		}
	}
});