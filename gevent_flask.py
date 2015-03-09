#!/usr/bin/env python

from flask import Flask, json, jsonify, render_template, request, abort
from gevent.pywsgi import WSGIServer
from bson.objectid import ObjectId

from pymongo import Connection
from datetime import date, datetime

app = Flask(__name__)
@app.route("/")
def show_index():
	return render_template('index.html')
@app.route("/401")
def show_404():
	abort(404)
def default(self, o):
	if isinstance(o, ObjectId):
		return str(o)
	return json.JSONEncoder.default(self, o)
'''@app.route('/post/<int:post_id>')
def show_post(post_id):
	return 'Post %d' % post_id
@app.route('/tasks', methods=['GET', 'POST'])
def get_tasks():
	global tasks
	if request.method == 'POST':
		if not request.json:
			return 'no ok'
		jtasks = request.json['tasks']
		tasks = []
		for jtask in jtasks:
			task = {
				'title': jtask['title'],
				'isDone': jtask.get('isDone', False)
			}
			tasks.append(task)
		return 'ok, save %d' % len(tasks)
	else:
		return jsonify( { 'tasks': tasks } )

		return jsonify(status)
@app.route('/api/play/<int:track_id>')
def get_route():
	pass '''
@app.route('/api/queue')
def get_queue():
	return jsonify( { 'queue': [item for item in db.queue.find()] })
@app.route('/api/add', methods=['POST'])
def post_add():
	if request.method != 'POST':
		abort(404)
	item = request.json['item']
	db.queue.save(item)
	return 'ok'
@app.route('/api/get')
def post_get():
	item = db.queue.find().sort([("prioriy.id",1) , ("date", 1)])
	if (item.count() > 0):
		return jsonify( {'item':item[0]})
	else:
		return jsonify( {'item':0})
@app.route('/api/remove/<id>')
def post_remove(id):
	if (db.queue.remove({"_id":ObjectId(id)})):
		return jsonify({'result':'ok'})
	else:
		return jsonify({'result':'fail'})
if __name__ == "__main__":
	connection = Connection()
	db = connection.queue
	app.debug = True
	app.json_encoder.default=default
	http = WSGIServer(('', 5000), app)
	http.serve_forever()
