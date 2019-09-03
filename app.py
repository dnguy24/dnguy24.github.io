from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("home.html")


@app.route("/about")
def about():
    return render_template("about.html")
@app.route('/user/<name>')
def show_user_profile(name):
    return render_template('tun.html', name = name)
@app.route('/hello/<user>')
def hello_name(user):
   return render_template('hello.html', name = user)
if __name__ == "__main__":
    app.run(debug=True)