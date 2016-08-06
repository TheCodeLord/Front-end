var app = app || {};

app.userModel = (function () {
    function UserModel(baseUrl, appKey, requester, headers) {
        this.baseUrl = baseUrl + 'user/' + appKey + '/';
        this.requester = requester;
        this.headers = headers;
    }

    UserModel.prototype.register = function (username, password, fullName) {
        var data = {
            'username': username,
            'password': password,
            'fullName': fullName
        }

        return this.requester.post(this.baseUrl, this.headers.getHeadersApp(), data);
    };

    UserModel.prototype.login = function (username, password) {
        var serviceUrl = this.baseUrl + 'login';

        var data = {
            'username': username,
            'password': password
        };

        return this.requester.post(serviceUrl, this.headers.getHeadersApp(), data);
    };

    UserModel.prototype.logout = function () {
        var serviceUrl = this.baseUrl + '_logout';
        return this.requester.post(serviceUrl, this.headers.getHeadersUserAuth());
    };

    return {
        load: function (baseUrl, appKey, requester, headers) {
            return new UserModel(baseUrl, appKey, requester, headers);
        }
    }
})();