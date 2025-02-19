import {HelpListItem} from "../component/ListItem/HelpListItem";
import {GrammarTutorial} from "./tutorials/GrammarTutorial";
import {ApplicationTutorial} from "./tutorials/ApplicationTutorial";
import {AbstractionTutorial} from "./tutorials/AbstractionTutorial";
import {RecordsAndTuplesTutorial} from "./tutorials/RecordsAndTuplesTutorial";
import {VariantsTutorial} from "./tutorials/VariantsTutorial";

const topics = [
  <GrammarTutorial title={'Grammar'} description={'Grammar of language'}/>,
  <AbstractionTutorial title={'Abstraction'} description={'Abstraction rule'}/>,
  <ApplicationTutorial title={'Application'} description={'Application rule'}/>,
  <RecordsAndTuplesTutorial title={'Records and tuples'} description={'Records, tuples, their projections'}/>,
  <VariantsTutorial title={'Variants'} description={'Varians, case-of construction'}/>,
]

export default topics;