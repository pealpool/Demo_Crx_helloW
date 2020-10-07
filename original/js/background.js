new ClipboardJS('.btn');
let keyWordArray = [];
let catchWordArray = [];
let keyWordArrayLength = 0;
let search_i = 0;
let sub_i = 0;
let timerSearch;
let searching = false;
let myTab;
for (let i = 0; i < 100; i++) {
    catchWordArray[i] = [];
    for (let j = 0; j <= 2; j++) {
        catchWordArray[i][j] = '';
    }
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // if (message.doKey == 'keyWordChange') {
    //     chrome.storage.local.set({word_text: message.keyWordText}, function () {
    //
    //         sendResponse('saved: ' + message.keyWordText);
    //     });
    // }
    switch (message.doKey) {
        case "loadResult":
            if ($('#myResultBox').html() === '') {
                sendResponse('<div id="catching">待获取数据...</div>');
            } else {
                sendResponse($('#myResultBox').html());
            }
            refreshSearchState();
            break;
        case "searchBegin":
            keyWordArray = $.extend(true, [], message.kWc);
            keyWordArrayLength = keyWordArray.length;
            sub_i = keyWordArrayLength;
            sendResponse(keyWordArrayLength);
            searching = true;
            search_i = 0;
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                myTab = tabs[0];
                addNewKeyWord();
            });
            chrome.browserAction.setBadgeText({text: (sub_i + '')});
            chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
            break;
        case "goBeginAct":
            beginActiveSearch();
            break;
        case "catch":
            if (message.keyWord === keyWordArray[search_i]) {
                catchWordArray[search_i][0] = keyWordArray[search_i];
                catchWordArray[search_i][1] = message.keyRanking;
                catchWordArray[search_i][2] = message.keyWhich;
                // let a = '查询中(' + (search_i + 1) + '/' + keyWordArray.length + ')';
                chrome.runtime.sendMessage({doKey: 'bTp_catchData', catchWA: catchWordArray, le: search_i});
                refreshSearchState();
                sendResponse('bg_gotData');
                printResult();
            }
            break;
        case "catchNull":
            if (message.keyWord === keyWordArray[search_i]) {
                catchWordArray[search_i][0] = keyWordArray[search_i];
                catchWordArray[search_i][1] = "前20页无产品";
                catchWordArray[search_i][2] = "";
                // let a = '查询中(' + (search_i + 1) + '/' + keyWordArray.length + ')';
                chrome.runtime.sendMessage({doKey: 'bTp_catchData', catchWA: catchWordArray, le: search_i});
                refreshSearchState();
                sendResponse('bg_gotData');
                printResult();
            }
            break;
        case "goNext":
            clearInterval(timerSearch);
            if (search_i < (keyWordArray.length - 1)) {
                search_i++;
                sub_i = keyWordArrayLength - search_i;
                chrome.browserAction.setBadgeText({text: (sub_i + '')});
                addNewKeyWord();
            } else {
                searching = false;
                refreshSearchState();
                chrome.browserAction.setBadgeText({text: ''});
                chrome.browserAction.setBadgeBackgroundColor({color: [0, 0, 0, 0]});
                chrome.notifications.create(null, {
                    type: 'basic',
                    iconUrl: 'images/logoTO.png',
                    title: 'The One 运营助手',
                    message: '查询完成!',
                    requireInteraction: true
                    // imageUrl: 'img/sds.png'
                });
            }
            break;
        case "OutputCopy":
            if (!searching) {
                let ti = 0;
                $('#myTable').empty();
                while ((catchWordArray[ti][0] !== '') && (ti < keyWordArrayLength)) {
                    drawTable(catchWordArray[ti][0], catchWordArray[ti][1], catchWordArray[ti][2]);
                    ti++;
                }
                if ($('#myTable').html() === '') {
                    sendResponse(false);
                } else {
                    $('.btn').trigger('click');
                    sendResponse(true);
                }
            }
            break;
        case "stop":
            clearInterval(timerSearch);
            searching = false;
            chrome.runtime.sendMessage({doKey: 'SearchState_off'});
            chrome.tabs.sendMessage(myTab.id, {doKey: 'stop'})
            chrome.browserAction.setBadgeText({text: ''});
            chrome.browserAction.setBadgeBackgroundColor({color: [0, 0, 0, 0]});
            sendResponse(true);
            break;
    }
});

// function sendMessageToContentScript(message, callback) {
//     chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
//             if (callback) callback(response);
//         });
//     });
// }


function beginActiveSearch() {
    timerSearch = setInterval(function () {
        // sendMessageToContentScript({doKey: 'searchCheck', keyContent: keyWordArray[search_i]});
        chrome.tabs.sendMessage(myTab.id, {doKey: 'searchCheck', keyContent: keyWordArray[search_i]});
    }, 1000);
}


function addNewKeyWord() {
    // sendMessageToContentScript({doKey: 'addNewSearch', keyContent: keyWordArray[search_i]});
    chrome.tabs.sendMessage(myTab.id, {doKey: 'addNewSearch', keyContent: keyWordArray[search_i]});
}


function printResult() {
    let di = 0;
    $('.tabBox').remove();
    while ((catchWordArray[di][0] !== '') && (di < keyWordArrayLength)) {
        drawResult(catchWordArray[di][0], catchWordArray[di][1], catchWordArray[di][2]);
        di++;
    }
}

function drawResult(a0, a1, a2) {
    $('#myResultBox').append('<div class="tabBox"><div class="tabD0">' + a0 + '</div>' + '<div class="tabD1">' + a1 + '</div>' + '<div class="tabD2">' + a2 + '</div></div>');
}

function drawTable(a0, a1, a2) {
    $('#myTable').append('<tr><td>' + a0 + '</td>' + '<td>' + a1 + '</td>' + '<td>' + a2 + '</td></tr>');
}

function refreshSearchState() {
    if (searching) {
        let a = '查询中(' + (search_i + 1) + '/' + keyWordArrayLength + ')';
        chrome.runtime.sendMessage({doKey: 'SearchState_on', catchWA: a});
    } else {
        chrome.runtime.sendMessage({doKey: 'SearchState_off'});
    }
}
