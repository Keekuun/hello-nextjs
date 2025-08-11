"use client"

import React from 'react';
import { AudioAnnotator } from '@/app/components/AudioAnnotator';
function AudioDemo() {
  const audioUrl = '/api/proxy/audio?soundid=38984&type=mp3';

  return (
    <div>
      <h2>音频标注系统</h2>
      <AudioAnnotator
        audioUrl={audioUrl}
        onRangeSelect={(start: number, end: number) => {
          console.log(`选中时间范围：${start.toFixed(2)}s - ${end.toFixed(2)}s`);
        }}
      />
    </div>
  );
}

export default AudioDemo;
