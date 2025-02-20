import {HelpListItem} from "../../component/ListItem/HelpListItem";
import {CodeExample} from "./CodeExample";
import {useContext} from "react";
import {ConfigurationContext} from "../../../configurations/context/ConfigurationContext";
import translations from "../../../configurations/data/translations";

interface GrammarTutorialProps {
  title: string;
  description: string;
}

export const GrammarTutorial = (props: GrammarTutorialProps) => {
  const confCtx = useContext(ConfigurationContext)

  return (
      <HelpListItem title={props.title} description={props.description}>
        <h1 className="title">{props.title}</h1>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.grammar.p1}}
        >
        </p>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.grammar.p2}}
        >

        </p>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.grammar.p3}}
        >

        </p>

        <CodeExample code={`var1 = λ x: Nat . x : Nat -> Nat;
var2 : Nat -> Nat;  // type annotation only`}></CodeExample>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.grammar.p4}}
        >

        </p>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.grammar.p5}}
        >

        </p>

        <CodeExample code={`var1 = λ x: Nat . x : Nat -> Nat;
var2 : Nat -> Nat;  // type annotation only

var1;`}></CodeExample>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.grammar.p6}}
        >

        </p>

      </HelpListItem>
  )
}

export default GrammarTutorial;