import {IconButton} from "../../../../common/components/button/IconButton";
import {MdContentCopy} from "react-icons/md";
import React, {useContext} from "react";
import toast from "react-hot-toast";
import {ConfigurationContext} from "../../../configurations/context/ConfigurationContext";
import translations from "../../../configurations/data/translations";


export const CodeExample = ({code}: { code: string }) => {

  const confCtx = useContext(ConfigurationContext)
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
              toast(translations[confCtx.language].toast.exampleCopy, {duration: 1000,})
            }}
        >
          <MdContentCopy size={20}/>
        </IconButton>
      </p>
  )
}