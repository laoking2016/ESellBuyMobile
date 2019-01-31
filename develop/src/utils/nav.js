import router from '../router.js'

export default {
    go: function(url){
        if(url == -1){
            if(window.history_nav == undefined){
                router.replace('/');
                return;
            }
            var path = window.history_nav.pop();
            if(path == undefined){
                router.replace('/');
                return;
            }else{
                router.replace(path);
            }
        }else{
            if(window.history_nav == undefined){
                window.history_nav = new Array();
            }
            window.history_nav.push(router.currentRoute.path);
            router.replace(url);
        }
    }
}