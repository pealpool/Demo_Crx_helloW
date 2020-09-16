// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//     // if (message.doKey == 'keyWordChange') {
//     //     chrome.storage.local.set({word_text: message.keyWordText}, function () {
//     //
//     //         sendResponse('saved: ' + message.keyWordText);
//     //     });
//     // }
//     switch (message.doKey) {
//         case "keyWordChange":
//             // chrome.storage.local.set({word_text: message.keyWordText},function (){
//             //     sendResponse('saved: ' + message.keyWordText);
//             // });
//             chrome.storage.local.set({color: 'blue'}, function() {
//                 console.log('保存成功！');
//             });
//             break;
//         // case "getText":
//             // chrome.storage.local.get(['word_text'], function (result) {
//             //     sendResponse(result);
//             // });
//     }
// });

let keyWordArray = new Array();
let timerSearch;
let search_i = 0;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // if (message.doKey == 'keyWordChange') {
    //     chrome.storage.local.set({word_text: message.keyWordText}, function () {
    //
    //         sendResponse('saved: ' + message.keyWordText);
    //     });
    // }
    switch (message.doKey) {
        case "searchBegin":
            keyWordArray = $.extend(true, [], message.kWc);
            sendResponse('bg收数组:'+ keyWordArray.length);
            sendResponse('开始查询...');
            search_i = 0;
            addNewKeyWord();
            beginActiveSearch();
            break;
    }
});

function sendMessageToContentScript(message, callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
            if (callback) callback(response);
        });
    });
}


function beginActiveSearch(){
    timerSearch = setInterval(function(){
        sendMessageToContentScript({doKey: 'searchCheck', keyContent: search_i}, function (response) {
            switch (response.doKey) {
                case "finish":
                    clearInterval(timerSearch);
                    break;
                case "goOn":
                    search_i = response.keyContent;
            }
        });
    }, 500)
}

function addNewKeyWord(){
    sendMessageToContentScript({doKey: 'addNewSearch', keyContent: search_i}, function (response) {});
}