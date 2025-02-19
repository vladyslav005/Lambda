import {HelpListItem} from "../../component/ListItem/HelpListItem";
import {CodeExample} from "./CodeExample";

interface GrammarTutorialProps {
  title: string;
  description: string;
}

export const GrammarTutorial = (props: GrammarTutorialProps) => {
  return (
      <HelpListItem title={props.title} description={props.description} >
        <h1 className="title">{props.title}</h1>

        <p className="paragraph">
          The syntax of the language is simple and minimalistic.
          There are two types of expressions: <em>terms</em> and <em>declarations</em>.
        </p>

        <p className="paragraph">
          A term can be any of the following: variable, abstraction,
          application, record, tuple, projection, case-of construction,
          if-else construction, variant, or injection.
        </p>

        <p className="paragraph">
          Declarations are used to populate the <b>global context &Gamma;</b>.
          Variables can be declared by assigning them a value and explicitly
          specifying their type, or simply by providing a name with a type annotation.
        </p>

        <p className="paragraph">Example:</p>

        <CodeExample code={`var1 = λ x: Nat . x : Nat -> Nat;
var2 : Nat -> Nat;  // type annotation only`}></CodeExample>

        <p className="paragraph">
          Variables can be used even without assigning them a value,
          since this web application only performs type checking.
          It does not evaluate expressions or consider their values.
        </p>

        <p className="paragraph">
          However, while declarations add entries to the context, they are not
          displayed in the proof tree itself. If you paste the example above
          into the editor, an error will occur because there is no actual term
          to display in the proof tree. To resolve this, we need to make a small adjustment:
        </p>

        <CodeExample code={`var1 = λ x: Nat . x : Nat -> Nat;
var2 : Nat -> Nat;  // type annotation only

var1;`}></CodeExample>

        <p className="paragraph">
          Now, if you paste the updated example, you will see a proof tree
          containing the <em>var rule</em>, which confirms that
          the term <code>var1</code> is correctly typed.
          You can use this approach to write more complex terms.
          It's also possible to write a sequence of unrelated terms
          to see them all in the proof tree. In such cases, they will appear under the <em>sequence rule</em>.
        </p>

      </HelpListItem>
  )
}