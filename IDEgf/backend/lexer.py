import re

KEYWORDS = {"false", "true", "null", "and", "funct", "if", "elif", "else", "not", "or", "in", "return", "while", "for"}
SYMBOLS = {"{": "LBRACE", "}": "RBRACE", "=": "ASSIGN", "==": "EQUALS",    "+": "PLUS", "-": "MINUS", "*": "MULTIPLY", "/": "DIVIDE", "**": "POWER"}

class Token:
    def __init__(self, type, value):
        self.type = type
        self.value = value

    def __repr__(self):
        return f"Token({self.type}, '{self.value}')"
    
    def to_dict(self):
        return {"type": self.type, "value": self.value}

class Lexer:
    def __init__(self, text):
        self.text = text
        self.position = 0

    def tokenize(self):
        tokens = []
        while self.position < len(self.text):
            current_char = self.text[self.position]

            if current_char.isspace():
                self.position += 1
            elif current_char.isalpha():
                token = self._process_identifier()
                tokens.append(token)
            elif current_char == "=":
                token = self._process_equals()
                tokens.append(token)
            elif current_char in "+-*/":
                token = self._process_operator()
                tokens.append(token)
            elif current_char in SYMBOLS:
                tokens.append(Token(SYMBOLS[current_char], current_char))
                self.position += 1
            elif current_char.isdigit() or (current_char == '-' and self.position + 1 < len(self.text) and self.text[self.position + 1].isdigit()):
                token = self._process_number()
                tokens.append(token)
            elif current_char == '"' or current_char == "'":
                token = self._process_string()
                tokens.append(token)
            else:
                raise ValueError(f"Caracter no reconocido: '{current_char}'")

        return tokens

    def _process_identifier(self):
        start = self.position
        while self.position < len(self.text) and self.text[self.position].isalnum():
            self.position += 1
        word = self.text[start:self.position]
        token_type = "KEYWORD" if word in KEYWORDS else "IDENTIFIER"
        return Token(token_type, word)

    def _process_equals(self):
        if self.position + 1 < len(self.text) and self.text[self.position + 1] == "=":
            self.position += 2
            return Token("EQUALS", "==")
        else:
            self.position += 1
            return Token("ASSIGN", "=")

    def _process_number(self):
        start = self.position
        if self.text[self.position] == '-':  # Manejar números negativos
            self.position += 1
        while self.position < len(self.text) and (self.text[self.position].isdigit() or self.text[self.position] == '.'):
            self.position += 1
        number = self.text[start:self.position]
        return Token("NUMBER", number)

    def _process_string(self):
        quote_type = self.text[self.position]
        self.position += 1  # Consume la comilla inicial
        start = self.position
        while self.position < len(self.text) and self.text[self.position] != quote_type:
            self.position += 1
        string_value = self.text[start:self.position]
        self.position += 1  # Consume la comilla final
        return Token("STRING", string_value)

    def _process_operator(self):
        if self.text[self.position:self.position + 2] == "**":
            self.position += 2
            return Token("POWER", "**")
        else:
            op = self.text[self.position]
            self.position += 1
            if op == '+':
                return Token("PLUS", "+")
            elif op == '-':
                return Token("MINUS", "-")
            elif op == '*':
                return Token("MULTIPLY", "*")
            elif op == '/':
                return Token("DIVIDE", "/")
