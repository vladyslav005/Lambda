import {IconButton} from "../../../../common/components/button/IconButton";
import {MdContentCopy} from "react-icons/md";
import React, {useContext} from "react";
import toast from "react-hot-toast";
import {ConfigurationContext} from "../../../configurations/context/ConfigurationContext";
import translations from "../../../configurations/data/translations";


export const CodeExample = ({code}: { code: string }) => {

  const confCtx = useContext(ConfigurationContext)
  return (
      <div className="code relative">
          <pre>
            {`${code}`}
          </pre>
        <IconButton
            style={{
              position: "absolute",
              top: -5,
              left: -5,
            }}
            onClick={() => {
              navigator.clipboard.writeText(code).then()
              toast(translations[confCtx.language].toast.exampleCopy, {duration: 1000,})
            }}
        >
          <MdContentCopy size={20}/>
        </IconButton>
      </div>
  )
}