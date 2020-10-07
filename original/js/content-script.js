let refreshKey = true;
let timerSearch;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.doKey) {
        case "addNewSearch":
            console.log("收到后台addNewSearch命令");
            timerSearch = setInterval(function () {
                let $qg = $('#queryString');
                if ($qg.val() !== request.keyContent) {
                    $qg.val(request.keyContent);
                    console.log(("request.keyContent=" + request.keyContent));
                    console.log("循环中" + $('#queryString').val());
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
    console.log('cat_ii= ' + cat_ii);
    cat_ii++;
    console.log('textBox=' + textBox);
    console.log('keyWordArray=' + keyWordArray);
    if (textBox === keyWordArray) {
        if ($('#rank-searech-table td:nth-child(1)').eq(0).text() === '无匹配结果') {
            chrome.runtime.sendMessage({
                doKey: 'catchNull',
                keyWord: $('#queryString').val()
            }, function (response) {
                console.log('response=' + response);
                if (response === 'bg_gotData') {
                    chrome.runtime.sendMessage({
                        doKey: 'goNext'
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
                    if (response === 'bg_gotData') {
                        chrome.runtime.sendMessage({doKey: 'goNext',});
                        console.log("bg 收到 cs 数据");
                    }
                });
            }
        }
    }
}


