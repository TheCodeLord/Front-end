var app = app || {};

app.phoneController = (function () {
    function PhoneController(model, views) {
        this.model = model;
        this.viewBag = views;
    }

    PhoneController.prototype.loadPhonebook = function (selector) {
        var _this = this;

        this.model.getUserPhones().then(function (dataArr) {
            var data = {
                result: []
            };

            dataArr.forEach(function (entry) {
                data.result.push(new Phone(entry.person, entry.number, entry._id));
            });

            _this.viewBag.phonebookView.loadPhonebookView(selector, data);
        });
    };
    
    PhoneController.prototype.loadAddPhone = function (selector) {
        this.viewBag.addPhoneView.loadAddPhoneView(selector);
    };

    PhoneController.prototype.loadEditPhone = function (selector, data) {
        this.viewBag.editPhoneView.loadEditPhoneView(selector, data);
    };

    PhoneController.prototype.loadDeletePhone = function (selector, data) {
        this.viewBag.deletePhoneView.loadDeletePhoneView(selector, data);
    };

    PhoneController.prototype.getUserPhones = function () {
        this.model.getUserPhones();
    };

    PhoneController.prototype.addPhone = function (person, number) {
        return this.model.addPhone(person, number);
    };

    PhoneController.prototype.editPhone = function (phoneId, person, number) {
        return this.model.editPhone(phoneId, person, number);
    };

    PhoneController.prototype.deletePhone = function (phoneId) {
        return this.model.deletePhone(phoneId);
    };

    return {
        load: function (model, views) {
            return new PhoneController(model, views);
        }
    }
})();