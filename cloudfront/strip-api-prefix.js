function handler(event) {
    var req = event.request;
    req.uri = req.uri.replace(/^\/api/, '') || '/';
    return req;
}