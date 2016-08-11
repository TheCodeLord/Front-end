var app = app || {};

app.phoneViews = (function () {
    function PhoneViews() {
        this.phonebookView = {
            loadPhonebookView: loadPhonebookView
        };
        this.addPhoneView = {
            loadAddPhoneView: loadAddphoneView
        };
        this.editPhoneView = {
            loadEditPhoneView: loadEditPhoneView
        };
        this.deletePhoneView = {
            loadDeletePhoneView: loadDeletePhoneView
        };
    }

    function loadPhonebookView(selector, data) {
        $.get('templates/phonebook.html', function (template) {
            var outHtml = Mustache.render(template, data);
            $(selector).html(outHtml);
        }).then(function () {
            $('.editBtn').on('click', function () {
                window.location.replace('#/phonebook/edit-phone/');
                var phoneId = $(this).parent().parent().attr('data-id'),
                    item = $(this).parent().parent();
                 
                var person = item.children(':nth-child(1)').text(),
                    number = item.children(':nth-child(2)').text();

                $.sammy(function () {
                    this.trigger('load-edit-phone', { phoneId: phoneId, person: person, number: number });
                });

                return false; //Escaping the link href redirect (<a href='#'>).
            });

            $('.deleteBtn').on('click', function () {
                window.location.replace('#/phonebook/delete-phone/');
                var phoneId = $(this).parent().parent().attr('data-id'),
                    item = $(this).parent().parent();

                var person = item.children(':nth-child(1)').text(),
                   number = item.children(':nth-child(2)').text();
                
                $.sammy(function () {
                    this.trigger('load-delete-phone', { phoneId: phoneId, person: person, number: number });
                });

                return false; //Escaping the link href redirect (<a href='#'>).
            });
        });
    }

    function loadAddphoneView(selector) {
        $.get('templates/add-phone.html', function (template) {
            var outHtml = Mustache.render(template);
            $(selector).html(outHtml);
        }).then(function (success) {
            $('#addBtn').on('click', function () {
                var person = $('#personName').val(),
                    number = $('#phoneNumber').val();

                $.sammy(function () {
                    this.trigger('add-phone', { person: person, number: number });
                });

                return false;
            });
        });
    }

    function loadEditPhoneView(selector, data) {
        $.get('templates/edit-phone.html', function (template) {
            var outHtml = Mustache.render(template, data);
            $(selector).html(outHtml);
        }).then(function (success) {
            $('#editBtn').on('click', function () {
                var phoneId = $(this).parent().parent().attr('data-id'),
                    person = $('#personName').val(),
                    number = $('#phoneNumber').val();

                $.sammy(function () {
                    this.trigger('edit-phone', { phoneId: phoneId, person: person, number: number });
                });

                return false; //Escaping the link href redirect (<a href='#'>).
            });
        });
    }

    function loadDeletePhoneView(selector, data) {
        $.get('templates/delete-phone.html', function (template) {
            var outHtml = Mustache.render(template, data);
            $(selector).html(outHtml);
        }).then(function (success) {
            $('#deleteBtn').on('click', function () {
                var phoneId = $(this).parent().parent().attr('data-id'),
                    person = $('#personName').val(),
                    number = $('#phoneNumber').val();

                $.sammy(function () {
                    this.trigger('delete-phone', { phoneId: phoneId });
                });

                return false; //Escaping the link href redirect (<a href='#'>).
            });
        });
    }

    return {
        load: function () {
            return new PhoneViews();
        }
    }
})();