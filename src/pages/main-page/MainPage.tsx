import {ErrorOutput} from "../../features/error-output/component/ErrorOutput";
import {HelpBar} from "../../features/helpbar/component/HelpBar";
import React, {lazy, Suspense, useContext, useEffect, useState} from "react";
import {LoadingIndicator} from "../../common/components/loading/LoadingIndicator";
import {IconButton} from "../../common/components/button/IconButton";
import {MdFeedback, MdOutlineKeyboardDoubleArrowRight} from "react-icons/md";
import {AnimatePresence, motion} from "framer-motion";
import {Configurations} from "../../features/configurations/component/Configurations";
import {ConfigurationContext} from "../../features/configurations/context/ConfigurationContext";
import translations from "../../features/configurations/data/translations";

const TreeFlat = lazy(() => import('../../features/tree/component/TreeFlat'))
const LambdaInput = lazy(() => import('../../features/lambda-input/component/LambdaInput'))

export function MainPage() {
  const [sidebarHidden, setSidebarHidden] = useState(false)
  const [firstRender, setFirstRender] = useState(true);

  const confContext = useContext(ConfigurationContext)

  useEffect(() => {
    setFirstRender(false);
  }, []);

  return (
      <div className="main-page flex flex-row relative">
        {!sidebarHidden && <IconButton className="feedback-btn"
                     style={{
                       position: "absolute",
                       bottom: "1rem",
                       right: "1rem",
                       zIndex: 1100,
                     }}
                     onClick={() => {window.open("http://google.com", "_blank");
                     }}
        >
          {translations[confContext.language].feedback}
          <MdFeedback size={24}/>
        </IconButton>}

        <div className="main-pane flex flex-col relative" style={{flexGrow: 10}}>

          <Suspense
              fallback={
                <div className="lambda-input ui-block flex-row justify-center items-center">
                  <LoadingIndicator/>
                </div>}
          >
            <LambdaInput></LambdaInput>
          </Suspense>

          <Suspense
              fallback={<div className="tree-flat-container ui-block"><LoadingIndicator/></div>}>
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
                  initial={firstRender ? false : { x: 400 }}
                  animate={{x: [400, 0]}}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                    times: [0 , .5, .7, .8, 1]
                  }}
                  exit={{x:400}}
                  style={{
                    position: "relative",
                  }}
              >
                  <ErrorOutput></ErrorOutput>
                  <Configurations></Configurations>

                  <HelpBar></HelpBar>


              </motion.div>
          }
        </AnimatePresence>
      </div>
  )
}

