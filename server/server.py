from flask import Flask

app = Flask(__name__)

@app.route('/api/status')
def get_status():
    return {'status': 'online'}