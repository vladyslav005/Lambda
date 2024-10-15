import {LambdaInput} from "../../features/lambdainput/component/LambdaInput";
import {ErrorOutput} from "../../features/erroroutput/component/ErrorOutput";
import {TreeFlat} from "../../features/tree/component/TreeFlat";
import {HelpBar} from "../../features/helpbar/component/HelpBar";


export function MainPage() {

  return (
      <div className="main-page
            h-lvh w-dvw bg-gray-800 flex flex-row

            ">

        <div className="flex flex-col"
             style={{flexGrow: 1}}
        >
          <LambdaInput></LambdaInput>
          <ErrorOutput></ErrorOutput>
        </div>

        <div className="right-side flex flex-row"
             style={{flexGrow: 3}}
        >
          <TreeFlat></TreeFlat>

          <HelpBar></HelpBar>
        </div>


      </div>
  )
}

