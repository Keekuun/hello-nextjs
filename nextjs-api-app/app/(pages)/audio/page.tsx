"use client"

import React from 'react';
import {AudioWaveSurfer} from "@/app/components/AudioWaveSurfer";
import {useAudioLoader} from "@/app/hooks/useAudioLoader";
function AudioDemo() {
  const audioUrl = '/api/proxy/audio?soundid=38984&type=mp3';

  const start = 0;
  // 100 kb
  const end = 100*1024;
  const { data } = useAudioLoader({ src: audioUrl, start, end });
  return (
    <div className="m-4">
      <h2>音频可视化</h2>
      <h4>加载全部</h4>
      <AudioWaveSurfer url={audioUrl} />
      <h4>加载部分[{start / 1024}-{end / 1024}] kb</h4>
      <AudioWaveSurfer url={data} />
    </div>
  );
}

export default AudioDemo;
