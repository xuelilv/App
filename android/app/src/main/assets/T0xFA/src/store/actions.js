
import * as types from './mutations-types';

export default{
	setModel: types.MODEL,
	setDeviceState:types.DEVICESTATE,
	setDeviceName:types.DEVICENAME,
	setStatusJson:types.DEVICESTATUSJSON,
	setSceneTitle:types.SCENETITLE,
	setSceneType:types.SCENETYPE,
	setShowMore:types.ISSHOWMORE,
	setSwiperType:types.SWIPERACTIVETYPE,
	initDefineSceneList:types.INITDEFINESCENELIST,
	initCurrDefineScene:types.INITCURRDEFINESCENE,
	clearCurrDefineScene:types.CLEARCURRDEFINESCENE,
	setDefineScene:types.DEFINESCENESTATUS,
	addOrSetDefineScene:types.ADDORSETDEFINESCENE,
	delDefineScene:types.DELDEFINESCENE,
	setShake:types.DEFINESHAKE,
	setGear:types.DEFINEGEAR,
	setDeviceInfo: types.DEVICEINFO,
	setShowAirList: types.ISSHOWAIRLIST,
	setShowSleepChart: types.ISSHOWSLEEPCHART,
	setAirDeviceList: types.AIRDEVICELIST
}