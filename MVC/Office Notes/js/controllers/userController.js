var app = app || {};

app.userController = (function () {
    function UserController(model, views) {
        this.model = model;
        this.viewBag = views;
    }

    UserController.prototype.loadLoginPage = function (selector) {
        this.viewBag.loginView.loadLoginView(selector);
    };

    UserController.prototype.loadRegisterPage = function (selector) {
        this.viewBag.registerView.loadRegisterView(selector);
    };

    UserController.prototype.register = function (username, password, fullName) {
        return this.model.register(username, password, fullName)
            .then(function (data) {
                setSessionStorage(data);
            });
    };

    UserController.prototype.login = function (username, password) {
        return this.model.login(username, password).then(function (data) {
            setSessionStorage(data);
        });
    };

    UserController.prototype.logout = function () {
        return this.model.logout().then(function () {
            deleteUserFromStorage();
        });
    };

    function setSessionStorage(data) {
        sessionStorage['username'] = data.username;
        sessionStorage['fullName'] = data.fullName;
        sessionStorage['userId'] = data._id;
        sessionStorage['authtoken'] = data._kmd.authtoken;
    }

    function deleteUserFromStorage() {
        delete sessionStorage['username'];
        delete sessionStorage['fullName'];
        delete sessionStorage['userId'];
        delete sessionStorage['authtoken'];
    }

    return {
        load: function (model, views) {
            return new UserController(model, views);
        }
    }
})();