import {HelpListItem} from "../../component/ListItem/HelpListItem";
import {CodeExample} from "./CodeExample";
import {useContext} from "react";
import {ConfigurationContext} from "../../../configurations/context/ConfigurationContext";
import translations from "../../../configurations/data/translations";

interface GrammarTutorialProps {
  title: string;
  description: string;
}

export const AbstractionTutorial = (props: GrammarTutorialProps) => {
  const confCtx = useContext(ConfigurationContext)

  return (
      <HelpListItem title={props.title} description={props.description}>
        <h1 className="title">{props.title}</h1>

        <p className="paragraph"
          dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.abstraction.p1}}
        >

        </p>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.abstraction.p2}}
        >

        </p>

        <CodeExample code={`id = λ x: Nat . x : Nat -> Nat;`}></CodeExample>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.abstraction.p3}}
        >

        </p>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.abstraction.p4}}
        >

        </p>

        <CodeExample code={`λ x: A . t : A -> B;`}></CodeExample>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.abstraction.p5}}
        >

        </p>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.abstraction.p6}}
        >

        </p>

        <CodeExample code={`addOne = λ x: Nat . x + 1 : Nat -> Nat;`}></CodeExample>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.abstraction.p7}}
        >

        </p>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.abstraction.p8}}
        >

        </p>


      </HelpListItem>
  )
}

export default AbstractionTutorial