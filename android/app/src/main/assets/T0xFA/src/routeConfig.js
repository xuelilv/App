import {Main} from "./pages/main";
import {Health} from "./pages/health";
import {Explain} from "./pages/explain";

export function configRouter(router) {

    router.map({
        '/': {
            component: Main
        },
        '/health':{
        	component:Health
        },
        '/explain':{
        	component:Explain
        }
    });
}
