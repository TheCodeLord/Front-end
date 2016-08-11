var app = app || {};

app.phoneModel = (function () {
    function PhoneModel(baseUrl, appKey, requester, headers) {
        this.baseUrl = baseUrl + 'appdata/' + appKey + '/Phones/';
        this.requester = requester;
        this.headers = headers;
    }

    PhoneModel.prototype.getUserPhones = function () {
        return this.requester.get(this.baseUrl, this.headers.getHeadersUserAuth());
    };

    PhoneModel.prototype.addPhone = function (person, number) {
        var data = {
            'person': person,
            'number': number
        };

        return this.requester.post(this.baseUrl, this.headers.getHeadersUserAuth(), data);
    };

    PhoneModel.prototype.editPhone = function (phoneId, person, number) {
        var serviceUrl = this.baseUrl + phoneId;
        var data = {
            'person': person,
            'number': number
        };

        return this.requester.put(serviceUrl, this.headers.getHeadersUserAuth(), data);
    };

    PhoneModel.prototype.deletePhone = function (phoneId) {
        var serviceUrl = this.baseUrl + phoneId;
        return this.requester.remove(serviceUrl, this.headers.getHeadersUserAuth());
    }

    return {
        load: function (baseUrl, appKey, requester, headers) {
            return new PhoneModel(baseUrl, appKey, requester, headers);
        }
    }
})();