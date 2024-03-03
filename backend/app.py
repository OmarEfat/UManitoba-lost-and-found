import datetime,json
import google.generativeai as genai
import re

from datetime import datetime, date

from flask import Flask, jsonify, request 
from flask_cors import CORS

from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow


MAX_TITLE=100
MAX_DESCRIPTION=1000
MAX_EMAIL=100
MIN_YEAR=1900
MAX_YEAR=2100


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
    title = db.Column(db.String(100))
    place_lost = db.Column(db.Text(), default="")
    date_lost = db.Column(db.DateTime, default=date.today())
    email_lost = db.Column(db.String(100))
    description = db.Column(db.Text())
    
    
    def __init__(self, title, place_lost, email, date, desc):
        self.title=title
        self.email_lost=email
        self.description=desc
        
        if place_lost is not None:
            self.place_lost=place_lost
        if date is not None:
            self.date_lost=date




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
    title = db.Column(db.String(100))

    place_found = db.Column(db.Text(),default="")
    place_handed = db.Column(db.Text())
    date_found = db.Column(db.DateTime, default=date.today())
    email_found = db.Column(db.String(100), default="")
    description = db.Column(db.Text())
    
    def __init__(self, title, place_found, email, handed, date,desc ):

    
        self.title=title

        self.place_handed=handed
        self.description=desc
        
        if place_found is not None:
             self.place_found=place_found
        
        if date is not None:
            self.date_found=date
        
        if email is not None:
            self.email_found=email
   
        
        
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
        required_fields=["title", "itemDescription", "contactEmail"]
        if all(field in request.json for field in required_fields):
            if (len(request.json["title"])<=MAX_TITLE 
                and len(request.json["itemDescription"])<=MAX_DESCRIPTION
                and  len(request.json["contactEmail"])<=MAX_EMAIL):
                
                    title = request.json['title']
                    description = request.json['itemDescription']
                    if is_valid_email(request.json['contactEmail']):
                         email_lost = request.json['contactEmail']
                    else:
                        return jsonify({"error": "Invalid email address"}), 400
                    
                    lost_item =""
                    place_lost=None
                    date_lost=None
                    
                    if "placeLost" in request.json:
                        place_lost = request.json['placeLost']
                    if "dateLost" in request.json:
                        if is_valid_date(request.json["dateLost"],MIN_YEAR, MAX_YEAR ):
                            date_lost = request.json['dateLost']
                        else:
                            return jsonify({"error": "Date is not valid."}), 400

                    lost_item = LostItem(title, place_lost, email_lost, date_lost, description)
                    
                    db.session.add(lost_item)
                    db.session.commit()

                    # Call process_json_objects() with title and description arguments
                    matching_found_items = process_json_objects(title, description)
                    print("Matching ", matching_found_items)
                    
                    return lost_item_schema.jsonify(lost_item)
            else:
                return jsonify({"error": "One or more fields exceed the maximum length."}), 400
                         
        else:
            return jsonify({"error": "One or more required fields do not exist."}), 400
        
    except Exception as e:
        print(e)
        print("Something is wrong when adding a lost item.")
        return jsonify({"error": "An error occurred while adding a lost item."}), 500
    finally:
        print("Add a lost item terminated gracefully.")



@app.route("/add_found_item", methods=['POST'])
def add_found_item():
    try:
        required_fields=["title", "itemDescription", "placeHanded"]
        if all(field in request.json.keys() for field in required_fields):
            if (len(request.json["title"])<=MAX_TITLE 
                and len(request.json["itemDescription"])<=MAX_DESCRIPTION
            ):
                
                title = request.json['title']
                description = request.json['itemDescription']
                place_handed = request.json['placeHanded']
       
                email_found=None
                place_found=None
                date_found=None
                
                if "contactEmail" in request.json.keys():
      
                    if len(request.json["contactEmail"])<=MAX_EMAIL and is_valid_email(request.json['contactEmail']):
                         email_found = request.json['contactEmail']
                    else:
                        return jsonify({"error": "Invalid email address."}), 400
                if "placeFound" in request.json.keys():
                     place_found = request.json['placeFound']
                if "dateFound" in request.json.keys():
                        if is_valid_date(request.json["dateFound"],MIN_YEAR, MAX_YEAR ):
                            date_found = request.json['dateFound']
                        else:
                            return jsonify({"error": "Date is not valid."}), 400

                found_item = FoundItem(
                    title, place_found, email_found, place_handed, date_found, description)

                db.session.add(found_item)
                db.session.commit()

                return found_item_schema.jsonify(found_item)
            else:
                return jsonify({"error": "One or more fields exceed the maximum length."}), 400
                                 
        else:
            return jsonify({"error": "One or more required fields do not exist."}), 400
        
    except Exception as e:
        print(e)
        print("Something is worng when adding found item.")
        return jsonify({"error": "An error occurred while processing the request."}), 500
    
    finally:
        print("Add a found item terminated gracefully.")





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




def is_valid_email(email):
    # Regular expression for basic email validation
    email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(email_regex, email) is not None

def is_valid_date(date_str, min_year, max_year, date_format='%Y-%m-%d'):
    try:
        date = datetime.strptime(date_str, date_format).date()
        today = date.today()
        return min_year <= date.year <= max_year and date <= today
    except ValueError:
        return False



if __name__ == "__main__":
   # with app.app_context():
        app.run(debug=True)
