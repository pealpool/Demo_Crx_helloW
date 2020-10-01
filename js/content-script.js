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
// let keyWordArray = new Array();

let refreshKey = true;


let timerSearch;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.doKey) {
        // case "searchBegin":
        //     keyWordArray = $.extend(true, [], request.kWc);
        //     sendResponse('cs收数组:' + keyWordArray.length);
        //     break;
        case "addNewSearch":
            timerSearch = setInterval(function () {
                if ($('#queryString').val() != request.keyContent) {
                    $('#queryString').val(request.keyContent);
                    console.log("循环中" + $('#queryString').val());
                } else {
                    chrome.runtime.sendMessage({doKey: 'goBeginAct',});
                    $('div.search-main button.ui-button.ui-button-primary.ui-button-large').eq(0).trigger("click");
                    refreshKey = false;
                }
            }, 5000);
            break;
        case "searchCheck":
            // sendResponse(catchContent(request.keyContent));
            if(refreshKey){
                catchContent(request.keyContent);
            }
            break;

    }
});


let textBox = '';
let cat_ii = 0;

function catchContent(keyWordArray) {
    let key_ranking = '';
    let key_which = '';
    textBox = $('#queryString').val();
    console.log('cat_ii= ' + cat_ii);
    cat_ii++;
    console.log('textBox=' + textBox);
    console.log('keyWordArray=' + keyWordArray);
    if (textBox == keyWordArray) {
        if ($('#rank-searech-table td:nth-child(1)').eq(0).text() == '无匹配结果') {
            chrome.runtime.sendMessage({
                doKey: 'catchNull',
                keyWord: $('#queryString').val()
            }, function (response) {
                console.log('response=' + response);
                if (response == 'bg_gotData') {
                    chrome.runtime.sendMessage({
                        doKey: 'goNext',
                        keyWord: $('#queryString').val()
                    });
                    console.log("bg 收到 cs 数据");
                }
            });
        } else {
            let $foundWord = $('#rank-searech-table td:nth-child(2) a').eq(0);
            console.log('$foundWord.length=' + $foundWord.length);
            if ($foundWord.length > 0) {
                key_ranking = $foundWord.text();
                key_which = $('#rank-searech-table td:nth-child(3) span').eq(0).text();
                console.log('key_ranking=' + key_ranking);
                console.log('key_which=' + key_which);
                chrome.runtime.sendMessage({
                    doKey: 'catch',
                    keyWord: $('#queryString').val(),
                    keyRanking: key_ranking,
                    keyWhich: key_which
                }, function (response) {
                    console.log('response=' + response);
                    if (response == 'bg_gotData') {
                        chrome.runtime.sendMessage({doKey: 'goNext',});
                        console.log("bg 收到 cs 数据");
                    }
                });
            }
        }
    }
}


//todo 完成后还继续循环