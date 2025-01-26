import {CharStream, CommonTokenStream} from "antlr4";
import {TypeChecker} from "../typechecker/TypeChecker";
import LambdaCalcParser, {ExpressionContext} from "../antlr/LambdaCalcParser";
import LambdaCalcLexer from "../antlr/LambdaCalcLexer";


const typeChecker = new TypeChecker();


test('case 1, application and using global variable', () => {
  const tree = parseInput(inputs[0]);
  typeChecker.visit(tree)
});

test('case 2, application using wrong types', () => {
  const tree = parseInput(inputs[1]);
  expect(() => typeChecker.visit(tree)).toThrow(
      new Error("Types mismatch: term 'y' expects argument of type 'α', but given argument 'z' is of type 'β'")
  );
});

test('case 3, application and using global variable with incorrect type', () => {
  const tree = parseInput(inputs[2]);
  typeChecker.visit(tree)
});

/* TODO:  */
// test('case 4, discarding ?unnecessary? parentheses, ', () => {
//   const tree = parseInput(inputs[3]);
//   typeChecker.visit(tree)
// });

test('case 5, invalid function declaration', () => {
  const tree = parseInput(inputs[4]);
  expect(() => typeChecker.visit(tree)).toThrow(
      new Error("Abstraction 'λy:α.z:α->α' has type 'α->β', that doesn't match declared type 'α->α'")
  );
});

test('case 6, using undefined variable', () => {
  const tree = parseInput(inputs[5]);
  expect(() => typeChecker.visit(tree)).toThrow(
      new Error("Undefined variable : 'v'")
  );
});

test('case 7, associativity of application', () => {
  const tree = parseInput(inputs[6]);
  typeChecker.visit(tree)
});

test('case 8, correctness of validation function declaration', () => {
  const tree = parseInput(inputs[7]);
  typeChecker.visit(tree)
});

test('case 9, multiple global variables and complex application', () => {
  const tree = parseInput(inputs[8]);
  typeChecker.visit(tree)
});

test('case 10, ?function application?', () => {
  const tree = parseInput(inputs[9]);
  typeChecker.visit(tree)
});

test('case 11, assigning result of application', () => {
  const tree = parseInput(inputs[10]);
  typeChecker.visit(tree)
});

test('case 12, bad using of app', () => {
  const tree = parseInput(inputs[11]);
  expect(() => typeChecker.visit(tree)).toThrow(
      new Error("'g' : has type 'Bool', that is not a function type, cant use application there")
  );
});


test('case 13, application using ProductType', () => {
  const tree = parseInput(inputs[12]);
  typeChecker.visit(tree)
});


test('case 14, application using projection', () => {
  const tree = parseInput(inputs[13]);
  typeChecker.visit(tree)
});

test('case 15, projection index out of range', () => {
  const tree = parseInput(inputs[14]);
  expect(() => typeChecker.visit(tree)).toThrow(
      new Error("Index '3' is out range for tuple 'x' of type 'A*B'")
  );
});

test('case 16, projection index out of range', () => {
  const tree = parseInput(inputs[15]);
  expect(() => typeChecker.visit(tree)).toThrow(
      new Error("Abstraction 'λx:A*B.x.2:(A*B)->A' has type '(A*B)->B', that doesn't match declared type '(A*B)->A'")
  );
});

test('case 17, abs using records', () => {
  const tree = parseInput(inputs[16]);
  typeChecker.visit(tree)
});

test('case 18, abs using record projection', () => {
  const tree = parseInput(inputs[17]);
  typeChecker.visit(tree)
});

test('case 19, duplicate label', () => {
  const tree = parseInput(inputs[18]);
  expect(() => typeChecker.visit(tree)).toThrow(
      new Error("Duplicate key 'u' in record")
  );
});

test('case 20, record has not key', () => {
  const tree = parseInput(inputs[19]);
  expect(() => typeChecker.visit(tree)).toThrow(
      new Error("Record 'a' has not key 'n'")
  );
});

function parseInput(input: string): ExpressionContext {

  const lexer = new LambdaCalcLexer(new CharStream(input));

  const tokens = new CommonTokenStream(lexer);

  const parser = new LambdaCalcParser(tokens);

  return parser.expression();
}

const inputs = [
  `
    x : α;
    z : β;
    M = λ y:α.y : α -> α;
    (λ y:α->α.(y x) : (α->α) -> α) M 
    `,

  `
    x : α;
    z : β;
    M = λ y:α.y : α -> α
    (λ y:α->α.(y z) : ( α -> α ) -> α) M 
    `,

  `
    w : α;
    z : β;
    M = λ y:α.y : α -> α;
    (λ y:α->α.( λ x:α.(y x) : α->α ) : (α->α) -> (α->α)) M w
    `,

  `
    x : α;
    z : β;
    M = λ y:α.y : α -> α;
    (λ y:α->α.y x) M 
    `,

  `
    x : α;
    z : β;
    M = λ y:α.z : α -> α;
    (λ y:α->α.y x) M 
    `,

  `
    x : α
    z : β
    M = λ y:α.v : α -> α
    (λ y:α->α.y x) M 
  `,
  `
    x : α;
    z : β;
    M = λ y:α->α.y : (α->α)->(α->α);
    N = λ x:α.x : α->α;
    M N x
    `,
  `
    w : α;
    z : β;
    M = λ y:α->α.(y w) : (α->α)->α;
    N = λ x:α.x : α->α;
    M N
    `,
  `
    a : α;
    b : β;
    c : γ;
    f = λ x:α.(λ y:β.(λ z:γ.x : γ -> α) : β -> γ -> α )  : α -> β -> γ -> α;
    f a b c
  `,
  `
    f : (α -> β) -> (α -> γ);
    g : α -> β;
    h : α;
    f g h
    `,
  `
    f : (α -> β) -> (α -> γ);
    g : α -> β;
    h : α;
    x = f g h :  γ;
    
    x
    `,
  `
    g : Bool ;
    d : Int ;
    g d
    `,
  `
    a : T * T;
    b = λ x : T * T.x  : (T * T) -> (T * T);
    
    b a
    `,
  `
    a : A * B;
    b = λ x : A * B. x.1  : (A * B) -> A;
    
    b a
    `,
  `
    a : A * B;
    b = λ x : A * B. x.3  : (A * B) -> A;
    
    b a
    `,
  `
    a : A * B;
    b = λ x : A * B. x.2  : (A * B) -> A;
    
    b a
    `,


  `
    a : <v : A, u : T>;
    b = λ x : <v : A, u : T>.x  : <v : A, u : T> -> <v : A, u : T>;
    
    b a
    `,

  `
    a : <v : A, u : T>;
    b = λ x : <v : A, u : T>. x.v  : <v : A, u : T> -> A;
    
    b a
    `,
  `
    a : <v : A, u : T, u: B>;
    
    a
    `,
  `
    a : <v : A, u : T>;
    
    a.n
    `,
]
