class SemanticNode:
    def __init__(self, type, value=None):
        self.type = type
        self.value = value
        self.children = []

    def add_child(self, node):
        self.children.append(node)

    def to_dict(self):
        print(f"Serializando nodo: {self.type}, valor: {self.value}, hijos: {len(self.children)}")
        return {
            "type": self.type,
            "value": self.value,
            "children": [child.to_dict() for child in self.children],
        }
