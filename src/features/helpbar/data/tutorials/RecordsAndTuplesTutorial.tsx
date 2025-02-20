import {HelpListItem} from "../../component/ListItem/HelpListItem";
import {CodeExample} from "./CodeExample";
import {useContext} from "react";
import {ConfigurationContext} from "../../../configurations/context/ConfigurationContext";
import translations from "../../../configurations/data/translations";

interface GrammarTutorialProps {
  title: string;
  description: string;
}

export const RecordsAndTuplesTutorial = (props: GrammarTutorialProps) => {
  const confCtx = useContext(ConfigurationContext)


  return (
      <HelpListItem title={props.title} description={props.description}>
        <h1 className="title">{props.title}</h1>
        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.recordsAndTuples.p1}}
        >

        </p>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.recordsAndTuples.p2}}
        >

        </p>

        <CodeExample code={`typedef Human = <name: String, age: Nat>; // define type

john : Human; // define var of type 'Human'

john.name; john.age; // use record projections`}></CodeExample>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.recordsAndTuples.p3}}
        >

        </p>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.recordsAndTuples.p4}}
        >

        </p>

        <CodeExample code={`var1 : A;
var2 : B;

tuple = <var1, var2> : A * B; // define tuple

tuple;  // access entire tuple
tuple.1; // access first element (var1)
tuple.2; // access second element (var2)`}></CodeExample>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.recordsAndTuples.p5}}
        >

        </p>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.recordsAndTuples.p6}}
        >

        </p>

      </HelpListItem>
  )
}
export default RecordsAndTuplesTutorial;