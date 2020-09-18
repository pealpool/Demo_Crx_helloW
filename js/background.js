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
let catchWordArray = new Array();
catchWordArray[0] = [];
let timerSearch;
let search_i = 0;
let reKeyWord = '';

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
            sendResponse('bg收数组:' + keyWordArray.length);
            search_i = 0;
            addNewKeyWord();
            beginActiveSearch();
            break;
        case "catch":
            if (reKeyWord == keyWordArray[search_i]) {
                catchWordArray[search_i, 0] = reKeyWord;
                catchWordArray[search_i, 1] = message.keyRanking;
                catchWordArray[search_i, 2] = message.keyWhich;
                chrome.runtime.sendMessage({doKey: 'bTp_catchData', catchWA: catchWordArray});
                sendResponse('bg_gotData');
            }
    }
});

function sendMessageToContentScript(message, callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
            if (callback) callback(response);
        });
    });
}

//todo tab刷新以后,id不同引起错误？
function beginActiveSearch() {
    timerSearch = setInterval(function () {
        sendMessageToContentScript({doKey: 'searchCheck', keyContent: search_i}, function (response) {
            switch (response) {
                case "finish":
                    clearInterval(timerSearch);
                    break;
            }
        });
    }, 2000)
}


function addNewKeyWord() {
    sendMessageToContentScript({doKey: 'addNewSearch', keyContent: search_i}, function (response) {
        reKeyWord = response;
    });
}