import {HelpListItem} from "../../component/ListItem/HelpListItem";
import {CodeExample} from "./CodeExample";
import {useContext} from "react";
import {ConfigurationContext} from "../../../configurations/context/ConfigurationContext";
import translations from "../../../configurations/data/translations";

interface GrammarTutorialProps {
  title: string;
  description: string;
}

export const VariantsTutorial = (props: GrammarTutorialProps) => {
  const confCtx = useContext(ConfigurationContext)


  return (
      <HelpListItem title={props.title} description={props.description}>
        <h1 className="title">{props.title}</h1>
        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.variants.p1}}
        >

        </p>

        <h3 className="subtitle"
            dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.variants.st1}}
        ></h3>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.variants.p2}}
        >

        </p>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.variants.p3}}
        >

        </p>

        <CodeExample code={`typedef PhysicalAddr = <firstlast : String, addr : String>;
typedef VirtualAddr = <name : String, email : String>;

typedef Addr = PhysicalAddr + VirtualAddr; // define variant type

pa : PhysicalAddr;
a = inl pa as Addr : Addr; // make injection

case a of                // use case of construction injection
    inl x => x.firstlast
 || inr y => y.name : String`}/>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.variants.p4}}
        >

        </p>

        <h3 className="subtitle"
            dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.variants.st2}}
        ></h3>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.variants.p5}}
        >

        </p>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.variants.p6}}
        >

        </p>

        <CodeExample code={`typedef PhysicalAddr = <firstlast : String, addr : String>;
typedef VirtualAddr = <name : String, email : String>;

typedef Addr = [physical : PhysicalAddr, virtual : VirtualAddr]; // define variant type

pa : PhysicalAddr;
a = [physical = pa] as Addr : Addr; // make injection

case a of                       // use case of construction injection
     [physical = x] => x.firstlast
  || [virtual = y] => y.name : String`}/>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.variants.p7}}
        >

        </p>

        <h3 className="subtitle"
            dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.variants.st3}}
        ></h3>

        <p className="paragraph"
           dangerouslySetInnerHTML={{__html: translations[confCtx.language].tutorials.variants.p8}}
        >

        </p>
      </HelpListItem>
  )
}

export default VariantsTutorial;