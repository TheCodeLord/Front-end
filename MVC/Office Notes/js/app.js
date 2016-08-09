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
            var userId = sessionStorage['userId'];

            if (userId) {
                $('#menu').show();
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
            userController.logout();
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
            userController.login(data.username, data.password);
        });

        this.bind('register', function (e, data) {
            userController.register(data.username, data.password, data.fullName);
        });

        this.bind('addNote', function (e, data) {
            noteController.addNote(data.title, data.text, data.deadline);
        });

        this.bind('loadEditNotePage', function (e, data) {
            noteController.loadEditNotePage(selector, data);
        });

        this.bind('editNote', function (e, data) {
            noteController.editNote(data.noteId, data.title, data.text, data.deadline);
        });

        this.bind('loadDeleteNotePage', function (e, data) {
            noteController.loadDeleteNotePage(selector, data);
        });

        this.bind('deleteNote', function (e, data) {
            noteController.deleteNote(data.noteId);
        });
    });

    app.router.run('#/')
})();