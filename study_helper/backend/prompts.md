//Prompts to pass to the ai at different phases of the interaction

## Free recall feedback:

prompt = f"""
You are an AI tutor evaluating a student's free recall attempt.

Here is the content they were trying to recall:
{summary}

Here is what they wrote from memory:
{user_recall}

Your task is to:
- Acknowledge what they remembered correctly (be encouraging)
- Gently point out key points that were missing or vague
- Suggest 2–3 important ideas they could add

Respond ONLY in the following JSON format:
{{
  "verdict": "...",  // One of: Excellent, Good, Partial, Needs Improvement
  "feedback": "...",  // A short summary of what they got and missed
  "missed_points": ["...", "..."]  // Short list of missing or weak content
}}
"""
### Following the feedback, ask user: can you recall about any of the terms now that I mentioned them? Yes or No

>> If yes, just repeat the free recall test and append the new response to the previous {user_recall} and send it to the AI again

>> If no, 1:Here is the original summary, wanna go through before answering question?
    >>Yes, then just show {summary}
    >>No, generate quiz on {summary}

## The generate quiz prompt:

prompt = f"""
You are an AI tutor trained in cognitive psychology.

The student has reviewed the following summary:
{summary}

Generate a quiz to test their understanding, based strictly on this content.

The quiz should include:
- 2 short-answer questions
- 1 multiple-choice question with 4 options
- 1 explanation question

Return only a valid JSON object using double quotes. Do not include any commentary or extra text.

Use this structure exactly:

{{
  "questions": [
    {{
      "type": "short_answer",
      "question": "...",
      "answer": "..."
    }},
    {{
      "type": "mcq",
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "correct": "..."
    }},
    {{
      "type": "explanation",
      "question": "...",
      "sample_answer": "..."
    }}
  ]
}}
"""
>>Store the answers as JSON abjects and pass them into an evaluator:
    >The evaluator provides feedback through AI as follows:
    f"""
You are an AI tutor evaluating a student's answer.

The student was studying this material:
{summary}

Question:
{question}

Correct/Expected Answer:
{expected_answer}

Student's Answer:
{user_answer}

Your task is to evaluate their response.
for MCQ and short show their answer as {verdict} and correct answer as {feedback}.
for longer questions, provide the feedback{verdict} by comparing their answer to expected answer,
and {feedback} by saying "here is a sample complete answer:{expected_answer}" 

Respond in JSON format:
{{
  "verdict": "...", 
  "feedback": "..."  
}}
"""

     