import {HelpListItem} from "../../component/ListItem/HelpListItem";
import {CodeExample} from "./CodeExample";
import {useContext} from "react";
import {ConfigurationContext} from "../../../configurations/context/ConfigurationContext";
import translations from "../../../configurations/data/translations";

interface GrammarTutorialProps {
  title: string;
  description: string;
}

export const ApplicationTutorial = (props: GrammarTutorialProps) => {
  const confCtx = useContext(ConfigurationContext)

  return (
      <HelpListItem title={props.title} description={props.description}>
        <h1 className="title">{props.title}</h1>

        <p className="paragraph"
          dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.application.p1}}
        >

        </p>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.application.p2}}
        >

        </p>

        <CodeExample code={`id = λ x: Nat . x : Nat -> Nat;`}></CodeExample>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.application.p3}}
        >

        </p>

        <CodeExample code={`id = λ x: Nat . x : Nat -> Nat;
id 5;`}></CodeExample>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.application.p4}}
        >

        </p>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.application.p5}}
        >

        </p>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.application.p6}}
        >

        </p>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.application.p7}}
        >

        </p>

      </HelpListItem>
  )
}

export default ApplicationTutorial;
