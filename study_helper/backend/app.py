from google import genai
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

CORS(app)

# Configurations
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'txt', 'pdf', 'docx'}
client = genai.Client(api_key="AIzaSyBDm-2Jo9dVvZwHxSQFzzda2Ngo3N7PM5c")  # Replace with your actual Gemini API URL
# Helper function to check file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Upload endpoint to receive files
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        print(file_path)
        file.save(file_path)
        print(f"File saved to {file_path}")

        # Process the file (call gemini API or process content here)
        result = process_file_with_gemini(file_path)

        return jsonify({"message": "File processed", "result": result})
    
    return jsonify({"error": "Invalid file type"}), 400
@app.route('/recall', methods=['POST'])
def process_text():
    # Get the text from the request body
    data = request.get_json()
    text = data.get('text')

    if not text:
        return jsonify({"error": "No text provided"}), 400
    
    try:
        # Call Gemini API with the provided text
        response = client.models.generate_content(
            model="gemini-2.0-flash",  # Replace with the actual model you're using
            contents=text
        )

        if response:
            return jsonify({"result": response.text})  # Send the corrected text
        return jsonify({"error": "No response from Gemini API"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Function to process the file with Gemini model (or any AI model)
def process_file_with_gemini(file_path):
    # Read the file content
    with open(file_path, 'r') as file:
        file_content = file.read()
    
    try:
        # Use genai.Client to call the Gemini model
        response = client.models.generate_content(
            model="gemini-2.0-flash",  # Replace with the actual model you're using
            contents=file_content
        )

        # Return the response from Gemini API
        if response:
            return {"result": response.text}  # The text response from the Gemini API
        
        return {"error": "No response from Gemini API"}
    
    except Exception as e:
        return {"error": str(e)}

if __name__ == '__main__':
    app.run(debug=True)