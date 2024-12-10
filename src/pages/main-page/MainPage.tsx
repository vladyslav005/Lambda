import {LambdaInput} from "../../features/lambda-input/component/LambdaInput";
import {ErrorOutput} from "../../features/error-output/component/ErrorOutput";
import {HelpBar} from "../../features/helpbar/component/HelpBar";
import {lazy, Suspense} from "react";


const TreeFlat = lazy(() => import('../../features/tree/component/TreeFlat'))

export function MainPage() {

  return (
      <div className="main-page flex flex-row">



        {/*<div className="right-side flex flex-row" style={{flexGrow: 4}}>*/}

          <div className="flex flex-col" style={{flexGrow: 10}}>
            <LambdaInput></LambdaInput>

            <Suspense fallback={<div className="tree-flat-container ui-block">Loading...</div>}>
              <TreeFlat></TreeFlat>
            </Suspense>
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

