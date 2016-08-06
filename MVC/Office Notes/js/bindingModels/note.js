var Note = (function () {
    function Note(title, text, author, deadline, noteId) {
        this.title = title;
        this.text = text;
        this.author = author;
        this.deadline = deadline;
        this.noteId = noteId;
    }

    return Note;
})();