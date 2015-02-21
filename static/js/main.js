function PItem(data) {
	this.fileName = ko.observable(data['file']);
    this.fileTitle = ko.observable(data['title']);
    this.fileId = ko.observable(data['id']);
    this.fileId = ko.observable(data['track']);
    this.fileArtist = ko.observable(data['artist']);
    this.Name = ko.computed(function() {
        return  this.fileArtist() + ' - ' + this.fileTitle();
    }, this);
}

function TaskListViewModel() {
    // Data
    var self = this;
    self.playStatus = ko.observableArray([]);
    self.playlist = ko.observableArray([]);
    
    /*self.save = function() {
        $.ajax("/tasks", {
            data: ko.toJSON({ tasks: self.tasks }),
            type: "post", contentType: "application/json",
            success: function(result) { self.serverAnswer(result) }
        });
    };*/

    /*self.statusUpdate = function() {
        $.getJSON('/api/status', function(allData) {
            self.playStatus(allData);
        });
    }*/
    //Обновлялка состояния
    //setInterval(self.statusUpdate, 1000);
}

//Вот этот кусок кода нужен для правильного старта нокаута
$( document ).ready( function() {
ko.applyBindings(new TaskListViewModel());

});

