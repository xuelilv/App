import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex);

// 构建状态树
const state = {
	model:0,
    shake:0,
    gear:17,
    deviceState:0,//开关机
    deviceName:"风扇",
    sceneTitle:"默认",//场景名称
    sceneType:0,
    isShowMore:false,
    isShowAirList:false,
    isShowSleepChart:false,
    swiperActiveType:'',//
    airDeviceList:[],//空调列表
    deviceInfo:4,//设备型号
    defineSceneStatus:{},//当前自定义场景信息:档位、摇头、定时、名字
    defineSceneList:[],//自定义场景列表
    defineSceneNameList:[],//自定义场景名字列表
    defineSceneIdList:[],//自定义场景ID列表
    swiperWidth:document.body.clientWidth - 180,
    statusJson:null //状态显示
}

// 初始化状态树结构
const vuex = new Vuex({
	state,
	actions,
	mutations//,
	//middlewares: [Vuex.createLogger()]
})

// 开发环境下log
// if (module.hot) {
//     module.hot.accept(['./actions', './mutations'], () => {
//         const newActions = require('./actions').default
//         const newMutations = require('./mutations').default
//         vuex.hotUpdate({
//             actions: newActions,
//             mutations: newMutations
//         })
//     })
// }
export default vuex