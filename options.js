function saveOptions(e) {
    e.preventDefault();
    browser.storage.sync.set({
        siteToSearch: [document.querySelector("#site1ToSearch").value, document.querySelector("#site2ToSearch").value, document.querySelector("#site3ToSearch").value]
    });
}

function restoreOptions() {
    function setCurrentChoice(result) {
        console.log("Result:", result);
        if (result != undefined) {
            document.querySelector("#site1ToSearch").value = result.siteToSearch[0] || "imdb.com";
            document.querySelector("#site2ToSearch").value = result.siteToSearch[1] || "";
            document.querySelector("#site3ToSearch").value = result.siteToSearch[2] || "";
        }
    }
    function onError(error) {
        console.log(`Error: ${error}`);
    }
    var getting = browser.storage.sync.get("siteToSearch");
    getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);