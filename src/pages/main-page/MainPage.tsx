import {ErrorOutput} from "../../features/error-output/component/ErrorOutput";
import React, {lazy, Suspense, useContext, useEffect, useState} from "react";
import {LoadingIndicator} from "../../common/components/loading/LoadingIndicator";
import {IconButton} from "../../common/components/button/IconButton";
import {MdOutlineKeyboardDoubleArrowRight} from "react-icons/md";
import {AnimatePresence, motion} from "framer-motion";
import {ConfigurationContext} from "../../features/configurations/context/ConfigurationContext";
import {Header} from "../../common/header/Header";

const TreeFlat = lazy(() => import('../../features/tree/component/TreeFlat'))
const LambdaInput = lazy(() => import('../../features/lambda-input/component/LambdaInput'))

export function MainPage() {
  const [sidebarHidden, setSidebarHidden] = useState(false)
  const [firstRender, setFirstRender] = useState(true);


  useEffect(() => {
    setFirstRender(false);
  }, []);

  return (
      <div className="main-page flex flex-col relative">
        <Header/>

        <div className="main-pane flex flex-col relative" style={{flexGrow: 10}}>
          <div className="flex flex-col-reverse lg:flex-row grow relative"

          >
            <IconButton className={`hide-sidebar-btn ${sidebarHidden ? "rotated" : " "}`} style={{
              margin: 0,
              position: "absolute",
              top: 30,
              padding: 0,
              right: 30,
              zIndex: 10000,
            }} onClick={() => setSidebarHidden(!sidebarHidden)} title={"Show/Hide errors"}>
              <MdOutlineKeyboardDoubleArrowRight
                  color="var(--M3-sys-light-on-secondary-container, var(--Schemes-On-Secondary-Container, #4A4459))"
                  size={24}/>

            </IconButton>
            <Suspense
                fallback={
                  <div className="lambda-input ui-block flex-row justify-center items-center">
                    <LoadingIndicator/>
                  </div>}
            >
              <LambdaInput></LambdaInput>
            </Suspense>
            <AnimatePresence mode="wait">
              {!sidebarHidden &&
                  <motion.div className="flex flex-col grow lg:max-w-96"
                              initial={firstRender ? false : {x: 400}}
                              animate={{x: [400, 0]}}
                              transition={{
                                duration: 0.4,
                                ease: "easeInOut",
                                times: [0, .5, .7, .8, 1]
                              }}
                              exit={{x: 400}}

                  >
                      <ErrorOutput></ErrorOutput>
                  </motion.div>
              }
            </AnimatePresence>
          </div>
          <div className="flex grow">
            <Suspense
                fallback={<div className="tree-flat-container ui-block"><LoadingIndicator/></div>}>
              <TreeFlat></TreeFlat>
            </Suspense>
          </div>

        </div>


      </div>
  )
}

