var app = app || {};

app.noteModel = (function () {
    function NoteModel(baseUrl, appKey, requester, headers) {
        this.baseUrl = baseUrl + 'appdata/' + appKey + '/Notes/';
        this.requester = requester;
        this.headers = headers;
    }

    NoteModel.prototype.listDeadlineNotes = function (date) {
        var serviceUrl = this.baseUrl + '?query={"deadline":"' +
            date + '"}&limit=10&skip0';

        return this.requester.get(serviceUrl, this.headers.getHeadersUserAuth());
    };

    NoteModel.prototype.listUserNotes = function (userId) {
        var serviceUrl = this.baseUrl + '?query={"_acl.creator":"' +
            userId + '"}&limit=10&skip0';

        return this.requester.get(serviceUrl, this.headers.getHeadersUserAuth());
    };

    NoteModel.prototype.addNote = function (data) {
        return this.requester.post(this.baseUrl, this.headers.getHeadersUserAuth(),
            data);
    };

    NoteModel.prototype.editNote = function (noteId, data) {
        var serviceUrl = this.baseUrl + noteId;

        return this.requester.put(serviceUrl, this.headers.getHeadersUserAuth(),
            data);
    };

    NoteModel.prototype.deleteNote = function (noteId) {
        var serviceUrl = this.baseUrl + noteId;

        return this.requester.remove(serviceUrl, this.headers.getHeadersUserAuth());
    }

    return {
        load: function (baseUrl, appKey, requester, headers) {
            return new NoteModel(baseUrl, appKey, requester, headers);
        }
    }
})();