
import { API_URL } from './const.js'
import router from '../router.js';
import store from '../store'

class fetch {

    post(url, data, success, error){
        mui.ajax(`${API_URL}${url}`, {
            data: data,
            dataType: 'json',
            type: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': store.state.user.token
            },
            success: function(data){
                success(data);
            },
            error: function(xhr, type, errorThrown){
                if(xhr.status == 401){
                    router.push('/login')
                }else{
                    var data = JSON.parse(xhr.response)
                    error(data);
                }
            }
        });
    }

    get(url, data, success, error){
        mui.ajax(`${API_URL}${url}`, {
            data: data,
            dataType: 'json',
            type: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': store.state.user.token
            },
            success: function(data){
                success(data);
            },
            error: function(xhr, type, errorThrown){
                if(xhr.status == 401){
                    router.push('/login')
                }else{
                    var data = JSON.parse(xhr.response)
                    error(data);
                }
            }
        });
    }
}

export default new fetch;
