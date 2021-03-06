//storage for siteToSearch value
function onError(error) {
    console.log(`Error: ${error}`);
}
var getting = browser.storage.sync.get("siteToSearch");

function appendLinks(el) {
    let insertionPoints = document.querySelectorAll(".streaming-links");
    insertionPoints.forEach((link) => {
        console.log(link.parentNode.id);
        if (link.parentNode.id === "watch-now-content") {
            insertionPoint = link;
        }
    });
    // console.log(insertionPoint);
    if (!insertionPoint) {
        console.error("Could not find insertion point.");
        return;
    }
    mediaName = document.getElementById("watch-now-content").getElementsByClassName("titles")[0].getElementsByTagName("h3")[0].textContent.substring(15);
    if (!mediaName) {
        mediaName = document.getElementById("watch-now-content").getElementsByClassName("titles")[0].getElementsByTagName("h1")[0].textContent;
    }
    getting.then(function (item) {
        var sitesToSearch = ["imdb.com", "", ""];
        if (item.siteToSearch) {
            sitesToSearch = item.siteToSearch;
        }
        insertionPoint.insertAdjacentHTML('afterbegin', '<div class="title">custom sites including ' + mediaName + '</div><div class="section" id="insertPoint">');
        sitesToSearch.forEach(function (siteToSearch) {
            // console.log("media name:", mediaName, "siteToSearch:", siteToSearch);
            if (siteToSearch === "") {
                return;
            }

            fetch("https://www.google.com/search?q=site:" + siteToSearch + "+" + mediaName)
                .then(response => {
                    // console.log("Searched", "https://www.google.com/search?q=site:" + siteToSearch + "+" + mediaName);
                    return response.text();
                })
                .then(resp => {
                    // console.log(resp);
                    if (resp.includes("did not match any documents") || siteToSearch == "") {
                        // console.log("Nothing was returned.");
                    } else {
                        try {
                            //Filter out image results, if they're first
                            resp = resp.substring(resp.indexOf("Web results"));
                            link = resp.substring(resp.indexOf("id=\"ires"));
                            link = link.substring(link.indexOf("href="));
                            link = link.substring(6);
                            link = link.substring(0, link.indexOf("\""));
                            console.log("the link that was found is:", link);
                        } catch (err) {
                            console.log("Couldn't get link...", err.message);
                            link = "";
                        }

                        if (link.substring(0, 5).includes("http")) {
                            try {
                                document.getElementById("insertPoint").innerHTML += '<a target="_blank" rel="nofollow" data-source="netflix" class="" href="' + link + '" data-original-title="" title=""><div class="icon btn-default"><div class="trakt-icon-play-circle" style="font-size:37px;"></div></div><div class="price">Search on <br>' + siteToSearch + '</div></a>';
                            } catch (err) {
                                // console.log("Error:", err.message);
                            }
                        } else {
                            console.log("Link was formatted incorrectly, got:", link, "so skipping...");
                        }
                    }

                })
                .catch(function (err) {
                    console.log('Fetch Error :-S', err);
                });
        });
        insertionPoint.insertAdjacentHTML('afterbegin', "</div>");
    }, onError);
}

var obs = new MutationObserver(function (mutations, observer) {
    // look through all mutations that just occured
    for (var i = 0; i < mutations.length; ++i) {
        // look through all added nodes of this mutation
        for (var j = 0; j < mutations[i].addedNodes.length; ++j) {
            // was a child added with className of 'streaming-links'?
            if (mutations[i].addedNodes[j].className == "streaming-links") {
                // console.log(mutations[i].addedNodes[j].parentNode.id);
                appendLinks(mutations[i].addedNodes[j]);
                obs.disconnect();
                obs.observe(document.getElementById("watch-now-content"), {
                    childList: true
                });
            }
        }
    }
});

// have the observer observe #watch-now-content for changes in children
obs.observe(document.getElementById("watch-now-content"), {
    childList: true
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.greeting == "hello")
            sendResponse({
                message: "hi"
            });
    }
);

//On page load, add play buttons to everything we can
iconBars = document.querySelectorAll(".quick-icons > .actions");
iconBars.forEach((iconBar) => {
    const playIcon = document.createElement("div");
    playIcon.classList.add("trakt-icon-play2-thick");
    const playLink = document.createElement("a");
    playLink.classList.add("watch-now");
    playLink.setAttribute("data-toggle", "modal");
    playLink.setAttribute("data-target", "#watch-now-modal");
    playLink.appendChild(playIcon);
    if (!iconBar.querySelector(".watch-now")) {
        episodeNumber = iconBar.parentElement.parentElement.getAttribute("data-url");
        playLink.setAttribute("data-url", episodeNumber);
        iconBar.appendChild(playLink);
    }
});