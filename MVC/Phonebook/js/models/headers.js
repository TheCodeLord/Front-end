var app = app || {};

app.headers = (function () {
    function Headers(appKey, appSecret, appMaster) {
        this.appKey = appKey;
        this.appSecret = appSecret;
    }

    Headers.prototype.getHeadersApp = function () {
        var headers = {
            'Authorization': 'Basic ' + btoa(this.appKey + ':' + this.appSecret),
            'Content-Type': 'application/json'
        };

        if (sessionStorage['logged-user']) {
            headers['logged-user'] = sessionStorage['logged-user'];
        }

        return headers;
    }

    Headers.prototype.getHeadersUserAuth = function () {
        var headers = {
            'Authorization': 'Kinvey ' + sessionStorage['authtoken'],
            'Content-Type': 'application/json'
        }

        if (sessionStorage['logged-user']) {
            headers['logged-user'] = sessionStorage['logged-user'];
        }

        return headers;
    };

    return {
        load: function (appKey, appSecret) {
            return new Headers(appKey, appSecret);
        }
    }
})();