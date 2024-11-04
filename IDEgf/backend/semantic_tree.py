class SemanticNode:
    def __init__(self, type, value=None):
        self.type = type
        self.value = value
        self.children = []

    def add_child(self, node):
        self.children.append(node)

    def to_dict(self):
        # Convertir valor si es otro nodo
        value_repr = self.value.to_dict() if isinstance(self.value, SemanticNode) else self.value

        # Serializar cada nodo hijo
        return {
            "type": self.type,
            "value": value_repr,
            "children": [child.to_dict() for child in self.children],
        }
    def evaluate(self):
        # Evaluar números
        if self.type == "NUMBER":
            return float(self.value) if '.' in self.value else int(self.value)     
        # Evaluar operaciones aritméticas
        elif self.type in {"PLUS", "MINUS", "MULTIPLY", "DIVIDE", "POWER"}:
            left_value = self.children[0].evaluate()
            right_value = self.children[1].evaluate()
            
            if self.type == "PLUS":
                return left_value + right_value
            elif self.type == "MINUS":
                return left_value - right_value
            elif self.type == "MULTIPLY":
                return left_value * right_value
            elif self.type == "DIVIDE":
                # Verificar división por cero
                if right_value == 0:
                    raise ZeroDivisionError("Error: división por cero.")
                return left_value / right_value
            elif self.type == "POWER":
                return left_value ** right_value
        else:
            # Manejo de otros tipos de nodos si es necesario
            raise ValueError(f"Tipo de nodo desconocido: {self.type}")
