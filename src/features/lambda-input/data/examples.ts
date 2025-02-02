const examples = [{
  name: "Application",
  code: `x : α;
y : α -> α;

M = λ f: α -> α . f : (α -> α) -> (α -> α);
N = λ x: α . x : α -> α;
P = λ g: α -> α . (g x) : (α -> α) -> α;
Q = λ h: α -> α . (h x) : (α -> α) -> α; 

(N (M N (P (y))));`
},
  {
    name: "Variants",
    code: `PhysicalAddr = < firstlast : String, addr : String> ;
VirtualAddr = <name : String, email : String>;
Addr = [physical : PhysicalAddr, virtual : VirtualAddr];

pa : PhysicalAddr;
a = [physical = pa] as Addr;

case a of
     [physical = x] => x.firstlast
  || [virtual = y] => y.name;`
  },
  {
    name: "Tuples",
    code: `var1 : A;
var2 : B;

tuple = <var1, var2> : A * B;

tuple; 
tuple.1; 
tuple.2;`
  }


];

export default examples;
