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

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // if (message.doKey == 'keyWordChange') {
    //     chrome.storage.local.set({word_text: message.keyWordText}, function () {
    //
    //         sendResponse('saved: ' + message.keyWordText);
    //     });
    // }
    switch (message.doKey) {
        case "searchBegin":
            keyWordArray = $.extend(true, [], message.kWa);
            sendResponse('开始查询...');
            beginActiveSearch()
            break;
    }
});

let timerSearch;
function beginActiveSearch(){
    timerSearch = setInterval(function(){

    }, 500)
}


// clearInterval(timerSearch);