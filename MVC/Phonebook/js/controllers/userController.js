var app = app || {};

app.userController = (function () {
    function UserController(model, views) {
        this.model = model;
        this.viewBag = views;
    }

    UserController.prototype.loadLoginPage = function (selector) {
        this.viewBag.loginView.loadLoginView(selector, this);
    };

    UserController.prototype.loadRegistratinPage = function (selector) {
        this.viewBag.registrationView.loadRegistrationView(selector);
    };

    UserController.prototype.loadEditProfilePage = function (selector) {
        var data = {
            username: sessionStorage['username'],
            fullName: sessionStorage['fullName']
        };

        this.viewBag.editView.loadEditProfileView(selector, data);
    };

    UserController.prototype.register = function (username, password, fullName) {
        return this.model.register(username, password, fullName).then(
            function (data) {
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

    UserController.prototype.deleteUser = function (userId) {
        return this.model.deleteUser(userId);
    };

    UserController.prototype.editProfile = function (userId, username, passowrd, fullName, authtoken) {
        return this.model.edit(userId, username, passowrd, fullName, authtoken)
            .then(function (data) {
                deleteUserFromStorage();
                setSessionStorage(data);
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