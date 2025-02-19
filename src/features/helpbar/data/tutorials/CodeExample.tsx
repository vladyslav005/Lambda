import {IconButton} from "../../../../common/components/button/IconButton";
import {MdContentCopy} from "react-icons/md";
import React from "react";
import toast from "react-hot-toast";


export const CodeExample = ({code}: {code: string}) => {


  return (
      <p className="code relative">
          <pre>
            {`${code}`}
          </pre>
        <IconButton
          style={{
            position: "absolute",
            top: 0,
            right: 0,
          }}
          onClick={() => {
            navigator.clipboard.writeText(code).then()
            toast('Example copied to clipboard', {duration: 1000,})
          }}
        >
          <MdContentCopy size={20}/>
        </IconButton>
      </p>
  )
}