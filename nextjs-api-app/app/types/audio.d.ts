export type AudioSegment = {
  start: number;
  end: number;
  label?: string;
};

export type AudioAnnotatorProps = {
  audioUrl: string;
  onRangeSelect?: (start: number, end: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
};
