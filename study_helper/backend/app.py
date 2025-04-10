from google import genai
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'txt', 'pdf', 'docx'}
client = genai.Client(api_key="AIzaSyCKw3QNq_ytED9DWxt6yXIX0EUWuGDRj-U") 
# Helper function to check file extensions
file_content = ""

# Helper function to check file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Upload endpoint to receive files
@app.route('/upload', methods=['POST'])
def upload_file():
    global file_content 
    
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        with open(file_path, 'r') as f:
            file_content = f.read()

      
        summary = generate_summary(file_content)
        quiz = generate_quiz(file_content)
        multiple_choice_questions = generate_multiple_choice_questions(file_content)

        return jsonify({
            "message": "File processed successfully",
            "summary": summary,
            "quiz": quiz,
            "multiple_choice_questions": multiple_choice_questions
        })
    
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
def generate_summary(file_content):
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=f"Please summarize the following content: {file_content}"
        )
        if response:
            return response.text.strip()  # Return the summary
        return "No summary generated"
    except Exception as e:
        return f"Error generating summary: {str(e)}"

# Function to generate a quiz based on the file content
def generate_quiz(file_content):
    try:

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=f"Please create a quiz based on the following content: {file_content}"
        )
        if response:
            return response.text.strip()  # Return the quiz
        return "No quiz generated"
    except Exception as e:
        return f"Error generating quiz: {str(e)}"

# Function to generate multiple choice questions based on the file content
def generate_multiple_choice_questions(file_content):
    try:
        prompt = f"""
        Based on the content below, create multiple-choice questions. Return the questions in the following HTML format:

        <h4><strong>Question X:</strong> [Question Text]</h4>
        <ul>
            <li>(a) [Answer Option 1]</li>
            <li>(b) [Answer Option 2]</li>
            <li>(c) [Answer Option 3]</li>
            <li>(d) [Answer Option 4]</li>
        </ul>

        Do NOT include any text or explanations, only HTML. 
        Ensure the HTML is properly structured, without any surrounding code block markers like '```html' or '```'.
        Content to base the questions on:
        {file_content}
        """

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )

        if response:
            # Ensure the response is in HTML format, strip any extra whitespace
            multiple_choice_questions_html = response.text.strip()

            return {
                "message": "File processed successfully",
                "multiple_choice_questions": multiple_choice_questions_html,
                "quiz": "Some Quiz Content",  
                "summary": "Summary of the text here." 
            }

    except Exception as e:
        return {"error": str(e)}


if __name__ == '__main__':
    app.run(debug=True)