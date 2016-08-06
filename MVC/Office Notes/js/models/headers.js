var app = app || {};

app.headers = (function () {
    function Headers(appKey, appSecret) {
        this.appKey = appKey;
        this.appSecret = appSecret;
    }

    Headers.prototype.getHeadersApp = function () {
        var headers = {
            'Authorization': 'Basic ' + btoa(this.appKey + ':' + this.appSecret),
            'Content-Type': 'application/json'
        }

        return headers;
    };

    Headers.prototype.getHeadersUserAuth = function () {
        var headers = {
            'Authorization': 'Kinvey ' + sessionStorage['authtoken'],
            'Content-Type': 'application/json'
        }

        return headers;
    };

    return {
        load: function (appKey, appSecret) {
            return new Headers(appKey, appSecret);
        }
    }
})();