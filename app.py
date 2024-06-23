from flask import *

app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template("loadpage.html")


@app.route('/edit')
def imageeditor():
    return render_template("imageeditor.html")


if __name__ == '__main__':
    app.run()
