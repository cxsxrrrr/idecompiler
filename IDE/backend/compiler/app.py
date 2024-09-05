from compiler import main as compile_code  # Importa tu compilador
from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os


app = Flask(__name__)
CORS(app)  # Habilita CORS

@app.route('/compile', methods=['POST'])
def compile_code_from_text():
    data = request.get_json()
    code = data.get('code', '')

    if not code:
        return jsonify({"error": "No code provided"}), 400

    # Guardar el código en un archivo temporal .mgs
    with open('temp.mgs', 'w') as f:
        f.write(code)

    try:
        # Compilar usando tu compilador Python
        compile_code('temp.mgs')

        # Ejecutar el comando de Clang para generar el ejecutable
        result = subprocess.run(['clang', '-o', 'output.exe', 'output.ll'], capture_output=True, text=True)

        if result.returncode != 0:
            return jsonify({"error": result.stderr}), 400

        # Aquí puedes simular la salida del programa compilado
        # Como no puedes ejecutar output.exe directamente desde el navegador,
        # vamos a simular un mensaje de éxito
        simulated_output = "Program compiled successfully! This is a simulation of its execution."

        return jsonify({"message": "Compilation successful", "output": simulated_output}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
