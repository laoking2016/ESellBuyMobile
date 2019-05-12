
import { API_URL } from './const.js'

export function uploadFile(url, file, progress, complete){
    
    var xhr = new XMLHttpRequest();
    if (xhr.upload) {
        xhr.upload.onprogress = progress;
    }
    xhr.onreadystatechange = complete;
    xhr.open('post', `${API_URL}${url}`, true);
    var formData = new FormData();
    formData.append("file", file);
    xhr.send(formData);
}

export function uploadFileExt(url, path, complete){
    var task = plus.uploader.createUpload(`${API_URL}${url}`,{
        method: 'POST', 
        blocksize: 204800, 
        priority: 100
    }, function(t, status){
        complete(eval('(' + t.responseText + ')'))
    });
    task.addFile(path, {key: 'file'});
    task.start();
}