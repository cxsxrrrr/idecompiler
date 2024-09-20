; ModuleID = "my_module"
target triple = "unknown-unknown-unknown"
target datalayout = ""

define void @"main"()
{
entry:
  %"addtmp" = fadd double 0x4046000000000000, 0x4008000000000000
  %".2" = bitcast [4 x i8]* @"fstr" to i8*
  %".3" = call i32 (i8*, ...) @"printf"(i8* %".2", double %"addtmp")
  ret void
}

declare i32 @"printf"(i8* %".1", ...)

@"fstr" = internal constant [4 x i8] c"%f\0a\00"