var app = app || {};

app.noteViews = (function () {
    function NoteViews() {
        this.officeNote = {
            loadOfficeNotesView: loadOfficeNotesView
        };
        this.userNotes = {
            loadMyNotesView: loadMyNotesView
        };
        this.addNote = {
            loadAddNoteView: loadAddNoteView
        };
        this.editNote = {
            loadEditNoteView: loadEditNoteView
        };
        this.deleteNote = {
            loadDeleteNoteView: loadDeleteNoteView
        };
    }

    function loadOfficeNotesView(selector, data) {
        $.get('templates/officeNoteTemplate.html', function (template) {
            var outHtml = Mustache.render(template, data);
            $(selector).html(outHtml)});
    }

    function loadMyNotesView(selector, data) {
        $.get('templates/myNoteTemplate.html', function (template) {
            var outHtml = Mustache.render(template, data);
            $(selector).html(outHtml);
        }).then(function () {
            $('.edit').on('click', function () {
                window.location.replace('#/myNotes/edit/');
                var noteId = $(this).parent().attr('data-id');
                var item = $('li[data-id="' + noteId + '"]');

                var title = item.find('#title').text(),
                    text = item.find('#text').text(),
                    deadline = item.find('.deadline').text();

                $.sammy(function () {
                    this.trigger('loadEditNotePage', {
                        noteId: noteId,
                        title: title,
                        text: text,
                        deadline: deadline
                    });
                });

                return false;
            });

            $('.delete').on('click', function () {
                window.location.replace('#/myNotes/delete/');
                var noteId = $(this).parent().attr('data-id');
                var item = $('li[data-id="' + noteId + '"]');

                var title = item.find('#title').text(),
                    text = item.find('#text').text(),
                    deadline = item.find('.deadline').text();

                $.sammy(function () {
                    this.trigger('loadDeleteNotePage', {
                        noteId: noteId,
                        title: title,
                        text: text,
                        deadline: deadline
                    });
                });

                return false;
            });
        }, function (error) {
            console.error(error);
        });
    }

    function loadAddNoteView(selector) {
        $.get('templates/addNote.html', function (template) {
            var outHtml = Mustache.render(template);
            $(selector).html(outHtml);
        }).then(function () {
            $('#addNoteButton').on('click', function () {
                var title = $('#title').val(),
                    text = $('#text').val(),
                    deadline = $('#deadline').val();

                $.sammy(function () {
                    this.trigger('addNote', {
                        title: title,
                        text: text,
                        deadline: deadline
                    });
                });

                return false;
            });  
        });
    }

    function loadEditNoteView(selector, data) {
        $.get('templates/editNote.html', function (template) {
            var outHtml = Mustache.render(template, data);
            $(selector).html(outHtml);
        }).then(function () {
            $('#editNoteButton').on('click', function () {
                var noteId = $(this).parent().parent().attr('data-id');
                    title = $('#title').val(),
                    text = $('#text').val(),
                    deadline = $('#deadline').val();

                $.sammy(function () {
                    this.trigger('editNote', {
                        noteId: noteId,
                        title: title,
                        text: text,
                        deadline: deadline
                    });
                });
            });
        });
    }

    function loadDeleteNoteView(selector, data) {
        $.get('templates/deleteNote.html', function (template) {
            var outHtml = Mustache.render(template, data);
            $(selector).html(outHtml);
        }).then(function () {
            $('#deleteNoteButton').on('click', function () {
                var noteId = $(this).parent().parent().attr('data-id');

                $.sammy(function () {
                    this.trigger('deleteNote', { noteId: noteId });
                });
            });
        });
    }

    return {
        load: function () {
            return new NoteViews();
        }
    }
})();