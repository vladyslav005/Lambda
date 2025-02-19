import {Dialog, Modal} from 'react-aria-components';
import {IconButton} from "../../../../common/components/button/IconButton";
import {IoMdClose} from "react-icons/io";
import {Toaster} from "react-hot-toast";
import "./style.css"


interface HelpModalProps {
  modalOpen: boolean
  setModalOpen: (open: boolean) => void
  children?: React.ReactNode
}

export const HelpModal = (props: HelpModalProps) => {

  return (
      <Modal isDismissable isOpen={props.modalOpen} onOpenChange={props.setModalOpen}>
        <div className="my-overlay"
             onClick={(event) => {
               event.stopPropagation();
               props.setModalOpen(false);
             }}>
        </div>
        <Toaster
            toastOptions={{
              position: "top-center",
              style: {
                color: "#49454F",
                fontFamily: "Roboto",
                fontSize: "var(--Body-Medium-Size, 14px)",
                fontStyle: "normal",
                fontWeight: "400",
                lineHeight: "var(--Body-Medium-Line-Height, 20px)",
                letterSpacing: "var(--Body-Medium-Tracking, 0.25px)",
                zIndex: 1000000,
              }
            }}
        />
        <Dialog className="outline-0" style={{position: "relative"}}>
          <div className="h-1"></div>

          <IconButton
              style={{
                position: "absolute",
                top: "0.3rem",
                right: "1rem",
              }}
              onClick={() => props.setModalOpen(false)}
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