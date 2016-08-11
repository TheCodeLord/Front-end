var app = app || {};

app.userViews = (function () {
    function UserViews() {
        this.registrationView = {
            loadRegistrationView: loadRegistrationView
        };
        this.loginView = {
            loadLoginView: loadLoginView
        };
        this.editView = {
            loadEditProfileView: loadEditProfileView
        };
    }

    function loadRegistrationView(selector) {
        $.get('templates/registration.html', function (template) {
            var outHtml = Mustache.render(template);
            $(selector).html(outHtml);
        }).then(function () {
            $('#registerBtn').on('click', function () {
                var username = $('#username').val(),
                    password = $('#password').val(),
                    fullName = $('#fullName').val();

                $.sammy(function () {
                    this.trigger('register', { username: username, password: password, fullName: fullName });
                });

                return false; //Escaping the link href redirect (<a href='#'>).
            });
        });
    }
    
    function loadLoginView(selecor) {
        $.get('templates/login.html', function (template) {
            var outHtml = Mustache.render(template);
            $(selecor).html(outHtml);
        }).then(function () {
            $('#loginBtn').on('click', function () {
                var username = $('#username').val(),
                    password = $('#password').val();

                $.sammy(function () {
                    this.trigger('login', { username: username, password: password });
                });

                return false; //Escaping the link href redirect (<a href='#'>).
            });
        });
    }

    function loadEditProfileView(selector, data) {
        $.get('templates/edit-user-profile.html', function (template) {
            var outHtml = Mustache.render(template, data);
            $(selector).html(outHtml);
        }).then(function () {
            $('#editBtn').on('click', function () {
                var username = $('#username').val(),
                    password = $('#password').val(),
                    fullName = $('#fullName').val();

                $.sammy(function () {
                    this.trigger('edit-profile', { username: username, password: password, fullName: fullName });
                });

                return false; //Escaping the link href redirect (<a href='#'>).
            });
        });
    }

    return {
        load: function () {
            return new UserViews();
        }
    }
})();