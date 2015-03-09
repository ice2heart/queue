#!/usr/bin/env python

from flask import Flask, jsonify, render_template, request, abort
from gevent.pywsgi import WSGIServer

from datetime import date, datetime

app = Flask(__name__)
queue = []
@app.route("/")
def show_index():
	return render_template('index.html')
@app.route("/401")
def show_404():
	abort(404)
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
	global queue
	return jsonify( { 'queue': queue} )
# "name":self.newName(), "prioriy":self.newPriority(), "date":Date() }
@app.route('/api/add', methods=['POST'])
def post_add():
	global queue
	if request.method != 'POST':
		abort(404)
	item = request.json['item']
	queue.append(item)
	print(item['date'])
	print(datetime.fromtimestamp((item['date'])))
	return 'ok'
@app.route('/api/get')
def post_get():
	global queue
	result = []
	if (len(queue) == 0):
		return jsonify( { 'item':''})
	sortedQueue = sorted(queue, key=lambda x:x['date'])
	return jsonify( {'item':sortedQueue[0]})
if __name__ == "__main__":
	app.debug = True
	http = WSGIServer(('', 5000), app)
	http.serve_forever()
