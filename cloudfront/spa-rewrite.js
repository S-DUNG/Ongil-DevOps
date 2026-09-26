function handler(event) {
    var req = event.request;
    if (!req.uri.includes('.')) {
        req.uri = '/index.html';
    }
    return req;
}