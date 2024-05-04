import "https://apis.google.com/js/api.js"

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function loadGapi() {
    gapi.client.init({
        apiKey: 'AIzaSyACfvSjO1vX30rZarzIzK3ajC_BCja7JYg',
        client_id: "682111284050-su5nujiir17d5g8hg7l720snlbd3bmr8.apps.googleusercontent.com",
        scope: 'https://www.googleapis.com/auth/youtube.readonly'
    });
    console.log("GAPI loaded");
    return await sleep(1000);
}

export async function loadGapi1() {
    return new Promise((resolve, reject) => {
        gapi.load("auth2", function () {
            gapi.client.init({
                client_id: "682111284050-su5nujiir17d5g8hg7l720snlbd3bmr8.apps.googleusercontent.com",
                scope: 'https://www.googleapis.com/auth/youtube.readonly'
            });
        })
            .then(resolve)
            .catch(reject);
    });
}

export async function loadGapi2() {
    await gapi.load("client:auth2");
    const auth2 = await gapi.client.init({
        client_id:
            "682111284050-su5nujiir17d5g8hg7l720snlbd3bmr8.apps.googleusercontent.com",
        scope: "https://www.googleapis.com/auth/youtube.readonly",
    });
    const user = await auth2.signIn();
    console.log(user.getBasicProfile().getName());
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
        "prettyPrint": false
    })
        .then(function (response) {
            return response;
        },
            function (err) { console.error("Execute error", err); });
}

export async function initializeAndFetchSubscriptions(channelId) {
    await loadGapi3();
    return gapi.client.init({
        apiKey: 'AIzaSyACfvSjO1vX30rZarzIzK3ajC_BCja7JYg',
        client_id: "682111284050-su5nujiir17d5g8hg7l720snlbd3bmr8.apps.googleusercontent.com",
        scope: 'https://www.googleapis.com/auth/youtube.readonly'
    }).then(function() {
        return loadSubscriptions(channelId);
    }).catch(function(err) {
        console.error("Ошибка инициализации клиента", err);
    });
}

function loadSubscriptions(channelId, nextPageToken = '') {
    return executeNext(channelId, nextPageToken).then(function(response) {
        const subscriptions = response.result.items;
        const nextPageToken = response.result.nextPageToken;

        if (nextPageToken) {
            return loadSubscriptions(channelId, nextPageToken).then(function(nextSubscriptions) {
                return subscriptions.concat(nextSubscriptions);
            });
        } else {
            return subscriptions;
        }
    }).catch(function(err) {
        console.error("Ошибка при загрузке подписок", err);
    });
}

function loadGapi3() {
    return new Promise((resolve, reject) => {
        gapi.load('client:auth2', resolve);
    });
}

