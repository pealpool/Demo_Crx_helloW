// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     let myData = new Array();
//     let i = 0;
//     let bo = true;
//
//     console.log(request);
//
//     let h = $(document).height() - $(window).height();
//     $(document).scrollTop(h);
//
//
//     $('.organic-gallery-offer__seller-company').each(function () {
//         if ($(this).text() == request) {
//             sendResponse(i);
//             bo = false;
//             return false;
//         }
//         // myData[i] = $(this).text();
//         i++;
//     });
//     if (bo) {
//         sendResponse(-1);
//         $('.ui2-icon.ui2-icon-arrow-right.ui2-icon-xs').trigger("click");
//     }
//     // let myNum0 = $('.organic-gallery-offer__seller-company').eq(0).text();
//     // sendResponse(myData);
//     // tip(JSON.stringify(request));
//     // sendResponse('我收到你的消息了：'+JSON.stringify(request));
//
// });


// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//
//     console.log(message.keyContent);
//     switch (message.doKey) {
//         case "keyWa":
//             $('#queryString').val(message.keyContent[0]);
//             sendResponse(message.keyContent[0]);
//             break;
//     }
// });
let keyWordArray = new Array();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.doKey) {
        case "searchBegin":
            keyWordArray = $.extend(true, [], request.kWc);
            sendResponse('cs收数组:' + keyWordArray.length);
            break;
        case "addNewSearch":
            $('#queryString').val(keyWordArray[request.keyContent]);
            sendResponse(keyWordArray[request.keyContent]);
            $('div.search-main button.ui-button.ui-button-primary.ui-button-large').eq(0).trigger("click");
            break;
        case "searchCheck":
            sendResponse(catchContent(request.keyContent));
            break;

    }
});

let textBox = '';

function catchContent(search_i) {
    let key_ranking = '';
    let key_which = '';
    textBox = $('#queryString').val();
    if (textBox == keyWordArray[search_i]) {
        let foundWord = $('#rank-searech-table td:nth-child(1)') + '';
        alert(foundWord.substring(0, 3));
        if (foundWord.substring(0, 3) == '<div') {
            key_ranking = $('#rank-searech-table td:nth-child(2) a').text();
            key_which = $('#rank-searech-table td:nth-child(2) span').text();
            chrome.runtime.sendMessage({
                doKey: 'catch',
                keyRanking: key_ranking,
                keyWhich: key_which
            }, function (response) {
                if (response == 'bg_gotData') {
                    return 'finish';
                }
            });
        }
    }
}