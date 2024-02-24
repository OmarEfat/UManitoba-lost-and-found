import datetime
from flask import Flask, jsonify, request 

from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

app = Flask(__name__)
app.app_context().push()
app.config["SQLALCHEMY_DATABASE_URI"] = 'mysql://root:''@127.0.0.1/lost_and_found_db'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
ma =Marshmallow(app)

class LostItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    place_lost = db.Column(db.String(200))
    date_lost = db.Column(db.DateTime, default=datetime.datetime.now)
    email_lost = db.Column(db.String(100))
    description = db.Column(db.Text())
    
    
    def __init__(self, title, place_lost, email, date, desc):
        self.title=title
        self.place_lost=place_lost
        self.date_lost=date
        self.email_lost=email
        self.description=desc



class LostItemSchema(ma.Schema):
    class Meta:
        fields= ('id', 'title', 'place_lost', 'email_lost', 'description')

lost_item_schema=LostItemSchema()
lost_items_schema=LostItemSchema(many=True)

 
class FoundItem(db.Model):
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))

    place_found = db.Column(db.String(200))
    place_handed = db.Column(db.String(200))
    date_found = db.Column(db.DateTime, default=datetime.datetime.now)
    email_found = db.Column(db.String(100))
    description = db.Column(db.Text())
    
    def __init__(self, title, place_found, email, handed, date,desc ):
        self.title=title
        self.place_found=place_found
        self.place_handed=handed
        self.date_found=date
        self.email_found=email
        self.description=desc
        
        
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    
    email = db.Column(db.String(100))
    
    def __init__(self, name, email ):
        self.name=name
        self.email=email
        

@app.route("/", methods=['GET'])
def get_lost_item_draft():
    return jsonify({"Hello": "lost item"})




@app.route("/add_lost_item", methods=['POST'])
def add_lost_item():
    try:
        title=request.json['title']
        description=request.json['description']
        email_lost=request.json['email_lost']
        place_lost=request.json['place_lost']
        date_lost=request.json['date_lost']

        
        
        lost_item=LostItem(title, place_lost, email_lost,date_lost, description)

        db.session.add(lost_item)
        
        db.session.commit()
        
        return    lost_item_schema.jsonify(lost_item)
    except Exception as e:
        print(e)
        print("Something is worng when adding lost item.")
        return None





@app.route('/get_lost_items', methods=['GET'])
def get_lost_items():
    all_lost_items=LostItem.query.all()
    results=lost_items_schema.dump(all_lost_items)
    return jsonify(results)


@app.route('/get_lost_item/<id>/',methods=['GET'])
def get_lost_item(id):
    lost_item=LostItem.query.get(id)
    return lost_item_schema.jsonify(lost_item)








if __name__ == "__main__":
   # with app.app_context():
        app.run(debug=True)
