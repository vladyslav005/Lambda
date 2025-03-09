import {Dialog, Modal} from 'react-aria-components';
import {IconButton} from "../../../../common/components/button/IconButton";
import {IoMdClose} from "react-icons/io";
import {Toaster} from "react-hot-toast";
import "./style.css"
import React from "react";


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
                background: "var(--Schemes-Surface-Variant, #E7E0EC)",
                color: "var(--M3-sys-light-on-secondary-container, var(--Schemes-On-Secondary-Container, #4A4459))",
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
        <Dialog>
          <div className="h-1"></div>

          <IconButton
              style={{
                position: "absolute",
                top: "0.3rem",
                right: "1rem",
              }}
              onClick={() => props.setModalOpen(false)}
          >
            <IoMdClose
                color="var(--M3-sys-light-on-secondary-container, var(--Schemes-On-Secondary-Container, #4A4459))"
                size={20}/>
          </IconButton>
          <div className="help-modal-content">
            {props.children}
          </div>
          <div className="h-1"></div>

        </Dialog>
      </Modal>
  )
}