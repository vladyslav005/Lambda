import "./style.css"
import {useState} from "react";
import {HelpModal} from "../modal/HelpModal";

interface ListItemProps {
  title: string;
  description: string;
  className?: string,
  onClick?: () => void,
  children?: React.ReactNode,
}

export const HelpListItem = (props: ListItemProps) => {
  const [open, setOpen] = useState(false)


  return (
      <div className="list-item-container" onClick={() => setOpen(true)}>
        <div className="list-item-content">
          <h3 className="list-item-title">{props.title}</h3>
          <p className="list-item-subtitle">{props.description}</p>
        </div>
        <HelpModal modalOpen={open} setModalOpen={setOpen}>
          {props.children}
        </HelpModal>
      </div>
  )
}