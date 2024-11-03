from flask import Flask, request, jsonify, send_from_directory
import os
from flask_cors import CORS
from semantic_tree import SemanticNode
from lexer import Lexer
from parser import Parser

app = Flask(__name__)
CORS(app)

# Define el directorio donde se guardarán los archivos
FILES_DIRECTORY = 'backend/files'

# Asegura que el directorio exista
os.makedirs(FILES_DIRECTORY, exist_ok=True)

@app.route('/create-file', methods=['POST'])
def create_file():
    data = request.get_json()
    file_name = data.get('fileName')

    if not file_name:
        return jsonify({"error": "El nombre del archivo es requerido."}), 400

    file_path = os.path.join(FILES_DIRECTORY, file_name)

    try:
        # Crea el archivo en blanco con el nombre proporcionado
        with open(file_path, 'w') as f:
            f.write("")  # Escribe contenido inicial si es necesario
        return jsonify({"message": f"Archivo '{file_name}' creado exitosamente."}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Nueva ruta para servir los archivos creados en backend/files
@app.route('/files/<path:filename>', methods=['GET'])
def get_file(filename):
    try:
        return send_from_directory(FILES_DIRECTORY, filename)
    except FileNotFoundError:
        return jsonify({"error": "Archivo no encontrado."}), 404

@app.route('/list-files', methods=['GET'])
def list_files():
    try:
        files = os.listdir(FILES_DIRECTORY)
        return jsonify({"files": files}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/save-file', methods=['POST'])
def save_file():
    data = request.get_json()
    file_name = data.get('fileName')
    content = data.get('content')

    if not file_name:
        return jsonify({"error": "El nombre del archivo es requerido."}), 400

    file_path = os.path.join(FILES_DIRECTORY, file_name)

    try:
        # Sobrescribe el archivo con el nuevo contenido
        with open(file_path, 'w') as f:
            f.write(content)
        return jsonify({"message": f"Archivo '{file_name}' guardado exitosamente."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Ruta para eliminar archivos
@app.route('/delete-file/<filename>', methods=['DELETE'])
def delete_file(filename):
    file_path = os.path.join(FILES_DIRECTORY, filename)

    try:
        os.remove(file_path)
        return jsonify({"message": f"Archivo '{filename}' eliminado exitosamente."}), 200
    except FileNotFoundError:
        return jsonify({"error": "Archivo no encontrado."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/analyze-code', methods=['POST'])
def analyze_code():
    data = request.get_json()
    code_content = data.get('content')

    if not code_content:
        return jsonify({"error": "No se recibió contenido de código."}), 400

    try:
        lexer = Lexer(code_content)
        tokens = lexer.tokenize()
        
        parser = Parser(tokens)
        parse_tree = parser.parse()
        
        # Convierte el árbol a un diccionario
        tree_repr = parse_tree.to_dict()
        file="tokens.txt"
        with open(file, "w") as f:
            f.write(str(tokens))
        # Imprime el árbol convertido en el backend para depuración
        print("Estructura del árbol:", tree_repr)
        
        return jsonify({"parseTree": tree_repr}), 200
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500





if __name__ == '__main__':
    app.run(debug=True)
