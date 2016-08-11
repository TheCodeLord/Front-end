(function () {
    var appKey = 'kid_HyjNu4Cw',
        appSecret = '70b0119884c646c29cec36998c6aa03f',
        baseUrl = 'https://baas.kinvey.com/';

    var requester = app.requester.load();
    var headers = app.headers.load(appKey, appSecret);

    var userModel = app.userModel.load(baseUrl, appKey, requester, headers);
    var noteModel = app.noteModel.load(baseUrl, appKey, requester, headers);

    var homeViews = app.homeViews.load();
    var userViews = app.userViews.load();
    var noteViews = app.noteViews.load();

    var homeController = app.homeController.load(homeViews);
    var userController = app.userController.load(userModel, userViews);
    var noteController = app.noteController.load(noteModel, noteViews);

    app.router = Sammy(function () {
        var selector = '#container';

        this.before(function () {
            var userId = sessionStorage['userId'],
                username = sessionStorage['username'];

            if (userId) {
                $('#menu').show();
                $('#welcomeMenu').text('Welcome, ' + username);
            } else {
                $('#menu').hide();
            }
        });

        this.get('#/', function () {
            homeController.welcomeScreen(selector);
        });

        this.before('#/home/', function () {
            var userId = sessionStorage['userId'];

            if (!userId) {
                this.redirect('#/');
                return false;
            }
        });

        this.before('#/office/(.*?)', function (data) {
            var userId = sessionStorage['userId'],
                tokens = data.path.split('/'),
                page = tokens[tokens.length - 1];

            if (!userId) {
                this.redirect('#/');
                return false;
            }

            if (!page) {
                this.redirect('#/office/1');
            } else {
                this.redirect('#/office/' + page);
            }
        });

        this.before('#/myNotes/(.*?)', function (data) {
            var userId = sessionStorage['userId'],
                tokens = data.path.split('/'),
                page = tokens[tokens.length - 1];

            if (!userId) {
                this.redirect('#/');
                return false;
            }

            if (!page) {
                this.redirect('#/myNotes/1');
            } else {
                this.redirect('#/myNotes/' + page)
            }
            
        });

        this.before('#/addNote/', function () {
            var userId = sessionStorage['userId'];

            if (!userId) {
                this.redirect('#/');
                return false;
            }
        });

        this.before('#/editNote/', function () {
            var userId = sessionStorage['userId'];

            if (!userId) {
                this.redirect('#/');
                return false;
            }
        });

        this.before('#/deleteNote/', function () {
            var userId = sessionStorage['userId'];

            if (!userId) {
                this.redirect('#/');
                return false;
            }
        });

        this.before('#/logout/', function () {
            var userId = sessionStorage['userId'];

            if (!userId) {
                this.redirect('#/');
                return false;
            }
        });

        this.get('#/home/', function () {
            homeController.homeScreen(selector);
        });

        this.get('#/login/', function () {
            userController.loadLoginPage(selector);
        });

        this.get('#/logout/', function () {
            userController.logout()
                .then(function () {
                    app.router.setLocation('#/myNotes/');
                    showSuccessMessage('You have successfully logged out');
                }, function (error) {
                    app.router.setLocation('#/myNotes/');
                    showErrorMessage('Logout failed: ' + error.responseJSON.error);
                });
        });

        this.get('#/register/', function () {
            userController.loadRegisterPage(selector);
        });

        this.get('#/office/(.*?)', function (data) {
            var tokens = data.path.split('/'),
                page = tokens[tokens.length - 1];

            noteController.listOfficeNotes(selector, page);
        });

        this.get('#/myNotes/(.*?)', function (data) {
            var tokens = data.path.split('/'),
                page = tokens[tokens.length - 1];

            noteController.listUserNotes(selector, page);
        });

        this.get('#/addNote/', function () {
            noteController.loadAddNotePage(selector);
        });

        this.get('#/editNote/', function () { });

        this.get('#/deleteNote/', function () { });

        this.bind('login', function (e, data) {
            userController.login(data.username, data.password)
                .then(function () {
                    app.router.setLocation('#/home/');
                    showSuccessMessage('You have successfully logged in');
                }, function (error) {
                    app.router.setLocation('#/login/');
                    showErrorMessage('Login in failed: ' + error.responseJSON.error);
                });
        });

        this.bind('register', function (e, data) {
            if (!checkUserData(data)) {
                return;
            }

            userController.register(data.username, data.password, data.fullName)
                .then(function () {
                    app.router.setLocation('#/home/');
                    showSuccessMessage('You have successfully registered');
                }, function (error) {
                    app.router.setLocation('#/register/');
                    showErrorMessage('Register failed: ' + error.responseJSON.error);
                });
        });

        this.bind('addNote', function (e, data) {
            if (!checkNoteData(data)) {
                return;
            }

            noteController.addNote(data.title, data.text, data.deadline)
                .then(function () {
                    app.router.setLocation('#/myNotes/');
                    showSuccessMessage('You have added new note successfully');
                }, function (error) {
                    app.router.setLocation('#/myNotes/');
                    showErrorMessage('Adding note failed: ' + error.responseJSON.error);
                });
        });

        this.bind('loadEditNotePage', function (e, data) {
            noteController.loadEditNotePage(selector, data);
        });

        this.bind('editNote', function (e, data) {
            if (!checkNoteData(data)) {
                return;
            }

            noteController.editNote(data.noteId, data.title, data.text, data.deadline)
                .then(function () {
                    app.router.setLocation('#/myNotes/');
                    showSuccessMessage('You have successfully edited your note');
                }, function (error) {
                    app.router.setLocation('#/myNotes/');
                    showErrorMessage('Editing note failed: ' + error.responseJSON.error);
                });
        });

        this.bind('loadDeleteNotePage', function (e, data) {
            noteController.loadDeleteNotePage(selector, data);
        });

        this.bind('deleteNote', function (e, data) {
            noteController.deleteNote(data.noteId)
                .then(function () {
                    app.router.setLocation('#/myNotes/');
                    showSuccessMessage('You have successfully deleted your note');
                }, function (error) {
                    app.router.setLocation('#/myNotes/');
                    showErrorMessage('Deleting note failed: ' + error.responseJSON.error);
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
            showErrorMessage('Username cannot be less than 3 chars');
            return false;
        } else if (data.password.length < 3) {
            showErrorMessage('Password cannot be less than 3 chars');
            return false;
        } else if (data.fullName.length < 3) {
            showErrorMessage('Full name cannot be less than 3 chars');
            return false;
        }

        return true;
    }

    function checkNoteData(data) {
        if (data.title.length < 3) {
            showErrorMessage('Title cannot be less than 3 chars');
            return false;
        } else if (data.text.length < 3) {
            showErrorMessage('Text cannot be less than 3 chars');
            return false;
        } else if (data.deadline.length < 10 || data.deadline.length > 10) {
            showErrorMessage('Deadline must be in formar "DD/MM/YYYY"');
            return false;
        }

        return true;
    }
})();