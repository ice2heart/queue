#!/usr/bin/env python
from flask import Flask, jsonify, render_template, request, abort
from gevent.pywsgi import WSGIServer

app = Flask(__name__)
 
@app.route("/")
def show_index():
	return render_template('index.html')
@app.route("/401")
def show_404():
	abort(404)
@app.route('/post/<int:post_id>')
def show_post(post_id):
	# show the post with the given id, the id is an integer
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

if __name__ == "__main__":
	app.debug = True
	http = WSGIServer(('', 5000), app)
	http.serve_forever()
