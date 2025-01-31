const examples = [{
  name: "Application",
  code: `x : α;
y : α -> α;

M = λ f: α -> α . f : (α -> α) -> (α -> α);
N = λ x: α . x : α -> α;
P = λ g: α -> α . (g x) : (α -> α) -> α;
Q = λ h: α -> α . (h x) : (α -> α) -> α; 

(N (M N (P (y))));`
}];

export default examples;
