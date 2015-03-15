function BItem(data) {
	this.id = ko.observable(data['_id']);
	this.name = ko.observable(data['name']);
	this.date = ko.observable( new Date(data['date']*1000));
	this.prioriy = ko.observable(data['prioriy']);
	this.state = ko.observable(data['state']);
	this.info = ko.observable(data['info']);
	this.text = ko.computed(function() {
		return 'Customer: ' + this.name() + ' Info: '+ this.info() + ' Priority:' + this.prioriy()['text'] + ' Status: '  + this.state();
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
		$.getJSON('/api/update/' + self.currentItem().id() + '/' + self.state[2], function(data){
			console.log(data);
		});
		self.currentItem(null);
		self.viewMode(self.modes[1]);
	}
	self.deleteItem = function (item){
		$.getJSON('/api/remove/' + item.id(), function(data){
			console.log(data);
		});
		self.updateQueue();
	}
	self.endWork = function (item){
		$.getJSON('/api/update/' + item.id() + '/' + self.state[3], function(data){
			console.log(data);
		});
		self.updateQueue();
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

