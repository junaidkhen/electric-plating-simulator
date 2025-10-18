import React, { useEffect, useRef, useState } from "react";

// Import image directly
import imagePath from '../assets/image.png';

interface BeakerProps {
  running: boolean;
}

const Beaker: React.FC<BeakerProps> = ({ running }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const margin = 60;
    const beakerTop = 80;
    const beakerBottom = height - 50;
    const beakerWidth = width - margin * 2;
    const waterHeight = height * 0.5;

    // 2 large Ag+ bubbles, single row
    const bubbles = [
      { x: margin + 80, y: beakerBottom - 120, r: 20, label: "Ag+" },
      { x: margin + 250, y: beakerBottom - 120, r: 20, label: "Ag+" },
    ];

    // Load image - FIXED APPROACH
    const img = new Image();
    img.src = imagePath; // Use imported image path
    img.onload = () => {
      setImageLoaded(true);
    };
    img.onerror = () => {
      console.error("Image failed to load:", imagePath);
    };

    const drawBeaker = () => {
      ctx.clearRect(0, 0, width, height);

      // 🧪 Beaker outline (straight bottom)
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#888";
      ctx.moveTo(margin, beakerTop);
      ctx.lineTo(margin, beakerBottom);
      ctx.lineTo(width - margin, beakerBottom);
      ctx.lineTo(width - margin, beakerTop);
      ctx.stroke();

      // 💧 Water
      ctx.fillStyle = "rgba(40, 231, 199, 0.35)";
      ctx.fillRect(margin + 2, beakerBottom - waterHeight, beakerWidth - 4, waterHeight);

      // ⚙️ Electrodes
      const leftElectrodeX = margin + 30;
      const rightElectrodeX = width - margin - 50;
      ctx.fillStyle = "#777";
      ctx.fillRect(leftElectrodeX, beakerBottom - waterHeight - 30, 25, waterHeight + 5);
      ctx.fillRect(rightElectrodeX, beakerBottom - waterHeight - 30, 25, waterHeight + 5);

      // 🔋 Batteries
      const batteryWidth = 40;
      const batteryHeight = 25;
      const batteryY = beakerTop - 60;

      // Left battery
      ctx.fillStyle = "#ff5252";
      ctx.fillRect(leftElectrodeX - 10, batteryY, batteryWidth, batteryHeight);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 16px Arial";
      ctx.fillText("+", leftElectrodeX + 10, batteryY + 18);

      // Right battery
      ctx.fillStyle = "#555";
      ctx.fillRect(rightElectrodeX - 10, batteryY, batteryWidth, batteryHeight);
      ctx.fillStyle = "#fff";
      ctx.fillText("−", rightElectrodeX + 10, batteryY + 18);

      // 🔌 Connecting wires (vertical wires only)
      ctx.strokeStyle = "#f0f0f0";
      ctx.lineWidth = 4;

      ctx.beginPath();
      ctx.moveTo(leftElectrodeX + 12, batteryY + batteryHeight);
      ctx.lineTo(leftElectrodeX + 12, beakerBottom - waterHeight - 30);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(rightElectrodeX + 12, batteryY + batteryHeight);
      ctx.lineTo(rightElectrodeX + 12, beakerBottom - waterHeight - 30);
      ctx.stroke();

      // 🖼️ REPLACED: Top horizontal line with your image
      if (imageLoaded) {
        const imageX = leftElectrodeX + batteryWidth - 5;
        const imageY = batteryY + batteryHeight / 2 - 15; // Adjusted Y position
        const imageWidth = (rightElectrodeX - 20) - (leftElectrodeX + batteryWidth - 5);
        const imageHeight = 40; // Increased height from 20 to 40
        
        ctx.drawImage(img, imageX, imageY, imageWidth, imageHeight);

        // 🔋 NEW: "Battery" text below the image - Center aligned
        ctx.fillStyle = "#ffffff"; // White color
        ctx.font = "bold 20px Arial"; // Same size as Ag text
        ctx.textAlign = "center";
        ctx.fillText("Battery", width / 2, imageY + imageHeight + 25);
      } else {
        // Fallback: Draw line if image not loaded
        ctx.beginPath();
        ctx.moveTo(leftElectrodeX + batteryWidth + 10, batteryY + batteryHeight / 2);
        ctx.lineTo(rightElectrodeX - 20, batteryY + batteryHeight / 2);
        ctx.stroke();
      }

      // ✨ AgNO3 text at bottom of water
      ctx.fillStyle = "#000";
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "center";
      ctx.fillText("AgNO₃", width / 2, beakerBottom - 20);

      // ✨ Left electrode bottom text: Ag
      ctx.fillStyle = "#000";
      ctx.font = "bold 20px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Ag", leftElectrodeX + 12, beakerBottom - 35);

      // ✨ Bubbles animation (only when running)
      if (running) {
        ctx.font = "16px Arial";
        ctx.textAlign = "center";

        bubbles.forEach((b) => {
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0, 180, 255, 0.6)";
          ctx.fill();
          ctx.strokeStyle = "#00aaff";
          ctx.stroke();
          ctx.fillStyle = "#fff";
          ctx.fillText(b.label, b.x, b.y + 5);

          // Left → Right slow
          b.x += 2;
          if (b.x > width - margin - 60) b.x = margin + 80;
        });
      }
    };

    let animationFrame: number;
    
    const animate = () => {
      drawBeaker();
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [running, imageLoaded]);

  return <canvas ref={canvasRef} width={600} height={420} />;
};

export default Beaker;