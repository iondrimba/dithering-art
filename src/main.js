import './style.css';
import { gsap } from "gsap";
// import { Noise } from 'noisejs';
import { Pane } from "tweakpane";
import Effects from './effects.js';

export function App() {
  this.canvas = document.getElementById('canvas');
  this.img = document.getElementById('img');
  this.offscreen = document.getElementById("canvasoff");
  this.video = document.getElementById("video");
  this.canvasvideo = document.getElementById("canvasvideo");
  this.config = {
    delta: 20,
    pixelPosY: 13,
    pixelPosX: 2,
    color: "#0e0d39",
    threshold: 9,
    lightColor: "#ffffff",
  };
  this.effects = Effects();

  this.setup = () => {
    this.scale = 1;

    this.context = this.canvas.getContext('2d', { willReadFrequently: true });
    this.canvas.width = Math.round(this.img.width * this.scale);
    this.canvas.height = Math.round(this.img.height * this.scale);
    this.context.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);

    this.imageData = this.context.getImageData(0,
      0,
      this.canvas.width,
      this.canvas.height);
  };

  this.renderVideo = () => {
    this.draw();

    requestAnimationFrame(this.renderVideo);
  };

  this.setupTweakpane = () => {
    const pane = new Pane({
      title: "Parameters",
      expanded: false
    });

    const deltaSlider = pane.addBinding(this.config, "delta", {
      view: "slider",
      label: "Delta",
      min: 1,
      max: 20,
      step: 1,
      value: this.config.delta
    });

    const thresholdSlider = pane.addBinding(this.config, "threshold", {
      view: "slider",
      label: "Threshold",
      min: 1,
      max: 255,
      step: 1,
      value: this.config.threshold
    });

    const pixelPosYSlider = pane.addBinding(this.config, "pixelPosY", {
      view: "slider",
      label: "Pixel Position Y",
      min: 1,
      max: 40,
      step: 1,
      value: this.config.pixelPosY
    });

    const pixelPosXSlider = pane.addBinding(this.config, "pixelPosX", {
      view: "slider",
      label: "Pixel Position X",
      min: 1,
      max: 40,
      step: 1,
      value: this.config.pixelPosX
    });

    deltaSlider.on("change", (ev) => {
      this.config.delta = ev.value;
      this.clear();
      this.grayscale(this.imageData.data);
      this.draw();
    });

    pixelPosYSlider.on("change", (ev) => {
      this.config.pixelPosY = ev.value;
      this.clear();
      this.grayscale(this.imageData.data);
      this.draw();
    });

    pixelPosXSlider.on("change", (ev) => {
      this.config.pixelPosX = ev.value;
      this.clear();
      this.grayscale(this.imageData.data);
      this.draw();
    });

    const colorInput = pane.addBinding(this.config, "color", {
      label: "Primary Color",
    });

    colorInput.on("change", (ev) => {
      this.config.color = ev.value;

      this.clear();
      this.grayscale(this.imageData.data);
      this.draw();
    });

    const colorLightInput = pane.addBinding(this.config, "lightColor", {
      label: "Secondary Color"
    });

    colorLightInput.on("change", (ev) => {
      this.config.lightColor = ev.value;

      this.clear();
      this.grayscale(this.imageData.data);
      this.draw();
    });
  };

  this.grayscale = () => {
    this.imageData = this.context.getImageData(0,
      0,
      this.canvas.width,
      this.canvas.height);

    const data = this.imageData.data;
    const colors = gsap.utils.splitColor(this.config.color);

    for (let i = 0; i < data.length; i += 4) {
      // const red = data[i];
      // const green = data[i + 1];
      // const blue = data[i + 2];

      // Calculate the grayscale value

      const red = data[i];
      const green = data[i + 1];
      const blue = data[i + 2];
      const gray = (red + green + blue) / 32;
      // const gray = 0.25 * red + 0.65 * green + 0.10 * blue;
      // Set all channels to the grayscale value
      const invertedGray = gray;
      data[i] = colors[0] + invertedGray; // Red
      data[i + 1] = colors[1] + invertedGray; // Green
      data[i + 2] = colors[2] + invertedGray; // Blue
    }
  };

  this.indexPixel = (i, j) => {
    return (i + (j * this.canvas.width)) * 4;
  };

  this.clear = () => {
    this.context.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);

    this.imageData = this.context.getImageData(0,
      0,
      this.canvas.width,
      this.canvas.height);
  };

  this.draw = () => {
    this.clear();
    this.grayscale();

    // const method = document.getElementById('ditherMethod').value;
    // const threshold = parseInt(document.getElementById('threshold').value);
    // const color1 = document.getElementById('color1').value;
    // const color2 = document.getElementById('color2').value;

    // // Get image data from original canvas
    // const imageData = this.originalCtx.getImageData(0, 0, this.originalCanvas.width, this.originalCanvas.height);

    // let ditheredData;

    // if (method === 'ordered') {
    //   // Ordered dithering
    //   const pattern = document.getElementById('ditherPattern').value;
    //   const ditherMatrix = this.getDitherMatrix(pattern);
    //   const normalizedMatrix = this.normalizeBayerMatrix(ditherMatrix);
    //   ditheredData = this.applyBayerDithering(imageData, normalizedMatrix, threshold, color1, color2);
    // } else {
    //   // Error diffusion
    //   const errorPattern = document.getElementById('errorPattern').value;
    //   ditheredData = this.applyErrorDiffusion(imageData, errorPattern, threshold, color1, color2);
    // }

    // // Draw result to dithered canvas
    // this.ditheredCanvas.width = this.originalCanvas.width;
    // this.ditheredCanvas.height = this.originalCanvas.height;
    // this.ditheredCtx.putImageData(ditheredData, 0, 0);
    let t = performance.now() * 0.01;

    for (let y = 0; y < this.canvas.height; y++) {
      for (let x = 0; x < this.canvas.width; x++) {

        const i = this.indexPixel(x, y);
        let oldPixel = 0;
        let newPixel = 0;
        oldPixel += this.imageData.data[i + (this.config.delta) * 2];
        newPixel += 255 * Math.round(oldPixel / 255);

        this.imageData.data[i + this.config.delta] = newPixel;
        const error = oldPixel - newPixel;
        this.imageData.data[this.config.delta + this.indexPixel(x + this.config.pixelPosY, y + this.config.pixelPosX)] += error * (1 / 1.2);

        // for (let delta = 0; delta < this.config.delta; delta++) {
        //   // const oldPixel = this.imageData.data[i + delta];
        //   // const newPixel = 255 * Math.round(oldPixel / 255);

        //   // this.imageData.data[i + delta] = newPixel;
        //   // const error = oldPixel - newPixel;
        //   // this.imageData.data[delta + this.indexPixel(x + 1, y + this.config.pixelPosX)] += error * (1 / 2);
        //   // this.imageData.data[delta + this.indexPixel(x - 1, y + 1)] += error * (1 / 4);
        //   // this.imageData.data[delta + this.indexPixel(x, y + 1)] += error * (1 / 4);
        // }
      }
    }

    // let t = performance.now() * 0.01; // time in seconds

    // for (let y = 0; y < this.canvas.height; y++) {
    //   for (let x = 0; x < this.canvas.width; x++) {
    //     // Animate between 0 and 255
    //     let value = 255 * Math.sin(t + x * 0.1 + y * 0.1);
    //     console.log(value);
    //     // Use value for pixel color, e.g.:
    //     const i = this.indexPixel(x, y);
    //     // this.imageData.data[i] = value;     // R
    //     // this.imageData.data[i + 1] = value; // G
    //     // this.imageData.data[i + 2] += value; // Bs
    //     // this.imageData.data[i + 3] = 255;   // A
    //   }
    // }

    this.context.putImageData(this.imageData, 0, 0);

    // let ditheredData;
    // const ditherMatrix = this.effects.getDitherMatrix('spiral4');
    // const normalizedMatrix = this.effects.normalizeBayerMatrix(ditherMatrix);
    // ditheredData = this.applyBayerDithering(this.imageData, normalizedMatrix, this.config.threshold, this.config.color, this.config.lightColor);
    // this.context.putImageData(ditheredData, 0, 0);
  };

  this.applyBayerDithering = (imageData, bayerMatrix, threshold = 128, color1 = '#000000', color2 = '#ffffff') => {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const matrixSize = bayerMatrix.length;

    // Parse colors
    const darkColor = this.effects.hexToRgb(color1);
    const lightColor = this.effects.hexToRgb(color2);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;

        // Convert to grayscale
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const gray = Math.floor(0.119 * r + 0.187 * g + 0 * b);

        // Get threshold from Bayer matrix
        const matrixX = x % matrixSize;
        const matrixY = y % matrixSize;
        const bayerThreshold = bayerMatrix[matrixY][matrixX];

        // Apply dithering - compare against adjusted threshold
        const adjustedThreshold = threshold + (bayerThreshold - 128);
        const useLightColor = gray > adjustedThreshold;

        // Set pixel to chosen color
        if (useLightColor) {
          data[idx] = lightColor.r;     // R
          data[idx + 1] = lightColor.g; // G
          data[idx + 2] = lightColor.b; // B
        } else {
          data[idx] = darkColor.r;      // R
          data[idx + 1] = darkColor.g;  // G
          data[idx + 2] = darkColor.b;  // B
        }
        // Alpha channel remains unchanged
      }
    }

    return imageData;

  };

  this.animateVariable = (obj, key, min, max, duration = 1, onUpdate) => {
    gsap.to(obj, {
      [key]: max,
      from: min,
      duration: duration,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      onUpdate: onUpdate ? onUpdate : undefined
    });
  };
};


document.addEventListener('DOMContentLoaded', () => {
  const app = new App();

  app.setup();

  app.setupTweakpane();

  requestAnimationFrame(app.renderVideo);

});
