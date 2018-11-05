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