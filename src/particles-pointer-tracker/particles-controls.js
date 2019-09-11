import * as dat from 'dat.gui';

// controls
export default class Controls {
  gui = {};
  elementToControl = {};
  initialControlSettings = [];
  guiSettings = {
    resizable : false,
    hideable: true,
    closeOnTop: true,
    closed: true
  };

  constructor(elementToControl) {
    this.gui = new dat.GUI(this.guiSettings);
    this.elementToControl = elementToControl;
    this.initialControlSettings = elementToControl.controlsSettings;
  }

  change(attribute, data) {
    this.elementToControl.change(attribute, data);
  }

  createSelectControl(control) {
    this.gui.add(this.elementToControl[control.attribute], control.attribute, control.values)
      .onChange((data) => {
        this.change(control.attribute, data)
      });
  }

  createSliderControl(control) {
    const guiControl = this.gui
      .add(this.elementToControl, control.attr, control.min, control.max)
      .onChange((data) => { this.change(control.attr, data) });

    if (control.step) {
      guiControl.step(control.step);
    }
  }

  initialize() {
    this.initialControlSettings.forEach((controlSetting) => {
      if (controlSetting.type === 'select') {
        this.createSelectControl(controlSetting);
      } else {
        this.createSliderControl(controlSetting);
      }
    });
  }
}
