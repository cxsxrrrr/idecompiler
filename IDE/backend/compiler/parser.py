class Parser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.pos = 0
        self.current_token = tokens[self.pos]

    def consume(self, expected_type=None):
        token_type, token_value = self.current_token
        if expected_type and token_type != expected_type:
            raise Exception(f"Syntax error: expected {expected_type} but got {token_type}")
        self.pos += 1
        if self.pos < len(self.tokens):
            self.current_token = self.tokens[self.pos]
        return token_value

    def parse(self):
        nodes = []
        while self.pos < len(self.tokens):
            if self.current_token[0] == 'PRINT':
                nodes.append(self.parse_print())
            elif self.current_token[0] == 'ID':
                nodes.append(self.parse_assignment())
            elif self.current_token[0] == 'NEWLINE':  # Consume newlines
                self.consume('NEWLINE')
            else:
                raise Exception(f"Unexpected token: {self.current_token}")
        return nodes

    def parse_print(self):
        self.consume('PRINT')
        expr = self.parse_expression()
        return ('PRINT', expr)

    def parse_assignment(self):
        var_name = self.consume('ID')
        self.consume('ASSIGN')
        expr = self.parse_expression()
        return ('ASSIGN', var_name, expr)

    def parse_expression(self):
        lhs = self.parse_term()
        while self.current_token[0] == 'OP':
            op = self.consume('OP')
            rhs = self.parse_term()
            lhs = ('BINOP', lhs, op, rhs)
        return lhs

    def parse_term(self):
        token_type, token_value = self.current_token
        if token_type == 'NUMBER':
            self.consume('NUMBER')
            return ('NUMBER', token_value)
        elif token_type == 'ID':
            self.consume('ID')
            return ('ID', token_value)
        elif token_type == 'LPAREN':
            self.consume('LPAREN')
            expr = self.parse_expression()
            self.consume('RPAREN')
            return expr
        else:
            raise Exception(f"Unexpected token: {self.current_token}")
