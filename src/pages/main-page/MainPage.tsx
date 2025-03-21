import {ErrorOutput} from "../../features/error-output/component/ErrorOutput";
import React, {lazy, Suspense, useContext, useEffect, useState} from "react";
import {LoadingIndicator} from "../../common/components/loading/LoadingIndicator";
import {Header} from "../../common/header/Header";
import {GammaContent} from "../../features/tree/component/gamma/GammaContent";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import {Key, Tab, TabList, TabPanel, Tabs} from 'react-aria-components';
import {ConfigurationContext} from "../../features/configurations/context/ConfigurationContext";
import translations from "../../features/configurations/data/translations";

const TreeFlat = lazy(() => import('../../features/tree/component/TreeFlat'))
const LambdaInput = lazy(() => import('../../features/lambda-input/component/LambdaInput'))

export enum Screen {
  PC,
  MOBILE
}

export function MainPage() {
  const [showAliases, setShowAliases] = useState(false)

  const confCtx = useContext(ConfigurationContext);
  const [screen, setScreen] = useState<Screen>()

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries)
        setScreen(entry.contentRect.width > 1024 ? Screen.PC : Screen.MOBILE);
    });

    observer.observe(document.body);
    return () => observer.disconnect();
  }, []);

  const [selectedTab, setSelectedTab] = useState<Key>('FoR');

  const [resized, setResized] = useState(false)

  return (
      <div className="main-page flex flex-col relative">
        <Header/>

        {screen === Screen.PC &&
            <PanelGroup direction={'vertical'} className="main-pane flex flex-col relative" style={{flexGrow: 10}}>
                <Panel defaultSize={50} minSize={25} className="flex flex-col-reverse lg:flex-row grow relative">
                    <PanelGroup direction={'horizontal'} className="flex  lg:flex-row grow relative"
                                style={{marginRight: "1rem"}}>
                        <Suspense
                            fallback={
                              <div className="lambda-input ui-block flex-row justify-center items-center">
                                <LoadingIndicator/>
                              </div>}
                        >
                            <Panel defaultSize={75} minSize={25} className="flex grow">
                                <LambdaInput></LambdaInput>
                            </Panel>
                            <PanelResizeHandle className="resize resize-horizontal"/>
                            <Panel className={`flex grow`} collapsible={true} defaultSize={25} minSize={15}
                            >
                                <ErrorOutput></ErrorOutput>
                            </Panel>
                        </Suspense>
                    </PanelGroup>
                </Panel>

                <PanelResizeHandle className="resize resize-vertical"/>
                <Panel onResize={()=>{setResized(!resized)}} defaultSize={50} minSize={25} className="flex grow">
                    <Suspense
                        fallback={<div className="tree-flat-container ui-block"><LoadingIndicator/></div>}>
                        <PanelGroup direction={"horizontal"} className="flex grow relative"
                                    style={{marginRight: "1rem"}}>
                            <Panel onResize={()=>{setResized(!resized)}} minSize={25} defaultSize={75} className="flex grow">
                                <TreeFlat resized={resized} showAliases={showAliases} setShowAliases={setShowAliases}/>
                            </Panel>

                            { confCtx.showGamma && <>
                              <PanelResizeHandle className="resize resize-horizontal"/>
                              <Panel minSize={15} collapsible={true} defaultSize={25} className="flex grow">
                                  <GammaContent showAliases={showAliases}/>
                              </Panel>
                            </>}
                        </PanelGroup>
                    </Suspense>
                </Panel>
            </PanelGroup>
        }

        {screen === Screen.MOBILE &&
            <div className="main-pane-mobile">

              <Tabs className='flex flex-col grow'
                    selectedKey={selectedTab}
                    onSelectionChange={setSelectedTab}
              >
                  <TabList aria-label="History of Ancient Rome">
                      <Tab id="FoR">{translations[confCtx.language].editor.tabEditor}</Tab>
                      <Tab id="MaR">{translations[confCtx.language].editor.tabTree}</Tab>
                  </TabList>
                  <div style={{ display: selectedTab === 'FoR' ? 'block' : 'none' }}>
                    <TabPanel id="FoR" shouldForceMount={true} className="flex flex-col grow">
                        <Suspense
                            fallback={
                              <div className="lambda-input ui-block flex-row justify-center items-center">
                                <LoadingIndicator/>
                              </div>}
                        >
                            <div className="flex grow">
                                <LambdaInput></LambdaInput>
                            </div>
                            <div className="flex ">
                                <ErrorOutput></ErrorOutput>
                            </div>
                        </Suspense>
                    </TabPanel>
                  </div>
                  <div style={{ display: selectedTab === 'MaR' ? 'block' : 'none' }}>
                    <TabPanel id="MaR" shouldForceMount={true}  className="flex flex-col grow">
                        <Suspense fallback={<div className="tree-flat-container ui-block"><LoadingIndicator/></div>}>
                            <div className="flex grow mt-4">
                                <TreeFlat showAliases={showAliases} setShowAliases={setShowAliases}/>
                            </div>
                            {confCtx.showGamma && <div className="flex grow">
                                <GammaContent showAliases={showAliases}/>
                            </div>}
                        </Suspense>
                    </TabPanel>
                  </div>
              </Tabs>
            </div>
        }
      </div>
  )
}

