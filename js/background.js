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
let keyWordArrayLength = 0;
let search_i = 0;
let reKeyWord = '';
let timerSearch;

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
            keyWordArrayLength = keyWordArray.length;
            sendResponse('bg收数组:' + keyWordArrayLength);
            for (let i = 0; i <= keyWordArrayLength; i++) {
                catchWordArray[i] = new Array();
                for (let j = 0; j <= 2; j++) {
                    catchWordArray[i][j] = '';
                }
            }
            search_i = 0;
            addNewKeyWord();
            break;
        case "goBeginAct":
            beginActiveSearch();
            break;
        case "catch":
            if(message.keyWord == keyWordArray[search_i]){
                catchWordArray[search_i][0] = keyWordArray[search_i];
                catchWordArray[search_i][1] = message.keyRanking;
                catchWordArray[search_i][2] = message.keyWhich;
                chrome.runtime.sendMessage({doKey: 'bTp_catchData', catchWA: catchWordArray});
                sendResponse('bg_gotData');
            }
            break;
        case "goNext":
            clearInterval(timerSearch);
            if (search_i <= keyWordArray.length) {
                search_i++;
                addNewKeyWord();
            }
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


function beginActiveSearch() {
    timerSearch = setInterval(function () {
        sendMessageToContentScript({doKey: 'searchCheck', keyContent: keyWordArray[search_i]});
    }, 1000);
}


function addNewKeyWord() {
    sendMessageToContentScript({doKey: 'addNewSearch', keyContent: keyWordArray[search_i]});
}