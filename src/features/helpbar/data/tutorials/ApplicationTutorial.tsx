import {HelpListItem} from "../../component/ListItem/HelpListItem";
import {CodeExample} from "./CodeExample";

interface GrammarTutorialProps {
  title: string;
  description: string;
}

export const ApplicationTutorial = (props: GrammarTutorialProps) => {
  return (
      <HelpListItem title={props.title} description={props.description}>
        <h1 className="title">{props.title}</h1>

        <p className="paragraph">
          The <em>application rule</em> is used when applying a function to an argument.
          In simple terms, if you have a function and a valid input, the application rule
          checks whether the function can be applied to the given argument.
        </p>

        <p className="paragraph">
          Consider the following function:
        </p>

        <CodeExample code={`id = λ x: Nat . x : Nat -> Nat;`}></CodeExample>

        <p className="paragraph">
          Here, <code>id</code> is a function that takes an argument of type <code>Nat</code>
          and returns the same value. Now, let's apply this function to a number:
        </p>

        <CodeExample code={`id = λ x: Nat . x : Nat -> Nat;
id 5;`}></CodeExample>

        <p className="paragraph">
          When applying <code>id</code> to <code>5</code>, the application rule checks whether
          <code>id</code> expects a <code>Nat</code> and whether <code>5</code> is of type <code>Nat</code>.
          Since both conditions hold, the application is valid.
        </p>

        <p className="paragraph">
          More generally, function application follows this pattern:
          <code>(f: A -&gt; B) (x: A) : B;</code>
        </p>

        <p className="paragraph">
          That is, if <code>f</code> is a function that takes an argument of type <code>A</code>
          and returns type <code>B</code>, and <code>x</code> is of type <code>A</code>,
          then <code>f x</code> will be of type <code>B</code>.
        </p>

        <p className="paragraph">
          Try experimenting with different functions and arguments in the editor to see
          how the application rule applies in various cases.
        </p>

      </HelpListItem>
  )
}

export default ApplicationTutorial;
