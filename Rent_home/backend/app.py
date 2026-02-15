from flask import Flask, render_template, request, redirect, url_for, session,flash
from werkzeug.utils import secure_filename
from datetime import datetime
import mysql.connector as c
import re
import os

app = Flask(__name__)

# database connection function
def get_db_connection():
    return c.connect(
        host="localhost",
        user="hirendra",
        password="Radhe",
        database="Renthome"
    )

def is_valid_email(email):
    pattern = r'^[^@]+@[^@]+\.[^@]+$'
    return re.match(pattern, email) is not None

def is_valid_password(password):
    return 4 <= len(password) <=8

@app.route("/")
def home():
    return redirect(url_for('homepage'))

#register
@app.route("/register", methods=["GET"])
def register_page():
    return render_template("login.html")

@app.route("/register", methods=["POST"])
def register():
    name = request.form.get("name", "").strip()
    email = request.form.get("email", "").strip().lower()
    password = request.form.get("password", "").strip()

    if not name:
        flash("Name cannot be empty", "error")
        return redirect(url_for("register_page"))
    if not email or not is_valid_email(email):
        flash("Invalid email format", "error")
        return redirect(url_for("register_page"))
    if not password or not is_valid_password(password):
        flash("Password must be between 4 and 8 characters", "error")
        return redirect(url_for("register_page"))

    db = get_db_connection()
    cur = db.cursor()

    cur.execute("SELECT * FROM users WHERE email=%s", (email,))
    if cur.fetchone():
        flash("Email already exists","error")
        cur.close()
        db.close()
        return redirect(url_for("register_page"))

    cur.execute("INSERT INTO users (name, email, password) VALUES (%s,%s,%s)",(name, email, password))
    db.commit()
    cur.close()
    db.close()

    flash("Registration successful, please login", "success")
    return redirect(url_for("login_page"))

#login
@app.route("/login", methods=["GET"])
def login_page():
    return render_template("login.html")

@app.route("/login", methods=["POST"])
def login():

    email = request.form.get("email", "").strip().lower()
    password = request.form.get("password", "").strip()

    if not email or not is_valid_email(email):
        flash("Invalid email format", "error")
        return redirect(url_for("login_page"))
    if not password or not is_valid_password(password):
        flash("Wrong password", "error")
        return redirect(url_for("login_page"))

    db = get_db_connection()
    cur = db.cursor(dictionary=True)
    cur.execute("SELECT name, email FROM users WHERE email=%s AND password=%s", (email, password))
    user = cur.fetchone()
    session['user'] = user
    cur.close()
    db.close()

    if user:
        session['user'] = user
        flash("login successful", "success")
        return redirect(url_for("citizen"))
    else:
        flash("Invalid email or password", "error")
        return redirect(url_for("login_page"))

@app.route("/logout")
def logout():
    session.pop('user', None)
    flash("logged out successfully.", "info")
    return redirect(url_for("login_page"))

@app.route("/homepage")
def homepage():
    if "user" not in session:
        return redirect(url_for("login_page"))
    user = session["user"]


    db = get_db_connection()
    cur = db.cursor(dictionary=True)
    cur.execute("SELECT * FROM reports WHERE user_id=%s ORDER BY created_at DESC", (user["id"],))
    reports = cur.fetchall()
    cur.execute("SELECT * FROM applications WHERE user_id=%s ORDER BY created_at DESC", (user["id"],))
    applications = cur.fetchall()
    cur.close()
    db.close()

    return render_template("citizen.html", user=user, reports=reports, applications=applications)

@app.route("/add_home", methods=["GET"])
def upload_page():
    return render_template("upload.html")

@app.route("/upload", methods=["POST"])
def upload():
    if "user" not in session:
        return redirect(url_for("login_page"))

    user_id = session["user"]["id"]
    name = request.form.get("name", "").strip()
    year = request.form.get('year')
    semester = request.form.get('semester')
    department = request.form.get('department')
    category = request.form.get('category')
    recipient = request.form.get('recipient')
    description = request.form.get('description')
    images = request.files.getlist('images')
    created_at = datetime.now()
    status = request.form.get('status', 'pending')

    if not category or not description:
        flash("Please provide a category and description.", "error")
        return redirect(url_for("citizen"))

    saved_paths = []
    for image in images:
        if image and image.filename:
            filename = secure_filename(image.filename)
            save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image.save(save_path)
            saved_paths.append(filename)


    db = get_db_connection()
    cur = db.cursor()
    cur.execute("INSERT INTO reports (name, user_id, year, semester, department, category, recipient, description, image_paths, created_at, status)"
                "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                (name, user_id, year, semester, department, category, recipient, description,','.join(saved_paths), created_at, status))
    db.commit()
    cur.close()
    db.close()

    if "notifications" not in session:
        session['notifications'] = []
    session['notifications'].append(f"Your issue '{category}' was submitted successfully!")

    return redirect(url_for("citizen"))


if __name__=="__main__":
    app.run(debug=True)
