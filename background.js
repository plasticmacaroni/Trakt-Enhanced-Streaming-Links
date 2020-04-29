browser.webNavigation.onHistoryStateUpdated.addListener(function (details) {
    // console.log('Page uses History API and we heard a pushSate/replaceState.');
    setTimeout(browser.runtime.reload, 2000);
});

browser.tabs.query({
    active: true,
    currentWindow: true
}, function (tabs) {
    browser.tabs.sendMessage(tabs[0].id, {
        greeting: "hello"
    }, function (response) {
        if (response) {
            // console.log("Already there");
        } else {
            // console.log("Not there, inject contentscript");
            try {
                browser.tabs.executeScript(tabs[0].id, {
                    file: "moviefind.js",
                    allFrames: true
                })
            } catch (err) {
                console.log(err.message);
            }
        }
    })
});