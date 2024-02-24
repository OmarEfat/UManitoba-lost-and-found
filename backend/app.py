from flask import Flask, request, jsonify

app = Flask(__name__)

print("SERVER IS RUNNNNING")

# Assuming you're storing data in a simple list for demonstration purposes.
# In a real application, you would probably save this data to a database.
items = []

@app.route('/submit', methods=['POST'])
def submit_item():
    item_data = request.json
    items.append(item_data)
    print("Received item data:", item_data)  # This line prints the received data to the console
    return jsonify({"message": "Item submitted successfully", "data": item_data}), 201

@app.route('/items', methods=['GET'])
def get_items():
    return jsonify(items), 200

if __name__ == "__main__":
    app.run(debug=True)
