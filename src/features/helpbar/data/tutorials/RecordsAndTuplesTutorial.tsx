import {HelpListItem} from "../../component/ListItem/HelpListItem";
import {CodeExample} from "./CodeExample";
import GrammarTutorial from "./GrammarTutorial";

interface GrammarTutorialProps {
  title: string;
  description: string;
}

export const RecordsAndTuplesTutorial = (props: GrammarTutorialProps) => {
  return (
      <HelpListItem title={props.title} description={props.description} >
        <h1 className="title">{props.title}</h1>
        <p className="paragraph">
          In this tutorial, we'll explore the usage of records,
          tuples, and how to access their values using projections.
        </p>

        <p className="paragraph">
          A record is a collection of named fields,
          and a tuple is an ordered collection of values. You can define them as follows:
        </p>

        <CodeExample code={`typedef Human = <name: String, age: Nat>; // define type

john : Human; // define var of type 'Human'

john.name; john.age; // use record projections`}></CodeExample>

        <p className="paragraph">
          In the example above, we define a type <code>Human</code> as a
          record with fields <code>name</code> and <code>age</code>.
          We then create a variable <code>john</code> of type <code>Human</code>
          and access its fields using projections: <code>john.name</code> and <code>john.age</code>.
        </p>

        <p className="paragraph">
          Similarly, you can work with tuples, which are represented as an ordered collection of values.
          Here's an example:
        </p>

        <CodeExample code={`var1 : A;
var2 : B;

tuple = <var1, var2> : A * B; // define tuple

tuple;  // access entire tuple
tuple.1; // access first element (var1)
tuple.2; // access second element (var2)`}></CodeExample>

        <p className="paragraph">
          In this case, we define a tuple that combines two variables
          <code>var1</code> and <code>var2</code>.
          You can access the individual elements of the tuple using projections:
          <code>tuple.1</code> for the first element and <code>tuple.2</code> for the second.
        </p>

        <p className="paragraph">
          These projections allow you to retrieve specific values from records and tuples,
          enabling you to work with complex data structures in a simple and efficient way.
        </p>

      </HelpListItem>
  )
}
export default RecordsAndTuplesTutorial;