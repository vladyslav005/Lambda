import {HelpListItem} from "../../component/ListItem/HelpListItem";
import {CodeExample} from "./CodeExample";

interface GrammarTutorialProps {
  title: string;
  description: string;
}

export const AbstractionTutorial = (props: GrammarTutorialProps) => {
  return (
      <HelpListItem title={props.title} description={props.description} >
        <h1 className="title">{props.title}</h1>

        <p className="paragraph">
          The <em>abstraction rule</em> is used to define functions.
          In simple terms, an abstraction introduces a variable and specifies the
          function’s input type and output type.
        </p>

        <p className="paragraph">
          Consider the following function:
        </p>

        <CodeExample code={`id = λ x: Nat . x : Nat -> Nat;`}></CodeExample>

        <p className="paragraph">
          This defines a function <code>id</code> that takes an argument <code>x</code> of type <code>Nat</code>
          and returns <code>x</code>. The type annotation <code>Nat -&gt; Nat</code> means that this function
          takes a natural number and returns a natural number.
        </p>

        <p className="paragraph">
          More generally, function abstraction follows this pattern:
        </p>

        <CodeExample code={`λ x: A . t : A -> B;`}></CodeExample>

        <p className="paragraph">
          Here, <code>x</code> is a variable of type <code>A</code>, and <code>t</code> is an expression
          that returns a value of type <code>B</code>. The function itself has type <code>A -&gt; B</code>.
        </p>

        <p className="paragraph">
          Let's define another function that adds one to a number:
        </p>

        <CodeExample code={`addOne = λ x: Nat . x + 1 : Nat -> Nat;`}></CodeExample>

        <p className="paragraph">
          The abstraction rule ensures that this function is correctly typed:
          it takes a natural number and returns a natural number.
        </p>

        <p className="paragraph">
          Try experimenting with different abstractions in the editor to see
          how function definitions work in various cases.
        </p>


      </HelpListItem>
  )
}

export default AbstractionTutorial