import {GrammarTutorial} from "./tutorials/GrammarTutorial";
import {ApplicationTutorial} from "./tutorials/ApplicationTutorial";
import {AbstractionTutorial} from "./tutorials/AbstractionTutorial";
import {RecordsAndTuplesTutorial} from "./tutorials/RecordsAndTuplesTutorial";
import {VariantsTutorial} from "./tutorials/VariantsTutorial";
import {useContext} from "react";
import {ConfigurationContext} from "../../configurations/context/ConfigurationContext";
import translations from "../../configurations/data/translations";
import SyntaTutorial from "./tutorials/SyntaTutorial";

interface TopicsProps {
  searchQuery: string
}

export const Topics = ({searchQuery}: TopicsProps) => {
  const confContext = useContext(ConfigurationContext);

  const topics = [
    <SyntaTutorial title={translations[confContext.language].helpBar.guides.syntax.title}
                   description={translations[confContext.language].helpBar.guides.syntax.desc}/>,
    <GrammarTutorial title={translations[confContext.language].helpBar.guides.grammar.title}
                     description={translations[confContext.language].helpBar.guides.grammar.desc}/>,

    <AbstractionTutorial title={translations[confContext.language].helpBar.guides.abstraction.title}
                         description={translations[confContext.language].helpBar.guides.abstraction.desc}/>,

    <ApplicationTutorial title={translations[confContext.language].helpBar.guides.application.title}
                         description={translations[confContext.language].helpBar.guides.application.desc}/>,

    <RecordsAndTuplesTutorial title={translations[confContext.language].helpBar.guides.recordsAndTuples.title}
                              description={translations[confContext.language].helpBar.guides.recordsAndTuples.desc}/>,

  ]

  const filteredTopics = topics.filter((topic) =>
      topic.props.title
          .toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .includes(searchQuery.toLowerCase()) ||
      topic.props.description
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(searchQuery.toLowerCase())
  );

  return (
      <div className="list px-7 mx-1 my-4 flex flex-col gap-4">
        {filteredTopics.length > 0 ? (
            filteredTopics.map((topic, index) => (
                <div key={index}>{topic}</div>
            ))
        ) : (
            <p className="text-gray-500 text-center">No matching topics found.</p>
        )}

      </div>
  )
}

export default Topics;