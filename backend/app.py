from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Habilitar CORS para permitir solicitudes desde otros orígenes

# Ruta para crear archivo
@app.route('/create-file', methods=['POST'])
def create_file():
    data = request.get_json()
    file_name = data.get('fileName', '')

    # Verificar si se proporcionó un nombre de archivo
    if not file_name:
        return jsonify({'error': 'El nombre del archivo es obligatorio'}), 400

    # Validar si el nombre tiene una extensión, de lo contrario asignar .txt
    if not '.' in file_name:
        file_name += '.txt'

    # Ruta donde se guardarán los archivos
    file_path = os.path.join('files', file_name)

    try:
        # Crear archivo vacío
        with open(file_path, 'w') as f:
            pass

        return jsonify({'message': f'Archivo {file_name} creado exitosamente'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Asegurarse de que el directorio "files" existe
    if not os.path.exists('files'):
        os.makedirs('files')

    app.run(debug=True)
