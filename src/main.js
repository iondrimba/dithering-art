import './style.css';
import { gsap } from "gsap";
import { Pane } from "tweakpane";

function App() {
  this.canvas = document.getElementById("canvas");
  this.video = document.getElementById("video");
  this.canvasvideo = document.getElementById("canvasvideo");
  this.config = {
    delta: 1.8,
    pixelPosY: 3,
    pixelPosX: 1,
    color: "#15073d"
  };

  this.setup = () => {
    this.scale = 2;
    this.context = this.canvas.getContext("2d", { willReadFrequently: true });
    this.canvasvideoCtx = this.canvasvideo.getContext("2d", {
      willReadFrequently: true
    });
  };

  this.renderVideo = () => {
    const scale = 1;
    this.canvasvideo.width = this.video.videoWidth * scale;
    this.canvasvideo.height = this.video.videoHeight * scale;

    this.canvas.width = Math.round(this.canvasvideo.width);
    this.canvas.height = Math.round(this.canvasvideo.height);

    this.canvasvideoCtx.drawImage(
      this.video,
      1,
      1,
      this.canvas.width - 2,
      this.canvas.height - 2
    );

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
      label: "Density",
      min: 1,
      max: 20,
      step: 0.1,
      value: this.config.delta
    });

    const pixelPosYSlider = pane.addBinding(this.config, "pixelPosY", {
      view: "slider",
      label: "Spacing X",
      min: 1,
      max: 20,
      step: 1,
      value: this.config.pixelPosY
    });

    const pixelPosXSlider = pane.addBinding(this.config, "pixelPosX", {
      view: "slider",
      label: "Spacing Y",
      min: 1,
      max: 20,
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
      label: "Color"
    });

    colorInput.on("change", (ev) => {
      this.config.color = ev.value;
      document.body.style.backgroundColor = ev.value;

      this.clear();
      this.grayscale(this.imageData.data);
      this.draw();
    });
  };

  this.grayscale = () => {
    this.imageData = this.canvasvideoCtx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    const data = this.imageData.data;
    const colors = gsap.utils.splitColor(this.config.color);

    for (let i = 0; i < data.length; i += 4) {
      const red = data[i];
      const green = data[i + 1];
      const blue = data[i + 2];
      const gray = (red + green + blue) / 5;

      const invertedGray = gray;
      data[i] = colors[0] + invertedGray; // Red
      data[i + 1] = colors[1] + invertedGray; // Green
      data[i + 2] = colors[2] + invertedGray; // Blue
    }
  };

  this.indexPixel = (i, j) => {
    return (i + j * this.canvas.width) * 4;
  };

  this.clear = () => {
    this.context.drawImage(
      this.img,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    this.imageData = this.context.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  };

  this.draw = () => {
    this.grayscale();

    for (let y = 0; y < this.canvas.height - 1; y++) {
      for (let x = 1; x < this.canvas.width - 1; x++) {
        const i = this.indexPixel(x, y);

        for (let delta = 0; delta < this.config.delta; delta++) {
          const oldPixel = this.imageData.data[i + delta];
          const newPixel = 255 * Math.round(oldPixel / 255);

          this.imageData.data[i + delta] = newPixel;
          const error = oldPixel - newPixel;
          this.imageData.data[
            delta +
            this.indexPixel(
              x + this.config.pixelPosY,
              y + this.config.pixelPosX
            )
          ] += error * (this.config.delta / 16);
        }
      }
    }

    this.context.putImageData(this.imageData, 0, 0);
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new App();

  app.setup();

  app.setupTweakpane();

  app.video.addEventListener('loadeddata', () => {
    app.grayscale();
    app.renderVideo();
  });
});
