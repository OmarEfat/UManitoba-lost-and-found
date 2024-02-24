import datetime
from flask import Flask, jsonify, request 
from flask_cors import CORS

from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

app = Flask(__name__)
CORS(app) 
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


class FoundItemSchema(ma.Schema):
    class Meta:
        fields= ('id', 'title', 'place_found', 'place_handed', 'email_lost', 'description' , 'date_found')

found_item_schema=FoundItemSchema()
found_items_schema=FoundItemSchema(many=True)



 
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
        description=request.json['itemDescription']
        email_lost=request.json['contactEmail']
        place_lost=request.json['placeLost']
        date_lost=request.json['dateLost']

        
        
        lost_item=LostItem(title, place_lost, email_lost,date_lost, description)

        db.session.add(lost_item)
        
        db.session.commit()
        
        return    lost_item_schema.jsonify(lost_item)
    except Exception as e:
        print(e)
        print("Something is worng when adding lost item.")
        return None


@app.route("/add_found_item", methods=['POST'])
def add_found_item():
    try:
        title=request.json['title']
        description=request.json['itemDescription']
        email_found=request.json['contactEmail']
        place_found=request.json['placeFound']
        place_handed=request.json['placeHanded']
        date_found=request.json['dateFound']
        
        found_item=FoundItem(title, place_found, email_found, place_handed, date_found, description)

        db.session.add(found_item)
        
        db.session.commit()
        
        return  found_item_schema.jsonify(found_item)
    except Exception as e:
        print(e)
        print("Something is worng when adding found item.")
        return





@app.route('/get_lost_items', methods=['GET'])
def get_lost_items():
    all_lost_items=LostItem.query.all()
    results=lost_items_schema.dump(all_lost_items)
    return jsonify(results)



@app.route('/get_found_items', methods=['GET'])
def get_found_items():
    all_found_items=FoundItem.query.all()
    results=found_items_schema.dump(all_found_items)
    return jsonify(results)



@app.route('/get_lost_item/<id>/',methods=['GET'])
def get_lost_item(id):
    lost_item=LostItem.query.get(id)
    return lost_item_schema.jsonify(lost_item)


@app.route('/get_found_item/<id>/',methods=['GET'])
def get_found_item(id):
    found_item=FoundItem.query.get(id)
    return found_item_schema.jsonify(found_item)



@app.route('/delete_lost_item/<id>/',methods=['DELETE'])
def delete_lost_item(id):
    lost_item=LostItem.query.get(id)
    
    db.session.delete(lost_item)
    db.session.commit()
    return lost_item_schema.jsonify(lost_item)



@app.route('/delete_found_item/<id>/',methods=['DELETE'])
def delete_found_item(id):
    found_item=FoundItem.query.get(id)
    
    db.session.delete(found_item)
    db.session.commit()
    return found_item_schema.jsonify(found_item)








if __name__ == "__main__":
   # with app.app_context():
        app.run(debug=True)
