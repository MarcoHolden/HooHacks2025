import os
from flask import Flask, jsonify, request
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from google import genai
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)

CORS(app, resources={r"/upload": {"origins": "http://localhost:3000"},
                     r"/quiz": {"origins": "http://localhost:3000"}})

# Secret key for session management (Not used for session, just for CSRF protection)
app.secret_key = os.getenv('SECRET_KEY')

# Configurations
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'txt', 'pdf', 'docx'}
client = genai.Client(api_key="AIzaSyCKw3QNq_ytED9DWxt6yXIX0EUWuGDRj-U")

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
        file.save(file_path)
        
        # Process the file (read the content)
        with open(file_path, 'r') as f:
            file_content = f.read()

        # Call functions to process the content
        summary = generate_summary(file_content)
        quiz = generate_quiz(file_content)
        multiple_choice_questions = generate_multiple_choice_questions(file_content)

        return jsonify({
            "message": "File processed successfully",
            "file_content": file_content,  # Send the file content directly
            "summary": summary,
            "quiz": quiz,
            "multiple_choice_questions": multiple_choice_questions
        })
    
    return jsonify({"error": "Invalid file type"}), 400

# Function to summarize the file content
def generate_summary(file_content):
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=f"Please summarize the following content: {file_content}"
        )
        if response:
            return response.text.strip()
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
            return response.text.strip()
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
            multiple_choice_questions_html = response.text.strip()
            return multiple_choice_questions_html
        return "No multiple choice questions generated"
    except Exception as e:
        return f"Error generating MCQs: {str(e)}"

if __name__ == '__main__':
    app.run(debug=True)
