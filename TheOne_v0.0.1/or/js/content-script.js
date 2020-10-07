let refreshKey = true;
let timerSearch;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.doKey) {
        case "addNewSearch":
            timerSearch = setInterval(function () {
                let $qg = $('#queryString');
                if ($qg.val() !== request.keyContent) {
                    $qg.val(request.keyContent);
                } else {
                    chrome.runtime.sendMessage({doKey: 'goBeginAct'});
                    $('div.search-main button.ui-button.ui-button-primary.ui-button-large').eq(0).trigger("click");
                    refreshKey = false;
                }
            }, 5000);
            break;
        case "searchCheck":
            if(refreshKey){
                catchContent(request.keyContent);
            }
            break;
        case "stop":
            clearInterval(timerSearch);
            break;
    }
});


let textBox = '';
let cat_ii = 0;

function catchContent(keyWordArray) {
    let key_ranking = '';
    let key_which = '';
    textBox = $('#queryString').val();
    cat_ii++;
    if (textBox === keyWordArray) {
        if ($('#rank-searech-table td:nth-child(1)').eq(0).text() === '无匹配结果') {
            chrome.runtime.sendMessage({
                doKey: 'catchNull',
                keyWord: $('#queryString').val()
            }, function (response) {
                if (response === 'bg_gotData') {
                    chrome.runtime.sendMessage({
                        doKey: 'goNext'
                    });
                }
            });
        } else {
            let $foundWord = $('#rank-searech-table td:nth-child(2) a').eq(0);
            if ($foundWord.length > 0) {
                key_ranking = $foundWord.text();
                key_which = $('#rank-searech-table td:nth-child(3) span').eq(0).text();
                chrome.runtime.sendMessage({
                    doKey: 'catch',
                    keyWord: $('#queryString').val(),
                    keyRanking: key_ranking,
                    keyWhich: key_which
                }, function (response) {
                    if (response === 'bg_gotData') {
                        chrome.runtime.sendMessage({doKey: 'goNext',});
                    }
                });
            }
        }
    }
}


