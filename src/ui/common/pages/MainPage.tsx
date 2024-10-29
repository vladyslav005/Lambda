import {LambdaInput} from "../../features/lambdainput/component/LambdaInput";
import {ErrorOutput} from "../../features/erroroutput/component/ErrorOutput";
import {TreeFlat} from "../../features/tree/component/TreeFlat";
import {HelpBar} from "../../features/helpbar/component/HelpBar";


export function MainPage() {

  return (
      <div className="main-page flex flex-row">

        <div className="flex flex-col" style={{flexGrow: 1}}>
          <HelpBar></HelpBar>
        </div>

        <div className="right-side flex flex-row" style={{flexGrow: 3}}>

          <div className="flex flex-col" style={{flexGrow: 4}}>
            <LambdaInput></LambdaInput>
            <TreeFlat></TreeFlat>
          </div>

          <div className="flex flex-col"
               style={{
                 flexGrow: 0,
          }}>
            <ErrorOutput></ErrorOutput>
          </div>

        </div>

      </div>
  )
}

