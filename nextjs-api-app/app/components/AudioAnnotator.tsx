"use client"

import React, { useState } from 'react';
import { useAudioLoader } from '../hooks/useAudioLoader';
import { AudioWaveform } from './AudioWaveform';

interface AudioAnnotatorProps {
  audioUrl: string;
  onRangeSelect?: (start: number, end: number) => void;
}

export const AudioAnnotator: React.FC<AudioAnnotatorProps> = ({ audioUrl, onRangeSelect }) => {
  const { audio, analyser } = useAudioLoader(audioUrl);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null);

  const togglePlay = () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const duration = audio?.duration || 0;
    const timePerPixel = duration / canvas.width;
    const startTime = x * timePerPixel;

    const handleMouseUp = (e2: MouseEvent) => {
      const x2 = e2.clientX - rect.left;
      const endTime = x2 * timePerPixel;
      setSelection({ start: Math.min(startTime, endTime), end: Math.max(startTime, endTime) });
      onRangeSelect?.(Math.min(startTime, endTime), Math.max(startTime, endTime));
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      <button onClick={togglePlay}>{isPlaying ? '暂停' : '播放'}</button>
      <div style={{ marginTop: '20px', position: 'relative' }}>
        <AudioWaveform analyser={analyser} />
        {selection && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: `${(selection.start / (audio?.duration || 1)) * 100}%`,
              width: `${((selection.end - selection.start) / (audio?.duration || 1)) * 100}%`,
              height: '100%',
              backgroundColor: 'rgba(255, 0, 0, 0.3)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    </div>
  );
};
