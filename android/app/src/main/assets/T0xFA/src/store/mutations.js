import * as types from './mutations-types';

export default {
	[types.MODEL](state,model){
		state.model = model;
	},
	[types.DEVICESTATE](state,status){
		state.deviceState = status;
	},
	[types.DEVICENAME](state,name){
		state.deviceName = name;
	},
	[types.DEVICESTATUSJSON](state,jsonStatus){
        var powerOnOff = jsonStatus.status.powerOnOff.value, //设备状态
            deviceState = 0, //设备状态
            windType = jsonStatus.status.windType.value, //风类型
            shakeSwitch = jsonStatus.status.shakeSwitch.value, //摇头开关
            angle = jsonStatus.status.angle.value, //摇头角度
            gear = parseInt(jsonStatus.status.gear.value, 10), //档位
            timingOffHour = jsonStatus.status.timingOffHour.value, //定时关（时）
            timingOffMinute = parseInt(jsonStatus.status.timingOffMinute.value * 10 + jsonStatus.status.timingOffMinuteLow.value), //定时关（分）
            timingOffMinuteLow = jsonStatus.status.timingOffMinuteLow.value,
            timingOnHour = jsonStatus.status.timingOnHour.value, //定时开（时）
            timingOnMinute = parseInt(jsonStatus.status.timingOnMinute.value * 10 + jsonStatus.status.timingOnMinuteLow.value), //定时开（分）
            timingOnMinuteLow = jsonStatus.status.timingOnMinuteLow.value,
            voice = jsonStatus.status.voice.value, //语音控制
            versionLow = jsonStatus.status.versionLow.value,
            inDoorTemp = jsonStatus.status.temperatureFeedback.value - 41,
            wrongAlarm = jsonStatus.status.wrongAlarm.value,
            versionHigh = jsonStatus.status.versionHigh.value,
            scene = parseInt(jsonStatus.status.scene.value, 16); //场景
		state.statusJson = {
			'powerOnOff':powerOnOff,
			'deviceState':deviceState,
			'windType':windType,
			'scene':scene,
			'shakeSwitch':shakeSwitch,
			'angle':angle,
			'gear':gear,
			'timingOffHour':timingOffHour,
			'timingOffMinute':timingOffMinute,
			'timingOffMinuteLow':timingOffMinuteLow,
			'timingOnHour':timingOnHour,
			'timingOnMinute':timingOnMinute,
			'timingOnMinuteLow':timingOnMinuteLow,
			'voice':voice,
			'versionLow':versionLow,
			'versionHigh':versionHigh,
			'inDoorTemp':inDoorTemp,
			'wrongAlarm':wrongAlarm
		};
	},
	[types.SCENETITLE](state,name){
		state.sceneTitle = name;
	},
	[types.SCENETYPE](state,type){
		state.sceneType = type;
	},
	[types.ISSHOWMORE](state,show){
		state.isShowMore = show;
	},
	[types.SWIPERACTIVETYPE](state,type){
		state.swiperActiveType = type;
	},
	[types.INITDEFINESCENELIST](state,list){
		state.defineSceneList = list;

		var defineSceneListLen = state.defineSceneList.length;
		if(defineSceneListLen > 0){
			for(var i=0;i<defineSceneListLen;i++){
				var stateObj = state.defineSceneList[i];
				state.defineSceneNameList.push(stateObj.name);
				state.defineSceneIdList.push(stateObj.defineId);
			}
		}
	},
	[types.INITCURRDEFINESCENE](state,defineId){
		var defineSceneListLen = state.defineSceneList.length;

		if(defineSceneListLen > 0){
			for(var i=0;i<defineSceneListLen;i++){
				var stateObj = state.defineSceneList[i];
				if(stateObj.defineId == defineId) {
					state.defineSceneStatus = stateObj;
					state.defineSceneNameList[i] = stateObj.name;
				}
			}
		}
	},
	[types.CLEARCURRDEFINESCENE](state){
		state.defineSceneStatus = {};
	},
	[types.DEFINESCENESTATUS](state,status){
		state.defineSceneStatus = Object.assign(state.defineSceneStatus,status);
	},
	[types.ADDORSETDEFINESCENE](state){
		//增加、修改自定义场景信息
		var defineSceneListLen = state.defineSceneList.length;
		var hasCurrDefineScene = false;//当前自定义场景是否在列表中
		if(defineSceneListLen > 0){
			for(var i=0;i<defineSceneListLen;i++){
				var stateObj = state.defineSceneList[i];
				if(stateObj.defineId == state.defineSceneStatus.defineId) {
					//修改自定义场景信息
					state.defineSceneList[i] = state.defineSceneStatus;
					hasCurrDefineScene = true;
				}
			}
		} 
		//增加自定义场景信息
		if(!hasCurrDefineScene){
			state.defineSceneList.push(state.defineSceneStatus);
			state.defineSceneNameList.push(state.defineSceneStatus.name);
			state.defineSceneIdList.push(state.defineSceneStatus.defineId);
		}
		
	},
	[types.DELDEFINESCENE](state){
		var defineSceneListLen = state.defineSceneList.length;
		var index = null;//数组索引值
		var nextStatus = {};
		
		if(defineSceneListLen > 0){
			for(var i=0;i<defineSceneListLen;i++){
				var stateObj = state.defineSceneList[i];
				if(stateObj.defineId == state.defineSceneStatus.defineId) {
					index = i;
					var nextVal = state.defineSceneList[i+1];
					nextStatus = nextVal ? nextVal : {};
				}
			}
		} 

		state.defineSceneList.splice(index,1);
		state.defineSceneNameList.splice(index,1);
		state.defineSceneIdList.splice(index,1);
		state.defineSceneStatus = nextStatus;
	},
	[types.DEFINEGEAR](state,gear){
		state.gear = gear;
	},
	[types.DEFINESHAKE](state,shake){
		state.shake = shake;
	},
	[types.DEVICEINFO](state,info){
		state.deviceInfo = info;
	},
	[types.ISSHOWAIRLIST](state,status){
		state.isShowAirList = status;
	},
	[types.ISSHOWSLEEPCHART](state,status){
		state.isShowSleepChart = status;
	},
	[types.AIRDEVICELIST](state,device){
		state.airDeviceList.push(device);
	}
}