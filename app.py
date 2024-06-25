import sqlite3

from flask import *
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

tg_userid = 0
app.config['UPLOAD_FOLDER'] = 'static/mem_pics'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


@app.route('/')
def loadpage():
    # con = sqlite3.connect("db/users.db")
    # cur = con.cursor()
    #
    # cur.execute(
    #     f'''INSERT INTO users_id (id) VALUES({tg_userid}) ''')
    # con.commit()
    return render_template("loadpage.html")


@app.route('/edit', methods=['GET', 'POST'])
def index():
    image_url = None
    if request.method == 'POST':
        if 'file' not in request.files:
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            image_url = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    return render_template('imageeditor.html', image_url=image_url)


if __name__ == '__main__':
    app.run()
