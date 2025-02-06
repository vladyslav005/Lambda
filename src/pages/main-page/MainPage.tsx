import {ErrorOutput} from "../../features/error-output/component/ErrorOutput";
import {HelpBar} from "../../features/helpbar/component/HelpBar";
import React, {lazy, Suspense, useState} from "react";
import {LoadingIndicator} from "../../common/components/loading/LoadingIndicator";
import {Toaster} from "react-hot-toast";
import {IconButton} from "../../common/components/button/IconButton";
import {MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight} from "react-icons/md";
import {AnimatePresence, motion} from "framer-motion";

const TreeFlat = lazy(() => import('../../features/tree/component/TreeFlat'))
const LambdaInput = lazy(() => import('../../features/lambda-input/component/LambdaInput'))


export function MainPage() {

  const [sidebarHidden, setSidebarHidden] = useState(false)


  return (
      <div className="main-page flex flex-row relative">

        <div className="main-pane flex flex-col relative" style={{flexGrow: 10}}>

          <Suspense fallback={<div className="lambda-input ui-block flex-row justify-center items-center"><LoadingIndicator/></div>}>
            <LambdaInput></LambdaInput>
          </Suspense>

          <Suspense fallback={<div className="tree-flat-container ui-block"><LoadingIndicator/></div>}>
            <TreeFlat></TreeFlat>
          </Suspense>
          <IconButton className={`hide-sidebar-btn ${sidebarHidden ?  "rotated" : " "}`} style={{
            margin: 0,
            position: "absolute",
            top: "48%",
            padding: 0,
            right: "0rem",
          }} onClick={() => setSidebarHidden(!sidebarHidden)}>
            <MdOutlineKeyboardDoubleArrowRight size={24}/>

          </IconButton>
        </div>



        <AnimatePresence mode="wait">
          {!sidebarHidden &&
              <motion.div className="flex flex-col sidebar"
                  initial={{
                    x:0
                  }}
                  animate={{
                    x: [400, 0]

                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                    times: [0 , .5, .7, .8, 1]
                  }}
                  exit={{
                    x:400
                  }}

                  style={{
                    position: "relative",
                  }}
              >
                {/*<div className="flex flex-col sidebar relative"*/}
                {/*     style={{flexGrow: 1}}*/}
                {/*>*/}
                  <ErrorOutput></ErrorOutput>

                  <HelpBar></HelpBar>
                {/*</div>*/}
              </motion.div>
          }
        </AnimatePresence>
      </div>
  )
}

