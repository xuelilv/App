import Vue from 'vue';
import store from "../store";

var mainDynamoPromTimeOut = null,
   shakeDynamoTimeOut = null,
   controlTimeOut = null,
   temperTimeOut = null;

export var Health = Vue.component('Health', {
    template: "#health",
    data:function(){
    	return {
            version:1.0,
    		totStatus:{
    			value:'0',
    			view:{
    				'0':{'img':"thunder",'text':this.$t('WAITING_NOTICE')},
    				'1':{'img':"Exclamation",'text':this.$t('TEMPERATURE_SENSOR_FAILURE')},
    				'2':{'img':"thunder",'text':this.$t('EQUIPMENT_NORMALLY')}
    			}
    		},
    		infoStatus:{
    			value:0,
    			view:{
    				'0':this.$t('MEDIA_HEALTH'),
    				'1':this.$t('MEDIA_UNHEALTH')
    			}
    		},
    		mainDynamo:{name:this.$t("MAIN_MOTOR"),status:'wait'},
    		shakeDynamo:{name:this.$t("SHAKE_HEAD_MOTOR"),status:'wait'},
    		control:{name:this.$t('CONTORL_PANEL'),status:'wait'},
    		temper:{name:this.$t('TEMPERATURE_SENSOR'),status:'wait'}
    	}
    },
    computed:{
    	'healthStatus':function(){
    		return this.totStatus.view[this.totStatus.value];
    	},
        'deviceName':function(){
            return store.state.deviceName;
        },
        'deviceInfo':function(){
            //FTS30-16BR 0x0004 || FS40-15DRW 0x0001 || FTS30-13HRA 0x0002
            return store.state.deviceInfo;
        },
        'isShowTemper':function(){
            if(this.deviceInfo == 1 || this.deviceInfo == 8){
                return !!0;
            }else{
                return !!1;
            }
        },
    	'alertText':function(){
    		return this.infoStatus.view[this.infoStatus.value];
    	}
    },
    ready(){
      var myScroll = new IScroll("#scroll");
    },
    methods:{
         gotoMain(e){
            this.$route.router.go("/");
            e.preventDefault();
         },
         updateStatus(jsonStatus){
           var self = this;
           var warn = jsonStatus.status.wrongAlarm.value;
           var inDoorTemp = jsonStatus.status.temperatureFeedback.value - 41;
           var versionLow = jsonStatus.status.versionLow.value,
               versionHigh = versionHigh = jsonStatus.status.versionHigh.value;
           this.version = versionHigh+'.'+versionLow;

           console.log(warn);
           var timeFn = function(fn){
               setTimeout(function(){
                    fn();
               }, 500);
           };
           var showWarn = function(){
                if(warn == 0x01 || warn == 0x02 || inDoorTemp > 50 || inDoorTemp < -41){
                    this.temper.status = 'error';
                    this.totStatus.value = 1;
                    this.infoStatus.value = 1;
                }else{
                    this.temper.status = 'yes';
                    this.totStatus.value = 2;
                    this.infoStatus.value = 0;
                }
           }.bind(this);

           var mainDynamoProm = function(){
                return new Promise(function(resolve, reject){
                    mainDynamoPromTimeOut = setTimeout(function(){
                        self.mainDynamo.status = 'yes';
                        resolve(true);
                    },500);

                });
           };
           var shakeDynamo = function(){
                return new Promise(function(resolve, reject){
                    shakeDynamoTimeOut = setTimeout(function(){
                        self.shakeDynamo.status = 'yes';
                        resolve(true);
                    }, 500);
                });
           };
           var control = function(){
                return new Promise(function(resolve, reject){
                    controlTimeOut = setTimeout(function(){
                        self.control.status = 'yes';
                        resolve(true);
                    },500);

                });
           };
           var temper = function(){
                return new Promise(function(resolve, reject){
                    temperTimeOut = setTimeout(function(){
                        self.temper.status = 'yes';
                        resolve(true);
                    }, 500);
                });
           };

           if(this.deviceInfo !== 1 && this.deviceInfo !== 8){
               timeFn(function(){
                   mainDynamoProm()
                   .then(function(){
                       return shakeDynamo();
                   })
                   .then(function(){
                        return control();
                   })
                   .then(function(){
                        return temper();
                   })
                   .then(function(){
                        timeFn(showWarn);
                   });
               });         
           }else{
               timeFn(function(){
                   mainDynamoProm()
                   .then(function(){
                       return shakeDynamo();
                   })
                   .then(function(){
                        return control();
                   })
                   .then(function(){
                        self.totStatus.value = 2;
                        self.infoStatus.value = 0; 
                   });
               }); 
           }

         }       
    },
    route:{
    	data(){
            var localStatus = window.localStorage.getItem("FA_"+mdSmart.FA_P03.CurrentApplianceID());
            clearTimeout(mainDynamoPromTimeOut);
            clearTimeout(shakeDynamoTimeOut);
            clearTimeout(controlTimeOut);
            clearTimeout(temperTimeOut);
            this.totStatus.value = 0;
            this.infoStatus.value = 0;
            this.mainDynamo.status = 'wait';
            this.shakeDynamo.status = 'wait';
            this.control.status = 'wait';
            this.temper.status = 'wait'; 
            store.actions.setShowMore(false);
            if(localStatus != null && localStatus !== ""){
                this.updateStatus(JSON.parse(localStatus));
            }          
    	}
    }
});
