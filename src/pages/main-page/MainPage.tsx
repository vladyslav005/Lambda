import {ErrorOutput} from "../../features/error-output/component/ErrorOutput";
import {HelpBar} from "../../features/helpbar/component/HelpBar";
import {lazy, Suspense} from "react";
import {LoadingIndicator} from "../../common/components/loading/LoadingIndicator";

const TreeFlat = lazy(() => import('../../features/tree/component/TreeFlat'))
const LambdaInput = lazy(() => import('../../features/lambda-input/component/LambdaInput'))


export function MainPage() {

  return (
      <div className="main-page flex flex-row">

        {/*<div className="right-side flex flex-row" style={{flexGrow: 4}}>*/}

        <div className="main-pane flex flex-col" style={{flexGrow: 10}}>

          <Suspense fallback={<div className="lambda-input ui-block flex-row justify-center items-center"><LoadingIndicator/></div>}>
            <LambdaInput></LambdaInput>
          </Suspense>

          <Suspense fallback={<div className="tree-flat-container ui-block"><LoadingIndicator/></div>}>
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

