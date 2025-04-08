import {HelpListItem} from "../../component/ListItem/HelpListItem";
import {CodeExample} from "./CodeExample";
import React, {useContext} from "react";
import {ConfigurationContext} from "../../../configurations/context/ConfigurationContext";
import translations from "../../../configurations/data/translations";
import {Cell, Column, Row, Tab, Table, TableBody, TableHeader, TabList, TabPanel, Tabs} from "react-aria-components";

interface GrammarTutorialProps {
  title: string;
  description: string;
}

export const SyntaxTutorial = (props: GrammarTutorialProps) => {
  const confCtx = useContext(ConfigurationContext)
  const keywords = [
    {label: "typedef", insertText: "typedef "},
    {label: "true", insertText: "true"},
    {label: "false", insertText: "false"},
    {label: "unit", insertText: "unit"},
    {label: "Unit", insertText: "Unit"},
    {label: "nil", insertText: "nil[$1]"},
    {label: "head", insertText: "head[$1]"},
    {label: "cons", insertText: "cons[$1]"},
    {label: "tail", insertText: "tail[$1]"},
    {label: "isnil", insertText: "isnil[$1]"},
  ];

  const specialSymbols = [
    {label: "\\abstraction", insertText: "λ x : T . (x) : T -> T"},
    {label: "\\to", insertText: "->"},
    {label: "\\Rightarrow", insertText: "=>"},
  ];

  const greekLetters = [
    {label: "\\alpha", insertText: "α"},
    {label: "\\beta", insertText: "β"},
    {label: "\\gamma", insertText: "γ"},
    {label: "\\delta", insertText: "δ"},
    {label: "\\epsilon", insertText: "ε"},
    {label: "\\zeta", insertText: "ζ"},
    {label: "\\eta", insertText: "η"},
    {label: "\\theta", insertText: "θ"},
    {label: "\\iota", insertText: "ι"},
    {label: "\\kappa", insertText: "κ"},
    {label: "\\lambda", insertText: "λ"},
    {label: "\\mu", insertText: "μ"},
    {label: "\\nu", insertText: "ν"},
    {label: "\\xi", insertText: "ξ"},
    {label: "\\omicron", insertText: "ο"},
    {label: "\\pi", insertText: "π"},
    {label: "\\rho", insertText: "ρ"},
    {label: "\\sigma", insertText: "σ"},
    {label: "\\tau", insertText: "τ"},
    {label: "\\upsilon", insertText: "υ"},
    {label: "\\phi", insertText: "φ"},
    {label: "\\chi", insertText: "χ"},
    {label: "\\psi", insertText: "ψ"},
    {label: "\\omega", insertText: "ω"},

    {label: "\\Alpha", insertText: "Α"},
    {label: "\\Beta", insertText: "Β"},
    {label: "\\Gamma", insertText: "Γ"},
    {label: "\\Delta", insertText: "Δ"},
    {label: "\\Epsilon", insertText: "Ε"},
    {label: "\\Zeta", insertText: "Ζ"},
    {label: "\\Eta", insertText: "Η"},
    {label: "\\Theta", insertText: "Θ"},
    {label: "\\Iota", insertText: "Ι"},
    {label: "\\Kappa", insertText: "Κ"},
    {label: "\\Lambda", insertText: "Λ"},
    {label: "\\Mu", insertText: "Μ"},
    {label: "\\Nu", insertText: "Ν"},
    {label: "\\Xi", insertText: "Ξ"},
    {label: "\\Omicron", insertText: "Ο"},
    {label: "\\Pi", insertText: "Π"},
    {label: "\\Rho", insertText: "Ρ"},
    {label: "\\Sigma", insertText: "Σ"},
    {label: "\\Tau", insertText: "Τ"},
    {label: "\\Upsilon", insertText: "Υ"},
    {label: "\\Phi", insertText: "Φ"},
    {label: "\\Chi", insertText: "Χ"},
    {label: "\\Psi", insertText: "Ψ"},
    {label: "\\Omega", insertText: "Ω"}
  ];

  const operators = [
    {op: "=", type: " Nat → Nat → Bool"},
    {op: ">", type: " Nat → Nat → Bool"},
    {op: "<", type: " Nat → Nat → Bool"},
    {op: ">=", type: " Nat → Nat → Bool"},
    {op: "<=", type: " Nat → Nat → Bool"},
    {op: "+", type: " Nat → Nat → Nat"},
    {op: "-", type: " Nat → Nat → Nat"},
    {op: "*", type: " Nat → Nat → Nat"},
    {op: "^", type: " Nat → Nat → Nat"},
  ]

  const func = [
    {op: "iszero", type: " Nat → Bool"},
    {op: "succ", type: " Nat → Nat"},
    {op: "pred", type: " Nat → Nat"},
  ]

  return (
      <HelpListItem title={props.title} description={props.description}>
        <Tabs className='flex flex-col grow'>
          <TabList>
            <Tab id="FoR">{translations[confCtx.language].tutorials.syntax.tt1}</Tab>
            <Tab id="MaR">{translations[confCtx.language].tutorials.syntax.tt2}</Tab>
            <Tab id="VvV">{translations[confCtx.language].tutorials.syntax.tt3}</Tab>
          </TabList>
          <TabPanel id="VvV" className="">
            <div className="m-4"></div>
            <h1 className="title"
                dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.syntax.t13}}
            >
            </h1>

            <Table>
              <TableHeader>
                <Column isRowHeader>Label</Column>
                <Column>Insert Text</Column>
              </TableHeader>
              <TableBody>
                {keywords.map((row) => (
                    <Row isDisabled={true}
                         key={row.label}
                         onAction={() => {

                         }}
                    >
                      <Cell>{row.label}</Cell>
                      <Cell>{row.insertText}</Cell>
                    </Row>
                ))}
              </TableBody>
            </Table>

            <h1 className="title"
                dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.syntax.t14}}
            >
            </h1>
            <Table disabledBehavior={"all"}>
              <TableHeader>
                <Column isRowHeader>Label</Column>
                <Column>Insert Text</Column>
              </TableHeader>
              <TableBody>
                {specialSymbols.map((row) => (
                    <Row isDisabled={true}
                         key={row.label}
                         onAction={() => {

                         }}
                    >
                      <Cell>{row.label}</Cell>
                      <Cell>{row.insertText}</Cell>
                    </Row>
                ))}
              </TableBody>
            </Table>

            <h1 className="title"
                dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.syntax.t15}}
            >
            </h1>

            <Table selectionMode={"none"} disabledKeys={"all"}>
              <TableHeader>
                <Column isRowHeader>Label</Column>
                <Column>Insert Text</Column>
              </TableHeader>
              <TableBody>
                {greekLetters.map((row) => (
                    <Row isDisabled={true}
                         key={row.label}
                         onAction={() => {

                         }}
                    >
                      <Cell>{row.label}</Cell>
                      <Cell>{row.insertText}</Cell>
                    </Row>
                ))}
              </TableBody>
            </Table>
          </TabPanel>
          <TabPanel id="FoR" className="">
            <div className="m-4"></div>
            <h1 className="title"
                dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.syntax.t16}}
            >
            </h1>
            <Table>
              <TableHeader>
                <Column isRowHeader>Operator</Column>
                <Column>Type</Column>
              </TableHeader>
              <TableBody>
                {operators.map((row) => (
                    <Row isDisabled={true}
                         key={row.op}
                         onAction={() => {

                         }}
                    >
                      <Cell>{row.op}</Cell>
                      <Cell>{row.type}</Cell>
                    </Row>
                ))}
              </TableBody>
            </Table>

            <h1 className="title"
                dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.syntax.t17}}
            >
            </h1>

            <Table>
              <TableHeader>
                <Column isRowHeader>Function</Column>
                <Column>Type</Column>
              </TableHeader>
              <TableBody>
                {func.map((row) => (
                    <Row isDisabled={true}
                         key={row.op}
                         onAction={() => {

                         }}
                    >
                      <Cell>{row.op}</Cell>
                      <Cell>{row.type}</Cell>
                    </Row>
                ))}
              </TableBody>
            </Table>


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
            {/*<p className="paragraph"*/}
            {/*   dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.syntax.t10}}*/}
            {/*>*/}

            {/*</p>*/}

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
cons [Nat] 1 t  // ListCons
isnil [Nat] t  // ListIsNil
head [Nat] t  // ListHead
tail [Nat] t  // ListTail
[1, 2, 3]  // ListConstructor`}></CodeExample>

          </TabPanel>
          <TabPanel id="MaR" className="">
            <div className="m-4"></div>


            <h1 className="title"
                dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.syntax.t0}}
            >

            </h1>
            <CodeExample code={`
terms ::= ((globalDecl)*  (t;)* t : T )+    (Sequence)        
`}/>
            <CodeExample code={`
t ::= t t                                   (Application)
    | t (> | >= | < | <= | ==) t            (Comparison)
    | t (+ | -) t                           (Addition)
    | t * t                                 (Multiplication)
    | t ^ t                                 (Power)
    | λ x : T . t                           (Lambda Abstraction)
    | λ _ : T . t                           (Wildcard)
    | if t then t (else if t then t)* (else t)? (If-Else)
    | v                                     (Variable)
    | fix t                                 (Fix)
    | [ID = t] as T                         (Injection)
    | (inl | inr) t as T                    (Left/Right Injection)
    | <ID = t (, x = t)*>                   (Record)
    | t . n                                 (Record Projection)
    | <t (, t)*>                            (Tuple)
    | t . ID                                (Tuple Projection)
    | list_op                               (List)
    | case t of [x = t] => t (|| [x = t] => t)*          (Case Of)
    | case t of (inl | inr) x => t || (inl | inr) x => t (Binary Case Of)`
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
    | Unit | unit                          (Unit)
    | ID                                   (Variable Name)`}/>

            <CodeExample code={`
globalDecl ::= typedef ID = T;             (Type Alias)
             | ID : T;                     (Global Variable Declaration)
             | ID = t (: T)?;              (Global Function Declaration)`}/>

          </TabPanel>
        </Tabs>
      </HelpListItem>
  )
}
export default SyntaxTutorial;