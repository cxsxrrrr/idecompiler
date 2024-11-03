from lexer import Lexer, Token
from semantic_tree import SemanticNode

class Parser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.position = 0

    def parse(self):
        ast_root = SemanticNode("Program")
        while self.position < len(self.tokens):
            start_position = self.position
            statement_node = self._parse_statement()
            
            if statement_node:
                ast_root.add_child(statement_node)
            elif self.position == start_position:
                # Evita bucles infinitos avanzando si no se pudo analizar un statement
                self.position += 1
        return ast_root

    def _parse_statement(self):
        current_token = self._get_current_token()
        if current_token and current_token.value == "if":
            return self._parse_if_statement()
        elif self._is_assignment():
            return self._parse_assignment()
        return None

    def _parse_if_statement(self):
        self.position += 1  # Consume 'if'
        condition = self._parse_condition()
        if_node = SemanticNode("IfStatement", condition)
        
        # Comprobamos si hay una llave de apertura
        if self._get_current_token().type == "LBRACE":
            self.position += 1  # Consume '{'
            while self.position < len(self.tokens) and self._get_current_token().type != "RBRACE":
                start_position = self.position
                statement = self._parse_statement()
                
                if statement:
                    if_node.add_child(statement)
                elif self.position == start_position:
                    # Evita bucles infinitos avanzando si no se encontró una declaración
                    self.position += 1
            
            if self._get_current_token() and self._get_current_token().type == "RBRACE":
                self.position += 1  # Consume '}'
            else:
                raise ValueError("Error: falta '}' para cerrar el bloque 'if'")
        
        return if_node

    def _parse_condition(self):
        left = self._get_current_token().value
        self.position += 1  # Consume variable o valor
        operator = self._get_current_token()
        if operator.type == "EQUALS":
            self.position += 1
            right = self._get_current_token().value
            self.position += 1
            # Devuelve una cadena en lugar de un nodo
            return f"{left} == {right}"
        else:
            raise ValueError("Operador de comparación esperado (==)")

    def _is_assignment(self):
        if (self._get_current_token().type == "IDENTIFIER" and
                self._peek_next_token().type == "ASSIGN"):
            return True
        return False

    def _parse_assignment(self):
        variable = self._get_current_token().value
        self.position += 1  # Consume el nombre de la variable
        self.position += 1  # Consume '='
        value = self._get_current_token().value
        self.position += 1  # Consume el valor
        return SemanticNode("Assignment", f"{variable} = {value}")

    def _get_current_token(self):
        if self.position < len(self.tokens):
            return self.tokens[self.position]
        return None

    def _peek_next_token(self):
        if self.position + 1 < len(self.tokens):
            return self.tokens[self.position + 1]
        return None
