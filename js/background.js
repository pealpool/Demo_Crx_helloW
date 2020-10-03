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
            for (let i = 0; i < keyWordArrayLength; i++) {
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
            if (message.keyWord == keyWordArray[search_i]) {
                catchWordArray[search_i][0] = keyWordArray[search_i];
                catchWordArray[search_i][1] = message.keyRanking;
                catchWordArray[search_i][2] = message.keyWhich;
                chrome.runtime.sendMessage({doKey: 'bTp_catchData', catchWA: catchWordArray});
                sendResponse('bg_gotData');
                printResult();
            }
            break;
        case "catchNull":
            if (message.keyWord == keyWordArray[search_i]) {
                catchWordArray[search_i][0] = keyWordArray[search_i];
                catchWordArray[search_i][1] = "前20页无产品";
                catchWordArray[search_i][2] = "";
                chrome.runtime.sendMessage({doKey: 'bTp_catchData', catchWA: catchWordArray});
                sendResponse('bg_gotData');
                printResult();
            }
            break;
        case "goNext":

            clearInterval(timerSearch);
            if (search_i < (keyWordArray.length - 1)) {
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




function printResult() {
    let di = 0;
    $('.tabBox').remove();
    while ((catchWordArray[di][0] != '') && (di < catchWordArray.length)) {
        drawResult(catchWordArray[di][0], catchWordArray[di][1], catchWordArray[di][2]);
        di++;
    }
    // let resultHtml = $('#myResultBox').html();
    // console.log(resultHtml);
    // chrome.storage.local.set({divResult: resultHtml});
}
function drawResult(a0, a1, a2) {
    $('#myResultBox').append('<div class="tabBox"><div class="tabD0">' + a0 + '</div>' + '<div class="tabD1">' + a1 + '</div>' + '<div class="tabD2">' + a2 + '</div></div>');
}