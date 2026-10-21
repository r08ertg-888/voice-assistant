import React, { useEffect, useRef } from 'react';
import { VoiceStatus } from '../types';
import { getAnalyser } from '../utils/audio';

interface VoiceVisualizerProps {
  status: VoiceStatus;
  isAudioPlaying: boolean;
  className?: string;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  status,
  isAudioPlaying,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let analyser: AnalyserNode | null = null;
    try {
      analyser = getAnalyser();
    } catch {}

    const bufferLength = analyser ? analyser.frequencyBinCount : 64;
    const dataArray = new Uint8Array(bufferLength);
    let phase = 0;

    const render = () => {
      phase += 0.03;
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      let amplitude = 0.12;

      if (isAudioPlaying || status === 'speaking') {
        if (analyser) {
          analyser.getByteFrequencyData(dataArray);
          const sum = dataArray.reduce((acc, val) => acc + val, 0);
          amplitude = Math.max(0.2, (sum / bufferLength / 255) * 1.6);
        } else {
          amplitude = 0.55 + Math.sin(phase * 3) * 0.25;
        }
      } else if (status === 'listening') {
        amplitude = 0.4 + Math.sin(phase * 4) * 0.18;
      } else if (status === 'thinking') {
        amplitude = 0.25 + Math.sin(phase * 2) * 0.08;
      } else {
        // Idle gentle breathing
        amplitude = 0.12 + Math.sin(phase * 1.2) * 0.04;
      }

      // Draw subtle concentric luxury harmonic rings
      const baseRadius = Math.min(centerX, centerY) * 0.52;
      const rings = [
        { scale: 0.75, opacity: 0.15, speed: 1.0, color: 'rgba(28, 25, 23,' },
        { scale: 0.95, opacity: 0.35, speed: 1.4, color: 'rgba(68, 64, 60,' },
        { scale: 1.15, opacity: 0.65, speed: 1.8, color: 'rgba(28, 25, 23,' },
        { scale: 1.35, opacity: 0.25, speed: 2.2, color: 'rgba(120, 113, 108,' },
      ];

      rings.forEach((ring, idx) => {
        ctx.beginPath();
        const numPoints = 64;
        for (let i = 0; i <= numPoints; i++) {
          const theta = (i / numPoints) * Math.PI * 2;
          const wave =
            Math.sin(theta * 3 + phase * ring.speed) * (amplitude * 18) +
            Math.cos(theta * 5 - phase * 1.5) * (amplitude * 10);
          const r = baseRadius * ring.scale + wave;
          const x = centerX + Math.cos(theta) * r;
          const y = centerY + Math.sin(theta) * r;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();

        ctx.strokeStyle = `${ring.color} ${ring.opacity})`;
        ctx.lineWidth = idx === 2 ? 1.75 : 1;
        ctx.stroke();

        // Subtle center wash
        if (idx === 1 && (status === 'speaking' || isAudioPlaying)) {
          ctx.fillStyle = 'rgba(28, 25, 23, 0.03)';
          ctx.fill();
        }
      });

      // Central core dot
      ctx.beginPath();
      const coreR = 4 + amplitude * 5;
      ctx.arc(centerX, centerY, coreR, 0, Math.PI * 2);
      ctx.fillStyle =
        status === 'speaking' || isAudioPlaying
          ? 'rgba(28, 25, 23, 0.9)'
          : status === 'listening'
          ? 'rgba(120, 53, 15, 0.9)' // warm amber for listening
          : status === 'thinking'
          ? 'rgba(87, 83, 78, 0.7)'
          : 'rgba(28, 25, 23, 0.45)';
      ctx.fill();

      // Subtle pulse halo when speaking
      if (status === 'speaking' || isAudioPlaying) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, coreR * 2.8, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(28, 25, 23, 0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [status, isAudioPlaying]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={340}
        height={340}
        className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px]"
      />
    </div>
  );
};
