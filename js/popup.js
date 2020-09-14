function sendMessageToContentScript(message, callback) {
    getCurrentTabId((tabId) => {
        chrome.tabs.sendMessage(tabId, message, function (response) {
            if (callback) callback(response);
        });
    });
}

function getCurrentTabId(callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        if (callback) callback(tabs.length ? tabs[0].id : null);
    });
}


let companyName = $('#in1').val();

$('a').click(() => {
    googoo();

});

function googoo() {
    sendMessageToContentScript(companyName, (response) => {

        // alert('收到来自content-script的回复：'+response)
        //
        // let i;
        // for (i = 0; i < response.length; i++) {
        //     $('#ddd').append('<div>' + response[i] + '</div>');
        // }
        // i++;
        $('#ddd').append('<a>' + response + '</a>');
        // $('a').text(response);

    });
}