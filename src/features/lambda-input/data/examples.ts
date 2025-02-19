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
    code: `typedef PhysicalAddr = < firstlast : String, addr : String> ;
typedef VirtualAddr = <name : String, email : String>;

typedef Addr = [physical : PhysicalAddr, virtual : VirtualAddr]; // define variant type

pa : PhysicalAddr;
a = [physical = pa] as Addr; // make injection

case a of                       // use case of construction injection
     [physical = x] => x.firstlast
  || [virtual = y] => y.name;`
  },
  {
    name: "Bianry variants",
    code: `typedef PhysicalAddr = < firstlast : String, addr : String>;
typedef VirtualAddr = <name : String, email : String>;

typedef Addr = PhysicalAddr + VirtualAddr; // define variant type

pa : PhysicalAddr;
a = inl pa as Addr; // make injection

case a of                // use case of construction injection
    inl x => x.firstlast
 || inr y => y.name;`
  },
  {
    name: "Tuples",
    code: `var1 : A;
var2 : B;

tuple = <var1, var2> : A * B;

tuple; 
tuple.1; 
tuple.2;`
  },
  {
    name: "Records",
    code: `typedef Human = <name: String, age: Nat>; // define type

john : Human; // define var of type 'Human'

john.name; john.age; // use record projection`
  },
  {
    name: "If condition",
    code: `typedef Human = <name: String, fullName: String, age: Nat>; // define type

john : Human; // define var of type 'Human'

showFullName = true : Bool;

if showFullName then 
    john.fullName
else 
    john.name
;`
  },
  {
    name: "Lists",
    code: `list = nil[A] : List A; // create an empty list

var : A;

list;

list = cons[A] var list; // add var to list

isnil[A] list; // check if list is empty

head[A] list; // get first element

tail[A] list; // get list without first element
`
  }


];

export default examples;
