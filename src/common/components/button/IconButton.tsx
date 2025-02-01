import "./style.css"
import {Button} from "react-aria-components";
import toast from "react-hot-toast";
import {MdContentCopy} from "react-icons/md";
import React from "react";
import Ripples, {createRipples} from 'react-ripples'

interface IconButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;

  style?: React.CSSProperties;

}

export const MyRipples = createRipples({
  color: 'purple',
  during: 2200,
})


export const IconButton = (props : IconButtonProps) => {


  return (
        <Button
            style={{
              outline: 'none',
              ...props.style,
            }}

            onPress={props.onClick}
        >
          <MyRipples during={500} color={'rgba(251,246,246,0.63)'}
                     className={[props.className, "my-button"].join(" ")}

          >
              {props.children}
          </MyRipples>

        </Button>

  )
}