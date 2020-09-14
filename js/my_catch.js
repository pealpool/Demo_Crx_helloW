chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    let myData = new Array();
    let i = 0;
    let bo = true;

    console.log(request);

    let h = $(document).height() - $(window).height();
    $(document).scrollTop(h);


    $('.organic-gallery-offer__seller-company').each(function () {
        if ($(this).text() == request) {
            sendResponse(i);
            bo = false;
            return false;
        }
        // myData[i] = $(this).text();
        i++;
    });
    if (bo) {
        sendResponse(-1);
        $('.ui2-icon.ui2-icon-arrow-right.ui2-icon-xs').trigger("click");
    }
    // let myNum0 = $('.organic-gallery-offer__seller-company').eq(0).text();
    // sendResponse(myData);
    // tip(JSON.stringify(request));
    // sendResponse('我收到你的消息了：'+JSON.stringify(request));

});
