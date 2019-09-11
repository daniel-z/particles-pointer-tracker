import * as dat from 'dat.gui';

class ParticleControls {
  gui = {};
  elementToControl = {};
  initialControlSettings = [];
  guiSettings = {
    resizable: false,
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
    this
      .elementToControl
      .change(attribute, data);
  }

  createSelectControl(control) {
    this
      .gui
      .add(this.elementToControl[control.attribute], control.attribute, control.values)
      .onChange((data) => {
        this.change(control.attribute, data)
      });
  }

  createSliderControl(control) {
    const guiControl = this
      .gui
      .add(this.elementToControl, control.attr, control.min, control.max)
      .onChange((data) => {
        this.change(control.attr, data)
      });

    if (control.step) {
      guiControl.step(control.step);
    }
  }

  initialize() {
    this
      .initialControlSettings
      .forEach((controlSetting) => {
        if (controlSetting.type === 'select') {
          this.createSelectControl(controlSetting);
        } else {
          this.createSliderControl(controlSetting);
        }
      });
  }
}

class ParticlePointerTracker {
  dots = [];
  particleCount = 500;
  radius = 5;
  trail = 0.2;
  hueStart = 200;
  hueRange = 40;
  lerpMax = 0.85;
  lerpMin = 0.2;
  rotation = 10;
  shape = {
    shape: 0
  };

  controlsSettings = [
    {
      attr: 'particleCount',
      min: 10,
      max: 3000,
      step: 10
    }, {
      attr: 'rotation',
      min: 1,
      max: 30,
      step: 1
    }, {
      attr: 'hueStart',
      min: 0,
      max: 360,
      step: 1
    }, {
      attr: 'hueRange',
      min: 0,
      max: 50,
      step: 1
    }, {
      attr: 'radius',
      min: 1,
      max: 10
    }, {
      attr: 'lerpMin',
      min: 0.5,
      max: 0.9
    }, {
      attr: 'lerpMax',
      min: 0.9,
      max: 0.99
    }, {
      attr: 'trail',
      min: 0.02,
      max: 1
    }, {
      type: 'select',
      attribute: 'shape',
      values: {
        circle: 0,
        infinity: 1,
        bouncy_triangle: 2,
        vortex: 3
      }
    }
  ];

  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this
      .canvas
      .getContext("2d");
    this.w = this.ctx.canvas.width = window.innerWidth;
    this.h = this.ctx.canvas.height = window.innerHeight;
    this.cX = this.w / 2;
    this.cY = this.h / 2;
    this.UIControls = new ParticleControls(this);
  }

  init() {
    this.initializeEvents();
    this.emit();
    this.draw();
    this
      .UIControls
      .initialize();
  }

  initializeEvents() {
    window.onresize = () => {
      this.onResize();
    };
    document.onmousemove = (event) => {
      this.onMouseOver(event)
    };
    document.ontouchmove = (event) => {
      this.onTouchMove(event)
    };

    setTimeout(() => {
      clearTimeout(setInterval(this.prev, 17));
    }, 700);
  }

  onResize() {
    this.w = this.ctx.canvas.width = window.innerWidth;
    this.h = this.ctx.canvas.height = window.innerHeight;
  }

  onMouseOver(event) {
    this.cX = event.pageX;
    this.cY = event.pageY;
  }

  onTouchMove(event) {
    this.cX = event.touches[0].pageX;
    this.cY = event.touches[0].pageY;
  }

  change(attribute, data) {
    if (!data) {
      return;
    }

    if (attribute === 'shape') {
      this.shape.shape = parseInt(data);
    } else {
      this[attribute] = data;
    }

    this.dots = [];
    this.emit();
  }

  emit() {
    for (let i = 0; i < this.particleCount; i++) {
      this
        .dots
        .push({
          x: 0,
          y: 0,
          h: Math.random() * ((this.hueStart + this.hueRange) - (this.hueStart - this.hueRange)) + (this.hueStart - this.hueRange),
          a: (i + 1) * (360 / this.particleCount),
          n: Math.random() * (this.lerpMax - this.lerpMin) + this.lerpMin
        });
    }
  }

  getRotationForCircle(dot, lerpX, lerpY, cX) {
    dot.x = this
      .rotate(dot.x, dot.y, lerpX, lerpY, dot.a)
      .x;
    dot.y = this.rotate(dot.x, dot.y, this.lerp(cX, dot.x, dot.n), lerpY, dot.a).y;
  }

  getRotationForInfinity(dot, lerpX, lerpY) {
    dot.x = this
      .rotate(dot.x, dot.y, lerpX, lerpY, dot.a)
      .x;
    dot.y = this
      .rotate(dot.x, dot.y, lerpX, lerpY, dot.a)
      .y;
  }

  getRotationForTriangle(dot, cX, cY) {
    dot.x = this.rotate(dot.x, dot.y, this.lerp(cX, dot.x, Math.sin(dot.n)), this.lerp(cY, dot.y, Math.tan(dot.n)), dot.a).x;
    dot.y = this.rotate(dot.x, dot.y, this.lerp(cX, dot.x, Math.sin(dot.n)), this.lerp(cY, dot.y, Math.sin(dot.n)), dot.a).y;
  }

  getRotationForVortex(dot, cX, cY) {
    dot.x = this.rotate(dot.x, dot.y, this.lerp(cX, dot.x, Math.tan(dot.n)), this.lerp(cY, dot.y, Math.tan(dot.n)), dot.a).x;
    dot.y = this.rotate(dot.x, dot.y, this.lerp(cX, dot.x, Math.asin(dot.n)), this.lerp(cY, dot.y, Math.asin(dot.n)), dot.a).y;
  }

  setup2DContext() {
    this.ctx.fillStyle = `rgba(0,0,0, ${this.trail} )`;
    this
      .ctx
      .rect(0, 0, this.w, this.h);
    this
      .ctx
      .fill();
  }

  drawDot(dot, radius) {
    this
      .ctx
      .beginPath();
    this.ctx.fillStyle = `hsla(${dot.h}, 100%, 50%, 1)`;
    this
      .ctx
      .arc(dot.x, dot.y, radius * (dot.n * dot.n), 0, Math.PI * 2);
    this
      .ctx
      .fill();
    this
      .ctx
      .closePath();
  }

  drawCircle() {
    this
      .dots
      .forEach((dot) => {
        this.drawDot(dot, this.radius);
        let lerpX = this.lerp(this.cX, dot.x, dot.n);
        let lerpY = this.lerp(this.cY, dot.y, dot.n);
        dot.a += this.rotation % 360;
        this.getRotationForCircle(dot, lerpX, lerpY, this.cX);
      });
  }

  drawInfinity() {
    this
      .dots
      .forEach((dot) => {
        this.drawDot(dot, this.radius);
        let lerpX = this.lerp(this.cX, dot.x, dot.n);
        let lerpY = this.lerp(this.cY, dot.y, dot.n);
        dot.a += this.rotation % 360;
        this.getRotationForInfinity(dot, lerpX, lerpY);
      });
  }

  drawTriangle() {
    this
      .dots
      .forEach((dot) => {
        this.drawDot(dot, this.radius);
        dot.a += this.rotation % 360;
        this.getRotationForTriangle(dot, this.cX, this.cY);
      });
  }

  drawVortex() {
    this
      .dots
      .forEach((dot) => {
        this.drawDot(dot, this.radius);
        dot.a += this.rotation % 360;
        this.getRotationForVortex(dot, this.cX, this.cY);
      });
  }

  draw() {
    this.setup2DContext();

    switch (this.shape.shape) {
      case 0:
        this.drawCircle();
        break;
      case 1:
        this.drawInfinity();
        break;
      case 2:
        this.drawTriangle();
        break;
      case 3:
      default:
        this.drawVortex();
        break;
    }

    setTimeout(() => {
      requestAnimationFrame(() => {
        this.draw();
      });
    }, 0);
  }

  rotate(pointX, pointY, originX, originY, angle) {
    const newAngle = angle * Math.PI / 180.0;
    return {
      x: Math.cos(newAngle) * (pointX - originX) - Math.sin(newAngle) * (pointY - originY) + originX,
      y: Math.sin(newAngle) * (pointX - originX) + Math.cos(newAngle) * (pointY - originY) + originY
    };
  }

  lerp(p1, p2, n) {
    return (1 - n) * p1 + n * p2;
  }

  prev() {
    this.cX += 20;
  }
}

export default ParticlePointerTracker;