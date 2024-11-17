import {LambdaInput} from "../../features/lambdainput/component/LambdaInput";
import {ErrorOutput} from "../../features/erroroutput/component/ErrorOutput";
import {TreeFlat} from "../../features/tree/component/TreeFlat";
import {HelpBar} from "../../features/helpbar/component/HelpBar";


export function MainPage() {

  return (
      <div className="main-page flex flex-row">



        {/*<div className="right-side flex flex-row" style={{flexGrow: 4}}>*/}

          <div className="flex flex-col" style={{flexGrow: 10}}>
            <LambdaInput></LambdaInput>
            <TreeFlat></TreeFlat>
          </div>

          <div className="flex flex-col sidebar"
            style={{flexGrow: 1}}
          >
            <ErrorOutput></ErrorOutput>

            <HelpBar></HelpBar>

          </div>

        {/*</div>*/}

      </div>
  )
}

