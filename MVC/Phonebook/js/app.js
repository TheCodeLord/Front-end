(function () {
    var appKey = 'kid_SJnGdqiD',
        appSecret = 'c4162e642a2f44e0a2aaccd03238525b';
        baseUrl = 'https://baas.kinvey.com/';

    var headers = app.headers.load(appKey, appSecret);
    var requester = app.requester.load();

    var userModel = app.userModel.load(baseUrl, appKey, requester, headers);
    var phoneModel = app.phoneModel.load(baseUrl, appKey, requester, headers);

    var homeViews = app.homeViews.load();
    var userViews = app.userViews.load();
    var phoneViews = app.phoneViews.load();

    var userController = app.userController.load(userModel, userViews);
    var phoneController = app.phoneController.load(phoneModel, phoneViews);
    var homeController = app.homeController.load(homeViews);

    app.router = Sammy(function () {
        var selector = '#wrapper';

        this.before(function () {
            var userId = sessionStorage['userId'];

            if (userId) {
                $('#menu').show();
            } else {
                $('#menu').hide();
            }
        });

        this.before('#/', function () {
            var userId = sessionStorage['userId'];

            if (userId) {
                this.redirect('#/home/');
                return false;
            }
        });

        this.get('#/', function () {
            homeController.loadWelcomeScreen(selector);
        });

        this.before('#/login/', function () {
            var userId = sessionStorage['userId'];

            if (userId) {
                this.redirect('#/home/');
                return false;
            }
        });

        this.get('#/login/', function () {
            userController.loadLoginPage(selector);
        });

        this.before('#/register/', function () {
            var userId = sessionStorage['userId'];

            if (userId) {
                this.redirect('#/home/');
                return false;
            }
        });

        this.get('#/register/', function () {
            userController.loadRegistratinPage(selector);
        });

        this.before('#/edit-profile/', function () {
            var userId = sessionStorage['userId'];

            if (!userId) {
                showErrorMessage('Please login in first');
                this.redirect('#/');
                return false;
            }
        });

        this.get('#/edit-profile/', function () {
            userController.loadEditProfilePage(selector);
        });

        this.before('#/home/', function () {
            var userId = sessionStorage['userId'];

            if (!userId) {
                showErrorMessage('Please login in first');
                this.redirect('#/');
                return false;
            }
        });

        this.get('#/home/', function () {
            homeController.loadHomeScreen(selector);
        });

        this.before('#/logout/', function () {
            var userId = sessionStorage['userId'];

            if (!userId) {
                showErrorMessage('Please login in first');
                this.redirect('#/');
                return false;
            }
        });

        this.get('#/logout/', function () {
            userController.logout()
                .then(function () {
                    app.router.setLocation('#/');
                    showSuccessMessage('You have successfully logged out');
                });
        });

        this.before('#/phonebook/', function () {
            var userId = sessionStorage['userId'];

            if (!userId) {
                showErrorMessage('Please login in first');
                this.redirect('#/');
                return false;
            }
        });

        this.get('#/phonebook/', function () {
            phoneController.loadPhonebook(selector);
        });

        this.get('#/phonebook/add-phone/', function () {
            phoneController.loadAddPhone(selector);
        });

        this.get('#/phonebook/edit-phone/', function () { });

        this.get('#/phonebook/delete-phone/', function () { });

        this.bind('login', function (e, data) {
            userController.login(data.username, data.password)
                .then(function (data) {
                    app.router.setLocation('#/home/');
                    showSuccessMessage('You have successfully logged in');
                }, function (error) {
                    app.router.setLocation('#/login/');
                    showErrorMessage('Login failed: ' + error.responseJSON.error);
                });
        });

        this.bind('register', function (e, data) {
            if (!checkUserData(data)) {
                return;
            }

            userController.register(data.username, data.password, data.fullName)
                .then(function (data) {
                    app.router.setLocation('#/home/');
                    showSuccessMessage('You have successfully registered');
                }, function (error) {
                    app.router.setLocation('#/login/');
                    showErrorMessage('Register failed: ' + error.responseJSON.error);
                });
        });

        this.bind('edit-profile', function (e, data) {
            if (!checkUserData(data)) {
                return;
            }

            var userId = sessionStorage['userId'],
                authtoken = sessionStorage['authtoken'];

            userController.editProfile(userId, data.username, data.password, data.fullName, authtoken)
                .then(function () {
                    app.router.setLocation('#/home/');
                    showSuccessMessage('You have successfully edited your profile');
                }, function (error) {
                    app.router.setLocation('#/home/');
                    showErrorMessage('Editing your profile failed: ' + error.responseJSON.error);
                });
        });

        this.bind('add-phone', function (e, data) {
            if (!checkContactData(data)) {
                return;
            }

            phoneController.addPhone(data.person, data.number)
                .then(function () {
                    app.router.setLocation('#/phonebook/');
                    showSuccessMessage('You have successfully added new contact');
                }, function (error) {
                    app.router.setLocation('#/phonbook/add-phone/');
                    showErrorMessage('Adding new contact failed: ' + error.responseJSON.error);
                });
        });

        this.bind('load-edit-phone', function (e, data) {
            phoneController.loadEditPhone(selector, data);
        });

        this.bind('edit-phone', function (e, data) {
            if (!checkContactData(data)) {
                return;
            }

            phoneController.editPhone(data.phoneId, data.person, data.number)
                .then(function () {
                    app.router.setLocation('#/phonebook/');
                    showSuccessMessage('You have successfully edited your contact');
                }, function (error) {
                    app.router.setLocation('#/phonbook/');
                    showErrorMessage('Editing contact failed: ' + error.responseJSON.error);
                });
        });

        this.bind('load-delete-phone', function (e, data) {
            phoneController.loadDeletePhone(selector, data);
        });

        this.bind('delete-phone', function (e, data) {
            phoneController.deletePhone(data.phoneId)
                .then(function () {
                    app.router.setLocation('#/phonebook/');
                    showSuccessMessage('You have successfully deleted your contact');
                }, function (error) {
                    app.router.setLocation('#/phonbook/');
                    showErrorMessage('Deleting contact failed: ' + error.responseJSON.error);
                });
        });
    });

    app.router.run('#/');

    function showSuccessMessage(text) {
        noty({
            text: text,
            type: 'success',
            layout: 'topCenter',
            timeout: 1000
        });
    }

    function showErrorMessage(text) {
        noty({
            text: text,
            type: 'error',
            layout: 'topCenter',
            timeout: 2500
        });
    }

    function checkUserData(data) {
        if (data.username.length < 3) {
            showErrorMessage('Username cannot be less than 3 chars!');
            return false;
        } else if (data.password.length < 3) {
            showErrorMessage('Password cannot be less than 3 chars!');
            return false;
        } else if (data.fullName.length < 3) {
            showErrorMessage('Full name cannot be less than 3 chars!');
            return false;
        }

        return true;
    }

    function checkContactData(data) {
        if (data.person.length < 3) {
            showErrorMessage('Person name cannot be less than 3 chars!');
            return false;
        } else if (data.number.length < 3) {
            showErrorMessage('Person number cannot be less than 3 chars!');
            return false;
        }

        return true;
    }
})();