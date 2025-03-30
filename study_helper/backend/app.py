from google import genai
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


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
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        # Save the file temporarily
        filename = file.filename
        filepath = os.path.join("./uploads", filename)
        file.save(filepath)

        # Read the file content
        with open(filepath, 'r') as f:  # Assuming it's a text-based file, use 'r'. If it's binary, use 'rb'.
            file_content = f.read()

        # Call Gemini API to generate the summary
        gemini_response = client.models.generate_content(
            model="gemini-2.0-flash",  # Use the model that generates summaries, or replace it with another model if needed
            contents=f"Summarize the following text: {file_content}"  # Pass the file content with a prompt to summarize
        )

        if gemini_response:
            summary = gemini_response.text  # Extract the summary from the response

            # Delete the temporary file after processing
            os.remove(filepath)

            return jsonify({'summary': summary}), 200  # Return the summary as a response

        # If no summary is generated from Gemini API
        return jsonify({'error': 'No response from Gemini API'}), 500

    except Exception as e:
        # Delete the temporary file in case of error
        if os.path.exists(filepath):
            os.remove(filepath)

        return jsonify({'error': str(e)}), 500
    
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
# In Flask backend (inside process_file_with_gemini function)
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

        # Log the response from the Gemini model
        print("Gemini Response:", response)

        if response:
            return {"result": response.text}  # Assuming response.text contains the summary

        return {"error": "No response from Gemini API"}

    except Exception as e:
        print(f"Error in processing: {str(e)}")
        return {"error": str(e)}

if __name__ == '__main__':
    app.run(debug=True)