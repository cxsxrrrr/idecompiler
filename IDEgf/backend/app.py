<<<<<<< HEAD
from flask import Flask, request, jsonify
import os
from flask_cors import CORS
=======
import os
from flask import Flask, request, jsonify
from flask_cors import CORS 

>>>>>>> dockerized
app = Flask(__name__)
CORS(app) 

# Define el directorio donde se guardarán los archivos
FILES_DIRECTORY = 'backend/files'

# Asegúrate de que el directorio exista
os.makedirs(FILES_DIRECTORY, exist_ok=True)

<<<<<<< HEAD
=======


>>>>>>> dockerized
@app.route('/create-file', methods=['POST'])
def create_file():
    data = request.get_json()
    file_name = data.get('fileName')

    if not file_name:
        return jsonify({"error": "El nombre del archivo es requerido."}), 400

    # Ya no verificamos la extensión del archivo
    file_path = os.path.join(FILES_DIRECTORY, file_name)

    try:
        # Crea el archivo en blanco con el nombre proporcionado
        with open(file_path, 'w') as f:
            f.write("")  # Escribe contenido inicial si es necesario
        return jsonify({"message": f"Archivo '{file_name}' creado exitosamente."}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
<<<<<<< HEAD
    app.run(debug=True)
=======
    app.run(debug=True)
>>>>>>> dockerized
