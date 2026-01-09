import google.generativeai as genai

GOOGLE_API_KEY='AIzaSyAlCfjFEtoWVZ6ITvU0EtgW26twPI-596c'

genai.configure(api_key=GOOGLE_API_KEY)

def isMatch(lost, found):
    result = False
    percent = evaluate_item_match(lost, found)
    if percent >= 65:
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




def process_json_objects(main_json, json_list):
    main_description = main_json.get("description")
    main_title= main_json.get("title")
    combined_main = f"{main_title} {main_description}"

    json_object_list = []

    if combined_main is not None:
        for idx, json_obj in enumerate(json_list, start=1):
            title = json_obj.get("title")
            description = json_obj.get("description")
            combined_obj = f"{title} {description}"
            if combined_obj is not None:
                if isMatch(combined_main, combined_obj):
                    json_object_list.append(json_obj)
    return json_object_list

    

main_json = {

    "title": "iphone",
    "description": "black phone"
}

# Define a list of JSON objects
json_list = [
    {
        "title": "tv",
        "description": "black tv"
    },
    {
        "title": "phone",
        "description": "dark colored phone"
    }
]

matching_descriptions = process_json_objects(main_json, json_list)
print("Matching Descriptions:", matching_descriptions)
