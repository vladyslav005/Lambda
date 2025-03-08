import {HelpListItem} from "../../component/ListItem/HelpListItem";
import {CodeExample} from "./CodeExample";
import {useContext} from "react";
import {ConfigurationContext} from "../../../configurations/context/ConfigurationContext";
import translations from "../../../configurations/data/translations";

interface GrammarTutorialProps {
  title: string;
  description: string;
}

export const SyntaxTutorial = (props: GrammarTutorialProps) => {
  const confCtx = useContext(ConfigurationContext)

  return (
      <HelpListItem title={props.title} description={props.description}>
        <h1 className="title"
            dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.syntax.t1}}
        >

        </h1>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.syntax.t2}}
        >

        </p>

        <CodeExample code={`λ x : T . t  // Lambda abstraction (function definition)
λ _ : T . t  // Wildcard lambda (ignoring parameter name)
t1 t2  // Function application (calling a function)
fix t  // Fixpoint operator (used for recursion)`}></CodeExample>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.syntax.t3}}
        >

        </p>

        <CodeExample code={`if t1 then t2 else t3  // Conditional branching
if t1 then t2 else if t3 then t4 else t5  // Chained conditions
t1 + t2, t1 - t2, t1 * t2, t1 ^ t2  // Arithmetic operations
t1 > t2, t1 >= t2, t1 < t2, t1 <= t2, t1 == t2  // Comparisons`}></CodeExample>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.syntax.t4}}
        >

        </p>

        <CodeExample code={`[x = t] as T  // Injection of term t with type T
inl t as T | inr t as T  // Left and right injections for sum types

case t of [x = y] => t1 || [a = b] => t2  // Pattern matching for records
case t of inl x => t1 || inr y => t2  // Case analysis for binary variants`}></CodeExample>

        <h1 className="title"
            dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.syntax.t5}}
        >

        </h1>

        <CodeExample code={`Nat  // Natural numbers
Bool  // Boolean values (true, false)
Unit  // A unit type (only one value, unit)
T1 -> T2  // Function type
T1 * T2  // Tuple type
T1 + T2  // Binary variant type
List T  // List of elements of type T
< x1 : T1, x2 : T2 >  // Record type`}></CodeExample>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.syntax.t6}}
        >

        </p>

        <CodeExample code={`typedef X = T;  // Type alias definition
x : T;  // Declaring a variable with a type
x = t : T;  // Function or variable assignment`}></CodeExample>

        <h1 className="title"
            dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.syntax.t7}}
        >

        </h1>
        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.syntax.t8}}
        >

        </p>

        <CodeExample code={`0, 1, 2, 3  // Natural numbers
true, false  // Boolean values
unit  // The only value of Unit`}></CodeExample>

        <h1 className="title"
            dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.syntax.t9}}
        >

        </h1>
        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.syntax.t10}}
        >

        </p>

        <CodeExample code={`fix t`}></CodeExample>

        {/*<h1 className="title">Pattern Matching & Case Analysis</h1>*/}
        {/*<p className="paragraph">Lambda Calculus supports advanced pattern matching and case analysis, which can be used to destructure and handle different forms of data.</p>*/}

        {/*<CodeExample code={`case x of [a = 1] => "one" || [b = 2] => "two" || [c = 3] => "three"`}></CodeExample>*/}
        {/*<p className="paragraph">This matches <code>x</code> against various cases and executes the corresponding term.</p>*/}

        <h1 className="title"
            dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.syntax.t11}}
        >

        </h1>
        {/*<p className="paragraph">Lambda Calculus can also handle lists, enabling functional programming operations like list construction, checking for nil, and manipulating list elements.</p>*/}

        <CodeExample code={`NIL [Nat]  // ListNil
cons [Nat] 1 2  // ListCons
isnil [Nat] x  // ListIsNil
head [Nat] x  // ListHead
tail [Nat] x  // ListTail
[1, 2, 3]  // ListConstructor`}></CodeExample>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.syntax.t12}}
        >

        </p>

        <CodeExample code={`
t ::= t t                                   (Application)
    | t (> | >= | < | <= | ==) t            (Comparison)
    | t (+ | -) t                           (Addition)
    | t * t                                 (Multiplication)
    | t ^ t                                 (Power)
    | λ x : T . t (: T)?                    (Lambda Abstraction)
    | λ _ : T . t (: T)?                    (Wildcard)
    | if t then t (else if t then t)* (else t)? (If-Else)
    | x                                     (Variable)
    | fix t                                 (Fix)
    | c                                     (Literal)
    | [ID = t] as T                         (Injection)
    | (inl | inr) t as T                    (Left/Right Injection)
    | <ID = t (, x = t)*>                   (Record)
    | t . x                                 (Record Projection)
    | <t (, t)*>                            (Tuple)
    | t . n                                 (Tuple Projection)
    | list_op                               (List)
    | case t of [x = x] => t (|| [x = x] => t)*          (Case Of)
    | case t of (inl | inr) x => t || (inl | inr) x => t (Binary Case Of)
    | ( t )                                 (Parentheses)`
        }/>
        <CodeExample code={`
list_op ::= nil [T]                        (Nil)
          | cons [T] t t                   (Cons)
          | isnil [T] t                    (IsNil)
          | tail [T] t                     (Tail)
          | head [T] t                     (Head)
          | [t (, t)*]                     (List Constructor)`}/>
        <CodeExample code={`
T ::= ID | Nat | Bool | Unit               (Primitive type)
    | T -> T                               (Function Type)
    | T + T                                (Binary Variant Type)
    | [ID : T (, ID : T)*]                 (Variant Type)
    | <x : T (, ID : T)*>                  (Record Type)
    | T * T                                (Tuple Type)
    | List T                               (List Type)
    | ( T )                                (Parenthesized Type)`}/>
        <CodeExample code={`
v ::= N | 0                                (Natural Number)
    | true | True | false | False          (Boolean)
    | Unit | unit `}/>

        <CodeExample code={`
globalDecl ::= typedef ID = T;              (Type Alias)
             | ID : T;                     (Global Variable Declaration)
             | ID = t (: T)?;              (Global Function Declaration)`}/>
        <CodeExample code={`
terms ::= (t; t; ... (globalDecl)*)+       (Sequence)        
`}/>


      </HelpListItem>


  )
}
export default SyntaxTutorial;