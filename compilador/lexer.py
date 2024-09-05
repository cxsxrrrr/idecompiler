import re

class Lexer:
    def __init__(self, code):
        self.code = code
        self.tokens = []
        self.token_specification = [
            ('NUMBER',   r'\d+(\.\d*)?'),   # Números
            ('ID',       r'[A-Za-z_]\w*'),  # Identificadores
            ('ASSIGN',   r'='),             # Asignación
            ('OP',       r'[+\-*/]'),       # Operadores aritméticos
            ('LPAREN',   r'\('),            # Paréntesis izquierdo
            ('RPAREN',   r'\)'),            # Paréntesis derecho
            ('NEWLINE',  r'\n'),            # Fin de línea
            ('SKIP',     r'[ \t]+'),        # Espacios y tabulaciones
            ('MISMATCH', r'.'),             # Cualquier otro carácter
        ]

    def tokenize(self):
        token_re = '|'.join(f'(?P<{pair[0]}>{pair[1]})' for pair in self.token_specification)
        for mo in re.finditer(token_re, self.code):
            kind = mo.lastgroup
            value = mo.group()
            if kind == 'NUMBER':
                value = float(value) if '.' in value else int(value)
            elif kind == 'ID' and value == 'print':
                kind = 'PRINT'
            elif kind == 'SKIP':
                continue
            elif kind == 'MISMATCH':
                raise RuntimeError(f'Unexpected character: {value}')
            self.tokens.append((kind, value))
        return self.tokens
