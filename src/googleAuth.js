import "https://apis.google.com/js/api.js"

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function loadGapi(){
    gapi.load("client:auth2", function () {
        gapi.auth2.init({ client_id: "682111284050-su5nujiir17d5g8hg7l720snlbd3bmr8.apps.googleusercontent.com" });
    });
    console.log("GAPI loaded");
    return await sleep(1000);
}

/**
 * Sample JavaScript code for youtube.subscriptions.list
 * See instructions for running APIs Explorer code samples locally:
 * https://developers.google.com/explorer-help/code-samples#javascript
 */

export function loadClient() {
    gapi.client.setApiKey("AIzaSyACfvSjO1vX30rZarzIzK3ajC_BCja7JYg");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function () { console.log("GAPI client loaded for API"); },
            function (err) { console.error("Error loading GAPI client for API", err); });
}
// Make sure the client is loaded and sign-in is complete before calling this method.
export function executeNext(channelId, nextPageToken) {
    return gapi.client.youtube.subscriptions.list({
        "part": [
            "snippet"
        ],
        "channelId": channelId,
        "maxResults": 50,
        "pageToken": nextPageToken,
        "prettyPrint": true
    })
        .then(function (response) {
            // Handle the results here (response.result has the parsed body).
            return response;
        },
            function (err) { console.error("Execute error", err); });
}
