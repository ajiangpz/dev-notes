"use client";
import React, { useEffect, useRef } from "react";

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function getImageData(
  img: HTMLImageElement,
  rect: [number, number, number, number]
) {
  const canvas = new OffscreenCanvas(img.width, img.height); // 创建一个 OffscreenCanvas
  const ctx = canvas.getContext("2d");
  ctx?.drawImage(img, 0, 0); // 绘制图片
  const imageData = ctx?.getImageData(...rect); // 获取指定区域的 ImageData
  return imageData;
}

function getTopColor(imageData: ImageData) {
  const { data, width, height } = imageData;
  const topHeight = Math.floor(height * 0.1);

  let rTotal = 0,
    gTotal = 0,
    bTotal = 0,
    pixelCount = 0;

  for (let y = 0; y < topHeight; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      rTotal += data[index];
      gTotal += data[index + 1];
      bTotal += data[index + 2];
      pixelCount++;
    }
  }

  const rAvg = rTotal / pixelCount;
  const gAvg = gTotal / pixelCount;
  const bAvg = bTotal / pixelCount;

  return { r: Math.round(rAvg), g: Math.round(gAvg), b: Math.round(bAvg) };
}

function getContrastColor({ r, g, b }: { r: number; g: number; b: number }) {
  const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
  return brightness > 128 ? "black" : "white";
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    (async function () {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d");

      const img = await loadImage("/images/light-theme.jpeg");

      canvas.width = img.width;
      canvas.height = img.height;

      const imageData = getImageData(img, [0, 0, img.width, img.height]);
      if (!imageData) return;

      const topColor = getTopColor(imageData);
      const contrastColor = getContrastColor(topColor);
      if (context) {
        context.putImageData(imageData, 0, 0);

        // 设置文本样式并绘制到顶部
        context.font = "24px Arial";
        context.fillStyle = contrastColor;
        context.textAlign = "center";
        context.fillText("Sample Text at Top", canvas.width / 2, 30);
      }
    })();
  }, []);

  return (
    <div>
      <canvas id="canvas" ref={canvasRef}></canvas>
    </div>
  );
}
