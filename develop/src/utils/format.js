import { FILE_URL } from './const.js'

export function formatImage(img){
    //return `${FILE_URL}/files/${img}`;
    return `${FILE_URL}/upload_dir/${img}`;
}

export function formatFeaturedImage(json){
    var images = JSON.parse(json);
    var image = null;
    if(images.length > 0){
        image = images[0];
    }

    return image;
}

export function formatGoodType(type){
    if(type='auction'){
        return '拍卖';
    }
    return '精品商城';
}

export function formatDate(ticks){
    var date = new Date(ticks);

    return date.toLocaleDateString('zh-cn');
}

export function formatDate2(date){
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    return `${year}年${month}月${day}日${hour}时${minute}分`;
}

export function formateTime(ticks){
    var date = new Date(ticks);
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    return `${year}年${month}月${day}日${hour}时${minute}分`;
}

export function formatDateDiff(date1, date2){
    if(date1 >= date2){
        return null;
    }

    var date3 = date2.getTime() - date1.getTime();
    var days=Math.floor(date3/(24*3600*1000))
 
    var leave1=date3%(24*3600*1000)    
    var hours=Math.floor(leave1/(3600*1000))

    var leave2=leave1%(3600*1000)        
    var minutes=Math.floor(leave2/(60*1000))
    
    var leave3=leave2%(60*1000)      
    var seconds=Math.round(leave3/1000)
    return `${days}天${hours}小时${minutes}分`;
}

export function formatMessage(status){
    switch(status){
        case "待支付":
            return "等待买家付款"
            break;
        case "待发货":
            return "买家已付款，等待卖家发货";
            break;
        case "待签收":
            return "卖家已发货等待签收";
            break;
        case "已完成":
            return "已签收，交易完成";
            break;
    }
}

export function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }