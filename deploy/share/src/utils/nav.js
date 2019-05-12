import router from '../router.js'

export default {
    go: function(url){
        if(url == -1){
            if(window.history_nav == undefined){
                router.push('/');
                return;
            }
            var path = window.history_nav.pop();
            if(path == undefined){
                router.push('/');
                return;
            }else{
                router.push(path);
            }
        }else{
            if(window.history_nav == undefined){
                window.history_nav = new Array();
            }
            window.history_nav.push(router.currentRoute.path);
            router.push(url);
        }
    }
}