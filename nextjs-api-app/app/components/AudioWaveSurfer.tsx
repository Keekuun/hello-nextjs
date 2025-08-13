"use client"

import WavesurferPlayer from '@wavesurfer/react'
import React, {useEffect, useMemo, useState} from "react";
import WaveSurfer from "wavesurfer.js";
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'
import ZoomPlugin from 'wavesurfer.js/dist/plugins/zoom.esm.js'
import MinimapPlugin from 'wavesurfer.js/dist/plugins/minimap.esm.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'

type Props = {
  url?: string
}

export const AudioWaveSurfer = ({url}: Props) => {
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [plugins, setPlugins] = useState([])

  const onReady = (wavesurfer: WaveSurfer) => {
    setWavesurfer(wavesurfer)
    setIsPlaying(false)
  }

  const onPlayPause = () => {
    wavesurfer?.playPause()
  }

  useEffect(() => {
    const plugins = [
      TimelinePlugin.create(),
      ZoomPlugin.create(),
      RegionsPlugin.create(),
      MinimapPlugin.create({
        height: 20,
        waveColor: '#ddd',
        progressColor: '#999',
      }),
      Hover.create({
        lineColor: '#ff0000',
        lineWidth: 2,
        labelBackground: '#555',
        labelColor: '#fff',
        labelSize: '11px',
        labelPreferLeft: false,
      }),
    ]

    setPlugins(plugins)
  }, []);
  return (
    <div>
      <WavesurferPlayer
        plugins={plugins}
        mediaControls
        interact
        autoScroll
        onReady={onReady}
        height={100}
        barWidth={2}
        barRadius={2}
        barGap={2}
        waveColor="violet"
        url={url}
        duration={5}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <button className="rounded bg-blue-400 px-4 py-2 cursor-pointer my-2" onClick={onPlayPause}>
        {isPlaying ? '暂停' : '播放'}
      </button>
    </div>
  )
}