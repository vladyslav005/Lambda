import './HelpBar.css'
import {lazy, Suspense, useContext, useState} from "react";
import {Input} from "react-aria-components";
import {IoMdSearch} from "react-icons/io";
import "../data/tutorials/style.css"
import {ConfigurationContext} from "../../configurations/context/ConfigurationContext";
import translations from "../../configurations/data/translations";

const Topics = lazy(() => import("../data/infoTopics"))


export function HelpBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const confContext = useContext(ConfigurationContext)
  return (
      <div className="help-bar ui-block ml-0 flex flex-col ">

        <div className="search mx-10">

          <Input
              className="search-input"
              type="text"
              placeholder={translations[confContext.language].helpBar.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
          />
          <IoMdSearch style={{
            position: "absolute",
            right: '1rem',
          }} size={20}/>

        </div>

        <Suspense>
          <Topics searchQuery={searchQuery}/>
        </Suspense>
      </div>
  )
}