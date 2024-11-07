"use client";
import React, { useEffect, useRef } from "react";


// 加载图片 使用canvas 绘制
function loadImage(url: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
        console.log(url)
    });
}

function drawImage(image: HTMLImageElement, canvas: HTMLCanvasElement) {

    const ctx = canvas.getContext("2d");
    if (ctx) {
        ctx.drawImage(image, 0, 0);
    }
}

// 获取 imageData 
function getImageData(img: HTMLImageElement, rect: [number, number, number, number]) {
    const canvas = new OffscreenCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(img, 0, 0);
    const imageData = ctx?.getImageData(...rect);
    return imageData;
}


// 循环遍历 imagedata 数据
function traverseImageData(imageData: ImageData) {

    for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const a = imageData.data[i + 3];
        const avg = (r + g + b) / 3;
        imageData.data[i] = avg;
        imageData.data[i + 1] = avg;
        imageData.data[i + 2] = avg;
        imageData.data[i + 3] = a;
    }
}

// 获取上方 10% 的颜色
function getTopColor(imageData: ImageData) {
    const { data, width, height } = imageData;
    const topHeight = Math.floor(height * 0.1); // 取顶部 10% 高度

    let rTotal = 0, gTotal = 0, bTotal = 0, pixelCount = 0;

    for (let y = 0; y < topHeight; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            rTotal += data[index];
            gTotal += data[index + 1];
            bTotal += data[index + 2];
            pixelCount++;
        }
    }

    // 计算平均 RGB 值
    const rAvg = rTotal / pixelCount;
    const gAvg = gTotal / pixelCount;
    const bAvg = bTotal / pixelCount;

    return { r: Math.round(rAvg), g: Math.round(gAvg), b: Math.round(bAvg) };
}

// 获取对比色
function getContrastColor({ r, g, b }: { r: number; g: number; b: number }) {
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    return brightness > 128 ? 'black' : 'white'; // 亮度大于128则返回黑色，否则返回白色
}

export default function Page() {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        (async function () {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const context = canvas.getContext("2d");
            const img = await loadImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_DMNs0WrFVgaBczPftwfAKD37Yj6gcun-Pg&s");
            canvasRef.current.width = img.width;
            canvasRef.current.height = img.height;
            const imageData = getImageData(img, [0, 0, img.width, img.height]);
            const topColor = getTopColor(imageData!);
            const contrastColor = getContrastColor(topColor);

            if (!imageData) return;
            // traverseImageData(imageData);
            if (context) {
                context.putImageData(imageData, 0, 0);
            }
            // 设置文本样式并绘制到顶部
            if (context) {
                context.font = "24px Arial";
                context.fillStyle = contrastColor;
                context.textAlign = "center";
                context.fillText("Sample Text at Top", canvas.width / 2, 30); // 在顶部绘制文字
            }
        })()

    })
    return (
        <div>
            <canvas id="canvas" ref={canvasRef}></canvas>
        </div>
    );
}
