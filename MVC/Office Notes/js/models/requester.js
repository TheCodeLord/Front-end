var app = app || {};

app.requester = (function () {
    function Requester() { }

    Requester.prototype.get = function (url, headers) {
        return makeRequest('GET', url, headers);
    };

    Requester.prototype.post = function (url, headers, data) {
        return makeRequest('POST', url, headers, data);
    };

    Requester.prototype.put = function (url, headers, data) {
        return makeRequest('PUT', url, headers, data);
    };

    Requester.prototype.remove = function (url, headers) {
        return makeRequest('DELETE', url, headers);
    };

    function makeRequest(method, url, headers, data) {
        var defer = Q.defer();

        $.ajax({
            method: method,
            url: url,
            headers: headers,
            data: JSON.stringify(data),
            success: function (data) {
                defer.resolve(data);
            },
            error: function (error) {
                defer.reject(error)
            }
        });

        return defer.promise;
    }

    return {
        load: function () {
            return new Requester();
        }
    }
})();