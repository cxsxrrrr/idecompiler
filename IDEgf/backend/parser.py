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
        elif self._is_expression():
            return self._parse_expression()
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
        left = SemanticNode("Operand", self._get_current_token().value)
        self.position += 1  # Consume el operando izquierdo

        operator_token = self._get_current_token()
        if operator_token and operator_token.type in {"EQUALS", "LESS", "LESSEQUAL", "GREATER", "GREATEREQUAL", "NOTEQUAL"}:
            operator_node = SemanticNode("Operator", operator_token.value)
            self.position += 1  # Consume el operador de comparación

            right = SemanticNode("Operand", self._get_current_token().value)
            self.position += 1  # Consume el operando derecho

            # Crear nodo de condición y agregar los nodos hijos
            condition_node = SemanticNode("Condition")
            condition_node.add_child(left)
            condition_node.add_child(operator_node)
            condition_node.add_child(right)
            return condition_node
        else:
            raise ValueError("Operador de comparación esperado (==, <, <=, >, >=, !=)")

    def _is_assignment(self):
        if (self._get_current_token().type == "IDENTIFIER" and
                self._peek_next_token().type == "ASSIGN"):
            return True
        return False

    def _parse_assignment(self):
        variable = self._get_current_token().value
        self.position += 1  # Consume el nombre de la variable
        self.position += 1  # Consume '='
        expression_node = self._parse_expression()  # Obtén el nodo de expresión completo
        assignment_node = SemanticNode("Assignment")  # Nodo sin valor directo
        assignment_node.add_child(SemanticNode("Identifier", variable))  # Nombre de variable como hijo
        assignment_node.add_child(expression_node)  # Expresión como hijo
        return assignment_node

    def _is_expression(self):
        return self._get_current_token().type in {"NUMBER", "IDENTIFIER", "PLUS", "MINUS", "MULTIPLY", "DIVIDE", "POWER"}

    def _parse_expression(self):
        node = self._parse_term()
        while self._get_current_token() and self._get_current_token().type in {"PLUS", "MINUS"}:
            operator = self._get_current_token()
            self.position += 1  # Consume operador
            right = self._parse_term()
            expr_node = SemanticNode(operator.type, operator.value)
            expr_node.add_child(node)
            expr_node.add_child(right)
            node = expr_node
        return node

    def _parse_term(self):
        node = self._parse_factor()
        while self._get_current_token() and self._get_current_token().type in {"MULTIPLY", "DIVIDE"}:
            operator = self._get_current_token()
            self.position += 1  # Consume operador
            right = self._parse_factor()

            # Verificación de división por cero en el parser
            if operator.type == "DIVIDE" and right.type == "NUMBER" and float(right.value) == 0:
                raise ZeroDivisionError("Error: división por cero en el parser.")

            term_node = SemanticNode(operator.type, operator.value)
            term_node.add_child(node)
            term_node.add_child(right)
            node = term_node
        return node

    def _parse_factor(self):
        node = self._parse_primary()
        while self._get_current_token() and self._get_current_token().type == "POWER":
            operator = self._get_current_token()
            self.position += 1  # Consume operador de potencia
            right = self._parse_primary()
            power_node = SemanticNode(operator.type, operator.value)
            power_node.add_child(node)
            power_node.add_child(right)
            node = power_node
        return node

    def _parse_primary(self):
        token = self._get_current_token()
        if token.type == "NUMBER":
            self.position += 1
            return SemanticNode("NUMBER", token.value)
        elif token.type == "IDENTIFIER":
            self.position += 1
            return SemanticNode("IDENTIFIER", token.value)
        elif token.type == "LPAREN":
            self.position += 1  # Consume '('
            node = self._parse_expression()
            if self._get_current_token().type != "RPAREN":
                raise ValueError("Se esperaba un parentesis de cierre ')'")
            self.position += 1  # Consume ')'
            return node
        else:
            raise ValueError(f"Unexpected token: {token}")
        

    def _get_current_token(self):
        if self.position < len(self.tokens):
            return self.tokens[self.position]
        return None

    def _peek_next_token(self):
        if self.position + 1 < len(self.tokens):
            return self.tokens[self.position + 1]
        return None
