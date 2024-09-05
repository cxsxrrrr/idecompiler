; ModuleID = "my_module"
target triple = "unknown-unknown-unknown"
target datalayout = ""

define void @"main"()
{
entry:
  %"x" = alloca double
  store double 0x4014000000000000, double* %"x"
  %"y" = alloca double
  store double 0x4024000000000000, double* %"y"
  %"z" = alloca double
  store double 0x401c000000000000, double* %"z"
  %"x.1" = load double, double* %"x"
  %"y.1" = load double, double* %"y"
  %"addtmp" = fadd double %"x.1", %"y.1"
  %"z.1" = load double, double* %"z"
  %"addtmp.1" = fadd double %"addtmp", %"z.1"
  %".5" = bitcast [4 x i8]* @"fstr" to i8*
  %".6" = call i32 (i8*, ...) @"printf"(i8* %".5", double %"addtmp.1")
  ret void
}

declare i32 @"printf"(i8* %".1", ...)

@"fstr" = internal constant [4 x i8] c"%f\0a\00"