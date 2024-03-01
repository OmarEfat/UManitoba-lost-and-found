import datetime, json
import google.generativeai as genai


from flask import Flask, jsonify, request 
from flask_cors import CORS

from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow


GOOGLE_API_KEY='AIzaSyAlCfjFEtoWVZ6ITvU0EtgW26twPI-596c'
 
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
        title = request.json['title']
        description = request.json['itemDescription']
        email_lost = request.json['contactEmail']
        place_lost = request.json['placeLost']
        date_lost = request.json['dateLost']

        lost_item = LostItem(title, place_lost, email_lost, date_lost, description)
        db.session.add(lost_item)
        db.session.commit()

        # Call process_json_objects() with title and description arguments
        matching_found_items = process_json_objects(title, description)
        print("Matching ", matching_found_items)
        
        return lost_item_schema.jsonify(lost_item)
    except Exception as e:
        print(e)
        print("Something is wrong when adding a lost item.")
        return jsonify({"error": "An error occurred while adding a lost item."}), 500



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
        return None





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






genai.configure(api_key=GOOGLE_API_KEY)

def isMatch(lost, found):
    result = False
    percent = evaluate_item_match(lost, found)
    if percent >= 50:
        result = True

    return result



def evaluate_item_match(lost, found):
    model = genai.GenerativeModel('gemini-pro')
    
    prompt = f"Given a lost item described as '{lost}' and a found item described as '{found}', " \
             f"evaluate the probability (as a percentage) that these items are a match. " \
             f"Consider that humans may not write accurate descriptions."\
             f"Check if the description describes the same object. If the objects are similar, consider checking the color and other details to evaluate their match. Color match is essential."\
             f"if you recieved an input garbage text or any empty text just return a 0"\
             f"Provide only the numerical probability."
    
    response = model.generate_content(prompt)
    
    probability_value = 1
    try:
        probability = response.text.strip().replace('%', '')
        probability_value = max(float(probability), 1)  
        
        print("This is the matching percentage: ", probability_value)
        print(" ")
    except (ValueError, AttributeError):
        pass
    
    return probability_value

# test_cases = [
#     ("black leather wallet", "found black wallet, seems to be leather"),
#     ("set of keys", "bunch of keys found with a red keychain"),
#     ("Samsung Galaxy S10 phone in a blue case", "blue smartphone found, looks like an Android"),
#     ("Ray-Ban sunglasses", "found sunglasses, brand is Ray-Ban"),
#     ("silver necklace", "found a necklace, appears to be gold"),
#     ("white Adidas sneakers size 10", "black Nike sneakers found, size 9"),
#     ("laptop charger", "USB-C laptop charger found"),
#     ("Harry Potter book", "found a book, cover says Lord of the Rings"),
#     ("water bottle, blue, 1 liter", "small green water bottle found"),
#     ("", ""),  # Empty descriptions
#     ("black watch with a leather strap", "A watch with a black strap and metal band"),  # Similar but not exact match
#     ("red scarf", "found a piece of red fabric, could be a scarf or a bandana")  # Vague description
# ]





test_cases = [

   ("black phone ", " i found a phone while walking down the street across from engineering building, i think it was some type of bright color"),
   ("smart watch ", "smart phone"),
   ("android phone ", "ios phone "),
   ("balck hoodi", "black shirt"),
]


# for lost, found in test_cases:
#     print(f"Lost: '{lost}', Found: '{found}'")
#     match_probability = evaluate_item_match(lost, found)
#     print(f"Match Probability: {match_probability}%\n")




def process_json_objects(title, description):
    all_found_items = FoundItem.query.all()
    list_found_json = found_items_schema.dump(all_found_items)

    json_object_list = []

    for found_item in list_found_json:
        found_description = found_item["description"]
        found_title = found_item["title"]
        combined_main = f"{found_title} {found_description}"

        if combined_main is not None:
            combined_user_input = f"{title} {description}"
            if isMatch(combined_user_input, combined_main):
                found_item["place_handed"] = found_item["place_handed"]
                json_object_list.append(found_item)
    with open('redirectedPage.js', 'w') as json_file:
        json.dump(json_object_list, json_file)

    return json_object_list


    

# main_json = {

#     "title": "iphone",
#     "description": "black phone"
# }

# Define a list of JSON objects
# json_list = [
#     {
#         "title": "tv",
#         "description": "black tv"
#     },
#     {
#         "title": "phone",
#         "description": "dark colored phone"
#     },
#     {
#         "title": "smart phone",
#         "description": "dark colored phone"
#     },
#     {
#         "title": "phone",
#         "description": "dark colored smart phone"
#     },
#     {
#         "title": "phone",
#         "description": "android phone"
#     },
#     {
#         "title": "phone",
#         "description": "blue colored iphone"
#     }

# ]










if __name__ == "__main__":
   # with app.app_context():
        app.run(debug=True)
