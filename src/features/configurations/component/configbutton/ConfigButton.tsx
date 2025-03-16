import {
  Button,
  Dialog,
  Group,
  Input,
  Label,
  MenuTrigger,
  Popover,
  Separator,
  Switch,
  TextField
} from "react-aria-components";
import {IconButton, MyRipples} from "../../../../common/components/button/IconButton";
import translations from "../../data/translations";
import "./ConfigButoon.css"
import {MdAdd, MdOutlineSettings, MdRemove} from "react-icons/md";
import React, {useContext} from "react";
import {ConfigurationContext} from "../../context/ConfigurationContext";
import {EditorContext} from "../../../lambda-input/context/EditorContext";

export const ConfigButton = () => {
  const confCtx = useContext(ConfigurationContext);
  const editorContext = useContext(EditorContext);

  if (!confCtx) {
    throw new Error("ConfigurationContext is not available.");
  }

  return (
      <MenuTrigger>
        <Button className="config-button flex gap-2" aria-label="Menu">
          <MyRipples during={500} color={'rgba(251,246,246,0.63)'} className="my-button">
            <MdOutlineSettings size={20} color="#ffffff"/>
          </MyRipples>
        </Button>

        <Popover>
          <Dialog className="menu-bx">
            <div className="p-4">
              <Switch
                  defaultSelected={confCtx.interactive}
                  onChange={(isChecked) => confCtx.setInteractive(isChecked)}
              >
                <div className="indicator"/>
                {translations[confCtx.language].conf.interactiveMode}
              </Switch>

            </div>
            <div className="p-4">
              <Switch
                  defaultSelected={confCtx.showGamma}
                  onChange={(isChecked) => confCtx.setShowGamma(isChecked)}
              >
                <div className="indicator"/>
                {translations[confCtx.language].conf.gammaWindow}
              </Switch>
            </div>
            <div className="p-4">
              <Switch
                  defaultSelected={confCtx.stepByStepMode}
                  onChange={(isChecked) => confCtx.setStepByStepMode(isChecked)}
              >
                <div className="indicator"/>
                {translations[confCtx.language].conf.step}
              </Switch>
            </div>

            <Separator></Separator>
            <Group aria-label="Font size" className="flex flex-row items-center p-4">
              <Label className="label">
                {translations[confCtx.language].conf.fontSize}
              </Label>
              <IconButton
                  onClick={() => {
                    if (editorContext.fontSize > 2)
                      editorContext.setFontSize(editorContext.fontSize - 2)
                  }}
              >
                <MdRemove size={20}/>
              </IconButton>
              <TextField className="font-size-field">
                <Input value={editorContext.fontSize} type={"number"} className={"text-input"}/>
              </TextField>
              <IconButton
                  onClick={() => {
                    if (editorContext.fontSize < 100)
                      editorContext.setFontSize(editorContext.fontSize + 2)
                  }}
              >
                <MdAdd size={20}/>
              </IconButton>
            </Group>
            <Separator></Separator>

          </Dialog>
        </Popover>
      </MenuTrigger>
  );
};