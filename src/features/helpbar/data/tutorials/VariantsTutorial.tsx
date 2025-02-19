import {HelpListItem} from "../../component/ListItem/HelpListItem";
import {CodeExample} from "./CodeExample";

interface GrammarTutorialProps {
  title: string;
  description: string;
}

export const VariantsTutorial = (props: GrammarTutorialProps) => {
  return (
      <HelpListItem title={props.title} description={props.description} >
        <h1 className="title">{props.title}</h1>
        <p className="paragraph">
          Variants are a powerful construct that allow you to represent
          values that can have multiple forms. There are two kinds of variants: <b>binary variants</b>
          and <b>generalized variants</b>.
        </p>

        <h3 className="subtitle">Binary Variants</h3>

        <p className="paragraph">
          A binary variant can only contain two types and supports two types of injections: <b>left injection</b> (<code>inl</code>) and <b>right injection</b> (<code>inr</code>).
          This is a simplified form of variants used to model two distinct possibilities.
        </p>

        <p className="paragraph">
          Example:
        </p>

        <CodeExample code={`typedef PhysicalAddr = <firstlast : String, addr : String>;
typedef VirtualAddr = <name : String, email : String>;

typedef Addr = PhysicalAddr + VirtualAddr; // define variant type

pa : PhysicalAddr;
a = inl pa as Addr; // make injection

case a of                // use case of construction injection
    inl x => x.firstlast
 || inr y => y.name;`} />

        <p className="paragraph">
          In this example, we define two types: <code>PhysicalAddr</code> and <code>VirtualAddr</code>.
          The <code>Addr</code> type is a binary variant that can either be a <code>PhysicalAddr</code>
          or a <code>VirtualAddr</code>. We then create an instance <code>pa</code> of type
          <code>PhysicalAddr</code>, and inject it into the <code>Addr</code> variant using <code>inl</code>.
          The <code>case</code> expression checks which side of the
          variant the value belongs to and extracts the appropriate data.
        </p>

        <h3 className="subtitle">Generalized Variants</h3>

        <p className="paragraph">
          A generalized variant can contain any number of different types.
          This makes it more flexible and capable of representing a larger range of possibilities.
        </p>

        <p className="paragraph">
          Example:
        </p>

        <CodeExample code={`typedef PhysicalAddr = <firstlast : String, addr : String>;
typedef VirtualAddr = <name : String, email : String>;

typedef Addr = [physical : PhysicalAddr, virtual : VirtualAddr]; // define variant type

pa : PhysicalAddr;
a = [physical = pa] as Addr; // make injection

case a of                       // use case of construction injection
     [physical = x] => x.firstlast
  || [virtual = y] => y.name;`} />

        <p className="paragraph">
          In this case, the <code>Addr</code> type is a generalized variant defined by a sum of multiple types
          (<code>PhysicalAddr</code> and <code>VirtualAddr</code>).
          The <code>Addr</code> variant can now hold any of these types,
          and the injection is done using a more flexible syntax: <code>[physical = pa]</code>.
          The <code>case</code> expression checks for both possible variants using pattern matching on the keys
          <code>physical</code> and <code>virtual</code>, and extracts the relevant information from the chosen variant.
        </p>

        <h3 className="subtitle">Summary</h3>

        <p className="paragraph">
          - <b>Binary variants</b> are limited to two types, where you can inject values using either <code>inl</code> (left) or <code>inr</code> (right).<br/>
          - <b>Generalized variants</b> are more flexible, supporting any number of types and using a more structured injection syntax with labeled fields.
        </p>
      </HelpListItem>
  )
}