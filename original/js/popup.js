let catchWordArray = [];
catchWordArray[0] = [];


chrome.storage.local.get({word_text: 'No data'}, function (items) {
    $('#myKeyWord').val(items.word_text);
});
// chrome.storage.local.get({divResult: ''}, function (items) {
//     $('#myResultBox').html(items.divResult);
// });

chrome.runtime.sendMessage({doKey: 'loadResult'}, function (response) {
    $('#myResultBox').html(response);
});

$('#myKeyWord').on('change', function () {
    let v_after = $(this).val();
    chrome.storage.local.set({word_text: v_after});
});

$('#copyButton').on('click', function () {
    if ($(this).attr('class') === 'blueButtonHover') {
        chrome.runtime.sendMessage({doKey: 'OutputCopy'}, function (response) {
            if (response) {
                timedMsg('已导出结果到粘贴板，');
                timedMsg('打开相应Excel文档，');
                timedMsg('按Ctrl+v即可粘贴。');
            } else {
                timedMsg('无数据。');
            }
        });
    } else {
        chrome.runtime.sendMessage({doKey: 'stop'});
        timedMsg('查询已手动停止。');
    }
});

$('#searchButton').on('click', function () {
    // chrome.storage.local.get({word_text: '无数据'}, function(items) {
    //     $('#ddd').append('<div>提取：' + items.word_text + '</div>');
    // });
    $.get("http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp", function (data) {
        let startDay = 1602061859000; //2020-10-07 17:10:59
        let trialDay = 60;
        let nowTime = data.data.t;
        if (nowTime < (startDay + trialDay * 86400000)) {
            if ($('#searchButton').attr('class') === 'blueButtonHover') {
                let activeUrl;
                chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                    activeUrl = tabs[0].url;
                    let exp1 = new RegExp("^(https:\/\/hz-productposting\.alibaba\.com\/product\/ranksearch\/rankSearch\.htm)");
                    let exp2 = new RegExp("^(https:\/\/passport\.alibaba\.com\/icbu_login\.htm)");
                    if (exp1.test(activeUrl)) {
                        searchClick();
                    } else if (exp2.test(activeUrl)) {
                        timedMsg('请先登录后继续。');
                    } else {
                        timedMsg('正在打开查询网站');
                        chrome.tabs.create({url: 'https://hz-productposting.alibaba.com/product/ranksearch/rankSearch.htm'});
                    }
                });
            }
        } else {
            timedMsg('版本已过期，');
            setTimeout(function () {
                timedMsg('请升级后再试。');
            }, 2000);
        }
    });
});


function searchClick() {
    let keyWordArray;
    let st = $('#myKeyWord').val();
    st = st.replace(/^\n*/, "");
    st = st.replace(/\n{2,}/g, "\n");
    st = st.replace(/\n*$/, "");
    keyWordArray = st.split("\n");
    $('#catching').remove();
    $('.tabBox').remove();
    chrome.runtime.sendMessage({doKey: 'searchBegin', kWc: keyWordArray}, function (response) {
        // timedMsg(response);
        $('#searchButton .font_T').text('查询中(0/' + response + ')').addClass('loadingIco');
        // $('#searchButton .font_T').addClass('loadingIco');
        $('#searchButton').removeClass('blueButtonHover').addClass('blueBackgroundLoading');
        $('#copyButton .font_T').text('停止');
        $('#copyButton').addClass('redButton').removeClass('blueButtonHover');
    });
}

// function sendMessageToContentScript(message, callback) {
//     chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
//             if (callback) callback(response);
//         });
//     });
// }


$("#myResultBox").on({
    mouseover: function () {
        $('#myConsoleBox').css('opacity', 0.1);
        $("#myKeyWord").switchClass("myKeyWord02", "myKeyWord01", 100);
    },
    mouseout: function () {
        $('#myConsoleBox').css('opacity', 1);
    }
});


function timedMsg(myText) {
    let $myDivRemove = $('<div class="myConsole"><span>' + myText + '</span></div>');
    $('#myConsoleBox').prepend($myDivRemove);
    setTimeout(function () {
        $myDivRemove.hide('fade', 1000, function () {
            $myDivRemove.remove();
        });
    }, 10000);
}

$('#logoName_T .smallFont').on('click', function () {
    timedMsg('检查是否有更新可用...');
    setTimeout(function () {
        timedMsg('试用版：不能自动升级。');
        setTimeout(function () {
            timedMsg('获取更多功能或bug修复，');
            setTimeout(function () {
                timedMsg('请联系本地服务商。');
            }, 2000);
        }, 2000);
    }, 2000);
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.doKey) {
        case "bTp_catchData":
            timedMsg('收到bg数据');
            // $('#searchButton .font_T').text(request.st);
            $('#catching').remove();
            $('.tabBox').remove();
            let i = 0;
            // timedMsg('request.catchWA.length=' + request.catchWA.length);
            while ((request.catchWA[i][0] !== '') && (i <= request.le)) {
                drawResult(request.catchWA[i][0], request.catchWA[i][1], request.catchWA[i][2]);
                i++;
            }
            break;
        case "SearchState_on":
            $('#searchButton .font_T').text(request.catchWA).addClass('loadingIco');
            // $('#searchButton .font_T').addClass('loadingIco');
            $('#searchButton').removeClass('blueButtonHover').addClass('blueBackgroundLoading');
            $('#copyButton .font_T').text('停止');
            $('#copyButton').addClass('redButton').removeClass('blueButtonHover');
            break;
        case "SearchState_off":
            $('#searchButton .font_T').text('查询').removeClass('loadingIco');
            // $('#searchButton .font_T').removeClass('loadingIco');
            $('#searchButton').removeClass('blueBackgroundLoading').addClass('blueButtonHover');
            $('#copyButton .font_T').text('导出');
            $('#copyButton').removeClass('redButton').addClass('blueButtonHover');
            break;
    }
});

$('#myKeyWord').on({
    mouseover: function () {
        $("#myKeyWord").switchClass("myKeyWord01", "myKeyWord02", 100);
    }
});

function drawResult(a0, a1, a2) {
    $('#myResultBox').append('<div class="tabBox"><div class="tabD0">' + a0 + '</div>' + '<div class="tabD1">' + a1 + '</div>' + '<div class="tabD2">' + a2 + '</div></div>');
}




//todo 图片转成Base64，直接输出 首页设计稿html
// https://www.jsjiami.com/article/js-download-img.html