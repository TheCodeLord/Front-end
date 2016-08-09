var app = app || {};

app.noteController = (function () {
    function NoteController(model, views) {
        this.model = model;
        this.viewBag = views;
    }

    NoteController.prototype.loadAddNotePage = function (selector) {
        this.viewBag.addNote.loadAddNoteView(selector);
    };

    NoteController.prototype.loadEditNotePage = function (selector, data) {
        this.viewBag.editNote.loadEditNoteView(selector, data);
    };

    NoteController.prototype.loadDeleteNotePage = function (selector, data) {
        this.viewBag.deleteNote.loadDeleteNoteView(selector, data);
    };

    NoteController.prototype.listOfficeNotes = function (selector, page) {
        var _this = this;
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }

        var date = dd + '/' + mm + '/' + yyyy;

        return this.model.listDeadlineNotes(date).then(function (dataArr) {
            var data = {
                result: []
            };

            dataArr.forEach(function (entry) {
                data.result.push(new Note(entry.title, entry.text,
                    entry.author, entry.deadline, entry._id));
            });

            _this.viewBag.userNotes.loadMyNotesView(selector, data, page);
        });
    };

    NoteController.prototype.listUserNotes = function (selector, page) {
        var _this = this;
        var userId = sessionStorage['userId'];

        return this.model.listUserNotes(userId).then(function (dataArr) {
            var data = {
                result: []
            };

            dataArr.forEach(function (entry) {
                data.result.push(new Note(entry.title, entry.text,
                    entry.author, entry.deadline, entry._id));
            });

            _this.viewBag.userNotes.loadMyNotesView(selector, data, page);
        });
    };

    NoteController.prototype.addNote = function (title, text, deadline) {
        var author = sessionStorage['username'];

        var data = {
            title: title,
            text: text,
            deadline: deadline,
            author: author
        };

        return this.model.addNote(data).then(function () {
            window.location.replace('#/myNotes/');
        }, function (error) {

        });
    };

    NoteController.prototype.editNote = function (noteId, title, text, deadline) {
        var author = sessionStorage['username'];

        var data = {
            title: title,
            text: text,
            deadline: deadline,
            author: author
        };

        return this.model.editNote(noteId, data).then(function (data) {
            window.location.replace('#/myNotes/');
        });
    };

    NoteController.prototype.deleteNote = function (noteId) {
        return this.model.deleteNote(noteId).then(function (data) {
            window.location.replace('#/myNotes/');
        });
    };

    return {
        load: function (model, views) {
            return new NoteController(model, views);
        }
    }
})();