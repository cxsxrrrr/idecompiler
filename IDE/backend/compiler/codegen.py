from llvmlite import ir, binding

class CodeGenerator:
    def __init__(self):
        self.module = ir.Module(name="my_module")
        self.builder = None
        self.printf = None
        self.named_values = {}

    def create_entry_block_alloca(self, name, typ):
        with self.builder.goto_entry_block():
            return self.builder.alloca(typ, name=name)

    def generate_code(self, nodes):
        func_type = ir.FunctionType(ir.VoidType(), [])
        main_function = ir.Function(self.module, func_type, name="main")
        block = main_function.append_basic_block(name="entry")
        self.builder = ir.IRBuilder(block)

        self.printf = ir.Function(self.module, ir.FunctionType(ir.IntType(32), [ir.PointerType(ir.IntType(8))], var_arg=True), name="printf")

        for node in nodes:
            self.generate_statement(node)

        self.builder.ret_void()

    def generate_statement(self, node):
        node_type = node[0]
        if node_type == 'PRINT':
            self.generate_print(node[1])
        elif node_type == 'ASSIGN':
            var_name, expr = node[1], node[2]
            value = self.generate_expression(expr)
            if var_name not in self.named_values:
                self.named_values[var_name] = self.create_entry_block_alloca(var_name, ir.DoubleType())
            self.builder.store(value, self.named_values[var_name])

    def generate_expression(self, expr):
        expr_type = expr[0]
        if expr_type == 'NUMBER':
            return ir.Constant(ir.DoubleType(), expr[1])
        elif expr_type == 'ID':
            return self.builder.load(self.named_values[expr[1]], expr[1])
        elif expr_type == 'BINOP':
            lhs = self.generate_expression(expr[1])
            op = expr[2]
            rhs = self.generate_expression(expr[3])
            if op == '+':
                return self.builder.fadd(lhs, rhs, name="addtmp")
            elif op == '-':
                return self.builder.fsub(lhs, rhs, name="subtmp")
            elif op == '*':
                return self.builder.fmul(lhs, rhs, name="multmp")
            elif op == '/':
                return self.builder.fdiv(lhs, rhs, name="divtmp")
        else:
            raise Exception(f"Unknown expression type: {expr_type}")

    def generate_print(self, expr):
        value = self.generate_expression(expr)
        fmt = "%f\n\0"
        c_fmt = ir.Constant(ir.ArrayType(ir.IntType(8), len(fmt)), bytearray(fmt.encode("utf8")))
        global_fmt = ir.GlobalVariable(self.module, c_fmt.type, name="fstr")
        global_fmt.linkage = 'internal'
        global_fmt.global_constant = True
        global_fmt.initializer = c_fmt
        fmt_ptr = self.builder.bitcast(global_fmt, ir.PointerType(ir.IntType(8)))
        self.builder.call(self.printf, [fmt_ptr, value])
