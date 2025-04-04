import type { ReactNode, VideoHTMLAttributes } from 'react';
import { useEffect, useRef, useState } from 'react';

type BreakpointOptions = {
  src: string | string[];
  poster?: string;
};
type Breakpoint = `${'('}${string}${')'}`;
export type ResponsiveVideoOptions = {
  [key: Breakpoint]: BreakpointOptions;
};

export type ResponsiveVideoProps = {
  options: ResponsiveVideoOptions;
  isAutoplay?: boolean;
  children?: ReactNode;
} & VideoHTMLAttributes<HTMLVideoElement>;

const validMimeTypes = [
  'mp4', // MPEG-4 Video
  'webm', // WebM Video
  'ogg', // Ogg Video
  'x-m4v', // MPEG-4 Video (Apple variant)
  'quicktime', // QuickTime video
  'x-ms-wmv', // Windows Media Video
  'mpeg', // MPEG Video
  '3gpp', // 3GPP Video
  '3gpp2', // 3GPP2 Video
];

const validateBreakpoint = (breakpoint: Breakpoint) => {
  // Find any missing parenthesis and add them to the media query
  breakpoint = /^\(/.test(breakpoint) ? breakpoint : `(${breakpoint}`;
  return /\)$/.test(breakpoint) ? breakpoint : `${breakpoint})`;
};

const getMediaType = (url: string) => {
  const splits = url.split('.');
  const type = splits[splits.length - 1];
  // Return undefined if video is an url
  return validMimeTypes.some((t) => t === type) ? `video/${type}` : undefined;
};

export default function ResponsiveVid({ options, isAutoplay, children, ...rest }: ResponsiveVideoProps) {
  const videoEl = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState<boolean>(!isAutoplay || true);
  const [videoState, setVideoState] = useState({ sources: [] as string[], poster: '', currentTime: 0 });
  const backgroundVideoAttrs = () => (isAutoplay ? { muted: true, autoPlay: true, loop: true, playsInline: true } : {});

  const breakpoints = Object.keys(options) as Breakpoint[];

  const handleVideoLoad = () => {
    if (videoEl.current) {
      videoEl.current.currentTime = videoState.currentTime < videoEl.current?.duration ? videoState.currentTime : 0;
      if (!isPaused) videoEl.current.play();
    }
  };
  const setVideo = (breakpoint: Breakpoint): void => {
    const { src, poster: pstr } = options[breakpoint];
    videoEl.current?.pause();

    setVideoState({
      poster: pstr || videoState.poster || '',
      sources: Array.isArray(src) ? [...src] : [src],
      currentTime: videoEl.current?.currentTime || 0,
    });
  };

  const generateQueries = () => {
    const cleanup: any[] = [];
    breakpoints.forEach((breakpoint) => {
      const bp = validateBreakpoint(breakpoint);
      const mediaQuery = window.matchMedia(bp);

      if (mediaQuery.matches) setVideo(breakpoint);

      const listener = ({ matches }: MediaQueryListEvent): void => {
        matches && setVideo(breakpoint);
      };

      mediaQuery.addEventListener('change', listener);
      cleanup.push(() => mediaQuery.removeEventListener('change', listener));
    });
    return () => cleanup.forEach((fn) => fn());
  };

  useEffect(() => {
    if (videoEl.current) videoEl.current?.load();
  }, [videoState.sources]);

  useEffect(() => {
    return generateQueries();
  }, [options, isAutoplay]);

  return (
    <video
      ref={videoEl}
      poster={videoState.poster}
      {...backgroundVideoAttrs()}
      {...rest}
      onPlay={() => setIsPaused(false)}
      onPause={() => setIsPaused(true)}
      onLoadedMetadata={handleVideoLoad}
    >
      {videoState.sources && videoState.sources.map((src, index) => <source src={src} type={getMediaType(src)} key={index} />)}
      {/*Child for providing fallback content*/}
      {children}
    </video>
  );
}
