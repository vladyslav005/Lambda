import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Input,
  Label,
  Modal,
  ModalOverlay,
  TextField
} from 'react-aria-components';
import "./style.css"
import {IconButton} from "../../../../common/components/button/IconButton";
import { IoMdClose } from "react-icons/io";


interface HelpModalProps {
  modalOpen: boolean
  setModalOpen: (open: boolean) => void
  children?: React.ReactNode

}

export const HelpModal = (props: HelpModalProps) => {

  return (
    <Modal isDismissable isOpen={props.modalOpen} onOpenChange={props.setModalOpen}>
      <Dialog className="outline-0" style={{position: "relative"}}>
        <div className="h-1"></div>
        <IconButton
            style={{
              position: "absolute",
              top: "0.3rem",
              right: "1rem",
            }}
            onClick={()=> props.setModalOpen ? props.setModalOpen(false) : {} }
        >
          <IoMdClose size={20}/>
        </IconButton>
        <div className="help-modal-content">
          {props.children}
        </div>
        <div className="h-1"></div>

      </Dialog>
    </Modal>
  )
}