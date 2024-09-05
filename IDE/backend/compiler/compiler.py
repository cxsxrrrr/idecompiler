# compiler.py

from lexer import Lexer
from parser import Parser
from codegen import CodeGenerator

def main(filename):
    with open(filename, 'r') as file:
        code = file.read()

    lexer = Lexer(code)
    tokens = lexer.tokenize()

    parser = Parser(tokens)
    nodes = parser.parse()

    codegen = CodeGenerator()
    codegen.generate_code(nodes)

    with open("output.ll", "w") as output_file:
        output_file.write(str(codegen.module))
    print("Generated output.ll")
