import './HelpBar.css'
import {HelpListItem} from "./ListItem/HelpListItem";
import {HelpModal} from "./modal/HelpModal";
import {useState} from "react";
import {Input} from "react-aria-components";
import { IoMdSearch } from "react-icons/io";

const topics = [
  <HelpListItem title={'Grammar'} description={'Grammar of languge and structure of expressions'}>
    Grammar
  </HelpListItem>,
  <HelpListItem title={'Application rule'} description={'Short description  of topic'}>
    Application
  </HelpListItem>,
  <HelpListItem title={'Tuples and records'} description={'Short description  of topic'}>
    Application
  </HelpListItem>,
  <HelpListItem title={'Variants'} description={'Short description  of topic'}>
    Application
  </HelpListItem>
]


export function HelpBar() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTopics = topics.filter((topic) =>
      topic.props.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.props.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
      <div className="help-bar ui-block ml-0 flex flex-col ">

        <div className="search mx-10">

          <Input
              className="search-input"
              type="text"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
          />
          <IoMdSearch style={{
            position: "absolute",
            right: '1rem',
          }} size={20}/>

        </div>

        <div className="list px-7 mx-1 my-4 flex flex-col gap-4">
          {filteredTopics.length > 0 ? (
              filteredTopics.map((topic, index) => (
                  <div key={index}>{topic}</div>
              ))
          ) : (
              <p className="text-gray-500 text-center">No matching topics found.</p>
          )}


        </div>
      </div>
  )
}