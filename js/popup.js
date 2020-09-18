// function sendMessageToContentScript(message, callback) {
//     getCurrentTabId((tabId) => {
//         chrome.tabs.sendMessage(tabId, message, function (response) {
//             if (callback) callback(response);
//         });
//     });
// }
//
// function getCurrentTabId(callback) {
//     chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
//         if (callback) callback(tabs.length ? tabs[0].id : null);
//     });
// }
//
//
// let companyName = $('#myKeyWord').val();
//
// $('a').click(() => {
//     googoo();
//
// });
//
// function googoo() {
//     sendMessageToContentScript(companyName, (response) => {
//
//         // alert('收到来自content-script的回复：'+response)
//         //
//         // let i;
//         // for (i = 0; i < response.length; i++) {
//         //     $('#ddd').append('<div>' + response[i] + '</div>');
//         // }
//         // i++;
//         $('#ddd').append('<a>' + response + '</a>');
//         // $('a').text(response);
//
//     });
// }


// let v_after = $('#myKeyWord').val();
// chrome.runtime.sendMessage({'doKey': 'keyWordChange', 'keyWordText':v_after}, function (response) {
//     $('#ddd').append('<div>' + response + '</div>');
// });


let catchWordArray = new Array();
catchWordArray[0] = [];


chrome.storage.local.get({word_text: '无数据'}, function (items) {
    $('#myKeyWord').val(items.word_text);
});


$('#myKeyWord').change(function () {
    let v_after = $('#myKeyWord').val();
    chrome.storage.local.set({word_text: v_after});
});

$('#searchButton').click(function () {
    // chrome.runtime.sendMessage({'doKey': 'getText'}, function (response) {
    //     $('#ddd').append('<div>提取：' + response + '</div>');
    // });

    // chrome.storage.local.get({word_text: '无数据'}, function(items) {
    //     $('#ddd').append('<div>提取：' + items.word_text + '</div>');
    // });


    let keyWordArray = new Array();
    let st = $('#myKeyWord').val();
    st = st.replace(/^\n*/, "");
    st = st.replace(/\n{2,}/g, "\n");
    st = st.replace(/\n*$/, "");
    keyWordArray = st.split("\n");

    chrome.runtime.sendMessage({doKey: 'searchBegin', kWc: keyWordArray}, function (response) {
        timedMsg(response);
    });

    sendMessageToContentScript({doKey: 'searchBegin', kWc: keyWordArray}, function (response) {
        timedMsg(response);
    });

});

function sendMessageToContentScript(message, callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
            if (callback) callback(response);
        });
    });
}

$('#myResultBox').hover(function () {
    $('#myConsoleBox').css('opacity', 0.1);
}, function () {
    $('#myConsoleBox').css('opacity', 1);
});


function timedMsg(mytext) {
    let $myDivRemove = $('<div class="myConsole"><span>' + mytext + '</span></div>');
    $('#myConsoleBox').prepend($myDivRemove);
    let t = setTimeout(function () {
        $myDivRemove.hide('fade', 1000, function () {
            $myDivRemove.remove();
        });
    }, 10000);
}

$('#logoName_T .smallFont').click(function () {
    timedMsg('检查是否有更新可用...');
    let t1 = setTimeout(function () {
        timedMsg('试用版：不能自动升级。');
        let t2 = setTimeout(function () {
            timedMsg('获取更多功能或bug修复，');
            let t3 = setTimeout(function () {
                timedMsg('请联系本地服务商。');
            }, 2000);
        }, 2000);
    }, 2000);
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.doKey) {
        case "bTp_catchData":
            timedMsg('收到bg数据');
            catchWordArray = $.extend(true, [], request.catchWA);
            $('.myResult').remove();
            let i = 0;
            while ((catchWordArray[i,0]!='') && (i <= catchWordArray.length)){
                $('#myResultBox').prepend('<div class="myResult">' + catchWordArray[i,0] + '&#9;'+ catchWordArray[i,1] + '&#9;'+ catchWordArray[i,2]  + '</div>');
            }

            break;
    }
});