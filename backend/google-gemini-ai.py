import google.generativeai as genai

GOOGLE_API_KEY='AIzaSyAlCfjFEtoWVZ6ITvU0EtgW26twPI-596c'

genai.configure(api_key=GOOGLE_API_KEY)

def evaluate_item_match(lost, found):
    model = genai.GenerativeModel('gemini-pro')
    
    prompt = f"Given a lost item described as '{lost}' and a found item described as '{found}', " \
             f"evaluate the probability (as a percentage) that these items are a match. " \
             f"Can you consider that humans like make mistakes in descrption but you assume you are a worker in a lost and found department and matching between lost and found"\
             f"Check if the items are very similar or likely similar or possibily similar and give it score above 60% to ask the person who lost to check if its or not"\
             f"You are being used as an API for a website so if you recieved an input garbage text or any empty text just return a 0"\
             f"Provide only the numerical probability."
    
    response = model.generate_content(prompt)
    
    probability_value = 1
    try:
        probability = response.text.strip().replace('%', '')
        probability_value = max(float(probability), 1)  
    except (ValueError, AttributeError):
        pass
    
    return probability_value

test_cases = [
    ("black leather wallet", "found black wallet, seems to be leather"),
    ("set of keys", "bunch of keys found with a red keychain"),
    ("Samsung Galaxy S10 phone in a blue case", "blue smartphone found, looks like an Android"),
    ("Ray-Ban sunglasses", "found sunglasses, brand is Ray-Ban"),
    ("silver necklace", "found a necklace, appears to be gold"),
    ("white Adidas sneakers size 10", "black Nike sneakers found, size 9"),
    ("laptop charger", "USB-C laptop charger found"),
    ("Harry Potter book", "found a book, cover says Lord of the Rings"),
    ("water bottle, blue, 1 liter", "small green water bottle found"),
    ("", ""),  # Empty descriptions
    ("black watch with a leather strap", "A watch with a black strap and metal band"),  # Similar but not exact match
    ("red scarf", "found a piece of red fabric, could be a scarf or a bandana")  # Vague description
]

for lost, found in test_cases:
    print(f"Lost: '{lost}', Found: '{found}'")
    match_probability = evaluate_item_match(lost, found)
    print(f"Match Probability: {match_probability}%\n")