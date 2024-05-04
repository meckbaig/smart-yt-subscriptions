// import "https://accounts.google.com/gsi/client"

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function initializeAndFetchSubscriptions(channelId) {
    loadGis()
    .then(function () {
        return loadSubscriptions(channelId);
    }).catch(function (err) {
        console.error("Ошибка инициализации клиента", err);
    });
}

export function loadSubscriptions(channelId, nextPageToken = undefined) {
    return executeNext(channelId, nextPageToken).then(function(response) {
        const subscriptions = response.items;
        const nextPageToken = response.nextPageToken;

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

export function executeNext(channelId, nextPageToken) {
    const url = new URL('https://youtube.googleapis.com/youtube/v3/subscriptions');
    url.searchParams.append('part', 'snippet');
    url.searchParams.append('channelId', channelId);
    url.searchParams.append('maxResults', '50');
    url.searchParams.append('prettyPrint', 'false');
    url.searchParams.append('key', 'AIzaSyACfvSjO1vX30rZarzIzK3ajC_BCja7JYg');
    if (nextPageToken != undefined)
        url.searchParams.append('pageToken', nextPageToken);
    
    return fetch(url)
        .then(response => response.json())
        .catch(err => console.error("Execute error", err));
}

export function getTitles(idsWithoutTitle) {
    const url = new URL('https://youtube.googleapis.com/youtube/v3/channels');
    url.searchParams.append('part', 'snippet');
    url.searchParams.append('id', idsWithoutTitle.join(','));
    url.searchParams.append('key', 'AIzaSyACfvSjO1vX30rZarzIzK3ajC_BCja7JYg');
    
    return fetch(url)
        .then(response => response.json())
        .catch(err => console.error("Execute error", err));
}

function loadGis() {
    let client = google.accounts.oauth2.initTokenClient({
        client_id: '682111284050-su5nujiir17d5g8hg7l720snlbd3bmr8.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/youtube.readonly',
        callback: (tokenResponse) => {
            const access_token = tokenResponse.access_token;
        },
    });
}

