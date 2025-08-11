import { useEffect, useState } from 'react';

export const useAudioLoader = (audioUrl: string) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  useEffect(() => {
    const init = async () => {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const mediaSource = new MediaSource();
      const audioElement = new Audio();
      audioElement.crossOrigin = 'anonymous';
      audioElement.src = URL.createObjectURL(mediaSource);
      setAudio(audioElement);
      setAudioContext(context);

      mediaSource.addEventListener('sourceopen', () => {
        const sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
        fetchAndAppend(sourceBuffer, audioUrl, 0, 1024 * 2); // 前2kb
      });

      const source = context.createMediaElementSource(audioElement);
      const analyserNode = context.createAnalyser();
      source.connect(analyserNode);
      analyserNode.connect(context.destination);
      setAnalyser(analyserNode);
    };

    init();

    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [audioUrl]);

  const fetchAndAppend = async (sourceBuffer: SourceBuffer, url: string, start: number, end: number) => {
    const res = await fetch(url, {
      headers: {
        Range: `bytes=${start}-${end}`,
      },
    });
    const buffer = await res.arrayBuffer();
    sourceBuffer.appendBuffer(buffer);
  };

  return { audio, analyser };
};
