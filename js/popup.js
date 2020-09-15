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

chrome.storage.local.get({word_text: '无数据'}, function (items) {
    $('#myKeyWord').val(items.word_text);
});


$('#myKeyWord').change(function () {
    let v_after = $('#myKeyWord').val();
    chrome.storage.local.set({word_text: v_after});
});

$('a').click(function () {
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


    chrome.runtime.sendMessage({doKey: 'searchBegin', kWa: keyWordArray}, function (response) {
        $('#myDiv').append('<div>' + response + '</div>');
    });


    function sendMessageToContentScript(message, callback) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
                if (callback) callback(response);
            });
        });
    }

    sendMessageToContentScript({doKey: 'keyWordArray', keyContent: keyWordArray}, function (response) {
        $('#myDiv').append('<div>' + response + '</div>');
    });


});