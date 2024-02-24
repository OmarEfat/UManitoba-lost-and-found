import datetime
from flask import Flask, jsonify

from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

app = Flask(__name__)
app.app_context().push()
app.config["SQLALCHEMY_DATABASE_URI"] = 'mysql://root:''@127.0.0.1/lost_and_found_db'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


class LostItems(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))

    place_lost = db.Column(db.String(200))
    date_lost = db.Column(db.DateTime, default=datetime.datetime.now)
    email_lost = db.Column(db.String(100))
    description = db.Column(db.Text())
    
    
    def __init__(self, title, place_lost, email, desc, date):
        self.title=title
        self.place_lost=place_lost
        self.date_lost=date
        self.email_lost=email
        self.description=desc
        
class FoundItems(db.Model):
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))

    place_found = db.Column(db.String(200))
    place_handed = db.Column(db.String(200))
    date_found = db.Column(db.DateTime, default=datetime.datetime.now)
    email_found = db.Column(db.String(100))
    description = db.Column(db.Text())
    
    
    
    def __init__(self, title, place_found, email, desc, handed, date):
        self.title=title
        self.place_found=place_found
        self.place_handed=handed
        self.date_found=date
        self.email_found=email
        self.description=desc
        
        
class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    
    email = db.Column(db.String(100))
    
    def __init__(self, name, email ):
        self.name=name
        self.email=email

        
        

@app.route("/", methods=['GET'])
def get_lost_items():
    return jsonify({"Hello": "lost item"})


if __name__ == "__main__":
   # with app.app_context():
        app.run(debug=True)
