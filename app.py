#!/usr/bin/env python

from flask import Flask, json, jsonify, render_template, request, abort
from gevent.pywsgi import WSGIServer
from bson.objectid import ObjectId

from pymongo import Connection


def default(self, o):
    if isinstance(o, ObjectId):
        return str(o)
    return json.JSONEncoder.default(self, o)

app = Flask(__name__)
connection = Connection()
db = connection.queue
app.json_encoder.default = default


@app.route("/")
def show_index():
    return render_template('index.html')


@app.route("/401")
def show_404():
    abort(404)


@app.route('/api/queue')
def get_queue():
    return jsonify({'queue': [item for item in db.queue.find()]})


@app.route('/api/add', methods=['POST'])
def post_add():
    if request.method != 'POST':
        abort(404)
    item = request.json['item']
    db.queue.save(item)
    return 'ok'


@app.route('/api/get')
def post_get():
    item = db.queue.find({'state': 'new'}).sort(
        [("prioriy.id", 1), ("date", 1)])
    if item.count() > 0:
        return jsonify({'item': item[0]})
    else:
        return jsonify({'item': 0})


@app.route('/api/update/<id>/<status>')
def post_update(id, status):
    db.queue.update({"_id": ObjectId(id)}, {"$set": {'state': status}})
    return jsonify({'result': 'ok'})


@app.route('/api/remove/<id>')
def post_remove(id):
    if db.queue.remove({"_id": ObjectId(id)}):
        return jsonify({'result': 'ok'})
    else:
        return jsonify({'result': 'fail'})


if __name__ == "__main__":
    app.debug = True
    http = WSGIServer(('', 5000), app)
    http.serve_forever()
