import "./style.css"
import {Button} from "react-aria-components";
import React from "react";
import {createRipples} from 'react-ripples'

interface IconButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  title?: string;
}

export const MyRipples = createRipples({
  color: 'purple',
  during: 2200,
})


export const IconButton = (props: IconButtonProps) => {


  return (
      <Button
          style={{
            outline: 'none',
            ...props.style,
          }}
          id={props.id}
          onPress={props.onClick}
      >
        <div title={props.title ? `${props.title}` : ''}>

          <MyRipples during={500} color={'rgba(251,246,246,0.63)'}
                     className={[props.className, "my-button"].join(" ")}
          >
            {props.children}
          </MyRipples>
        </div>

      </Button>
  )
}