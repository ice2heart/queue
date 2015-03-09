/*function PItem(data) {
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
    
    self.save = function() {
        $.ajax("/tasks", {
            data: ko.toJSON({ tasks: self.tasks }),
            type: "post", contentType: "application/json",
            success: function(result) { self.serverAnswer(result) }
        });
    };

    self.statusUpdate = function() {
        $.getJSON('/api/status', function(allData) {
            self.playStatus(allData);
        });
    }
    //Обновлялка состояния
    //setInterval(self.statusUpdate, 1000);
}
*/
function BItem(data) {
	this.id = ko.observable(data['_id']);
	this.name = ko.observable(data['name']);
	this.date = ko.observable( new Date(data['date']*1000));
	this.prioriy = ko.observable(data['prioriy']);
	this.state = ko.observable(data['state']);
	this.text = ko.computed(function() {
		return this.date() + ':' + this.name() + ';' + this.id() + this.prioriy() + this.state();
	}, this);
}
function BQueueViewModel() {
	var self = this;
	self.priorityType = [{'id':3, 'text':'low'}, {'id':	2, 'text':'hight'}, {'id':1, 'text':'vip'}];
	self.modes = ['add', 'queue', 'get'];
	self.state = ['new', 'wait', 'work', 'done'];
	self.viewMode = ko.observable(self.modes[1]);
	self.dbqueue = ko.observableArray([]);
	self.queueCount = ko.computed(function() {
		return self.dbqueue().length ;
	}, this);
	self.info = ko.observable();
	self.updateQueue = function () {
		$.getJSON('/api/queue', function(allData) {
			var mapped = $.map(allData['queue'], function(Item) {return new BItem(Item);});
			self.dbqueue(mapped);
		});
		self.viewMode(self.modes[1]);
	}
	self.newName = ko.observable();
	self.newPriority = ko.observable(self.priorityType[0]);
	self.newInfo = ko.observable();
	self.addData = function(){
		data = { "name":self.newName(), "prioriy":self.newPriority(), "date":(Date.now()/1000) , "info":self.newInfo(), 'state':self.state[0]};
		$.ajax('/api/add', {
			data: ko.toJSON({'item':data}),
			type: 'post', contentType: 'application/json',
			success: function(result, textStatus) { console.log(result); self.info('Add done!'); self.updateQueue(); },
			error: function(result, text, errorThrow) { self.info('add ' + text + ' '  + errorThrow); }
		});
	}
	self.currentItem = ko.observable();
	self.getItem = function(){
		$.getJSON('/api/get', function(allData) {
			console.log(typeof(allData['item']), allData['item']);
			if (typeof(allData['item']) == 'object')
				self.currentItem( new BItem(allData['item']));
		});
	}
	self.takeItem = function(){
		$.getJSON('/api/remove/' + self.currentItem().id(), function(data){
			console.log(data);
		});
		self.currentItem(null);
		self.viewMode(self.modes[1]);
	}
	self.clickId = function (id){
		//alert(id.id());
		self.getItem();
	}
	self.vieModeUpdate = ko.computed(function() {
		if (self.viewMode() == self.modes[1]){
			self.updateQueue();
        };
		if (self.viewMode() == self.modes[2]){
            self.getItem();
        };
	}, self);
}
//Вот этот кусок кода нужен для правильного старта нокаута
$( document ).ready( function() {
ko.applyBindings(new BQueueViewModel());

});

