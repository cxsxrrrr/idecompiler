from flask import Flask, request, jsonify
import os
from flask_cors import CORS
app = Flask(__name__)
CORS(app) 
# Define el directorio donde se guardarán los archivos
FILES_DIRECTORY = 'backend/files'

# Asegúrate de que el directorio exista
os.makedirs(FILES_DIRECTORY, exist_ok=True)

@app.route('/create-file', methods=['POST'])
def create_file():
    data = request.get_json()
    file_name = data.get('fileName')

    if not file_name:
        return jsonify({"error": "El nombre del archivo es requerido."}), 400

    # Asegúrate de que el nombre del archivo tenga la extensión
    if not file_name.endswith('.txt'):  # Cambia '.txt' por la extensión deseada
        return jsonify({"error": "El archivo debe tener una extensión válida (ejemplo: .txt)."}), 400

    file_path = os.path.join(FILES_DIRECTORY, file_name)

    try:
        with open(file_path, 'w') as f:
            f.write("")  # Escribe contenido inicial si es necesario
        return jsonify({"message": f"Archivo '{file_name}' creado exitosamente."}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
