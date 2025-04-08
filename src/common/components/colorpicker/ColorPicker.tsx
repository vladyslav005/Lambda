import {
  Button,
  ColorArea,
  ColorAreaProps,
  ColorField,
  ColorFieldProps,
  ColorPicker,
  ColorPickerProps,
  ColorSlider,
  ColorSliderProps,
  ColorSwatch,
  ColorSwatchProps,
  ColorThumb,
  Dialog,
  DialogTrigger,
  Input,
  Label,
  Popover,
  SliderOutput,
  SliderTrack
} from 'react-aria-components';
import "./style.css"


interface MyColorPickerProps extends ColorPickerProps {
  label: string;
}

export const MyColorPicker = (props: MyColorPickerProps) => {

  return (
      <ColorPicker {...props} >
        <DialogTrigger>
          <Button className="color-picker">
            <MyColorSwatch/>
            <span className="pl-1 label font-normal"
                  style={{
                    fontSize: '1rem',
                  }}
            >{props.label}</span>
          </Button>
          <Popover placement="bottom start">
            <Dialog className="color-picker-dialog">
              <MyColorArea
                  colorSpace="hsb"
                  xChannel="saturation"
                  yChannel="brightness"
              />
              <MyColorSlider colorSpace="hsb" channel="hue"/>
              <MyColorField/>
            </Dialog>
          </Popover>
        </DialogTrigger>
      </ColorPicker>
  )
}

const MyColorArea = (props: ColorAreaProps) => {

  return (
      <ColorArea {...props}>
        <ColorThumb/>
      </ColorArea>
  )
}


const MyColorSwatch = (props: ColorSwatchProps) => {
  return (
      <ColorSwatch {...props} />
  )
}

const MyColorSlider = (props: ColorSliderProps) => {

  return (
      <ColorSlider {...props}>
        {/*<Label/>*/}
        <SliderOutput/>
        <SliderTrack>
          <ColorThumb/>
        </SliderTrack>
      </ColorSlider>
  )
}

const MyColorField = (props: ColorFieldProps) => {

  return (
      <ColorField {...props}>
        <Label>Hex</Label>
        <Input/>
      </ColorField>
  )
}