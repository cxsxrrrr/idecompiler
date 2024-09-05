import google.generativeai as genai
import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS 

load_dotenv()
consumer_key = os.getenv('API_KEY')
genai.configure(api_key=consumer_key)

model = genai.GenerativeModel("gemini-1.5-flash")

chat = None  # Inicializa 'chat' como None globalmente

# Función para reiniciar el chat (si Gemini lo permite)
def reset_gemini_chat():
    global chat 
    chat = model.start_chat(
        history=[
            {"role": "user", "parts": "A partir de ahora eres un experto en todo campo de programacion y responderas a lo que te diga basado en ello. Solo responde con la solucion (el codigo completo) cuando te pidan un codigo, escribe comentarios sobre el codigo"},
        ]
    )

app = Flask(__name__)
CORS(app) 

@app.route('/index', methods=['GET'])
def index():
    return "Hello World!"  # Ensures the text is visible on the localhost/index


@app.route('/chat', methods=['POST'])
def chat_endpoint():
    global chat 
    data = request.get_json()
    user_message = data['message']

    if chat is None: 
        reset_gemini_chat()

    response_text = chat.send_message(user_message).text
    return jsonify({'response': response_text})

@app.route('/reset_chat', methods=['POST'])
def reset_chat_endpoint():
    try:
        reset_gemini_chat() 
        return jsonify({'success': True, 'message': 'Chat history reset successfully'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error resetting chat history: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)