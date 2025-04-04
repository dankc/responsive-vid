'use strict';

type BreakpointOptions = {
  src: string | string[];
  poster?: string;
};
type Breakpoint = `${'('}${string}${')'}`;
export type ResponsiveVideoOptions = {
  [key: Breakpoint]: BreakpointOptions;
};

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

function getResponsiveVideos(): (HTMLVideoElement & { dataset: { responsiveVideo: string } })[] {
  return Array.from(document.querySelectorAll('video[data-responsive-video]'));
}

function getMediaType(url: string) {
  const splits = url.split('.');
  const type = splits[splits.length - 1];
  // Return undefined if video is an url
  return validMimeTypes.some((t) => t === type) ? `video/${type}` : undefined;
}
function validateBreakpoint(breakpoint: string): string {
  // Find any missing parenthesis and add them to the media query
  breakpoint = /^\(/.test(breakpoint) ? breakpoint : `(${breakpoint}`;
  return /\)$/.test(breakpoint) ? breakpoint : `${breakpoint})`;
}

// Supply the options in the DOM and have the script find them for you
function autoResponsiveVideo(): () => void {
  const videoEls = getResponsiveVideos();
  const instances: Array<ResponsiveVideo> = videoEls.map((videoEl) => {
    const options: ResponsiveVideoOptions = JSON.parse(videoEl.dataset.responsiveVideo);
    return new ResponsiveVideo({ el: videoEl, options });
  });

  return () => {
    while (instances.length > 0) {
      const instance = instances.pop();
      if (instance) instance.destroy();
    }
  };
}

// Manually set up your responsive videos in JS
class ResponsiveVideo {
  private readonly videoEl: HTMLVideoElement;
  private readonly options: ResponsiveVideoOptions;
  private breakpoints: Breakpoint[];
  private isPaused: boolean;
  private listeners: Array<() => void> = [];

  constructor({ el, options }: { el: HTMLVideoElement; options: ResponsiveVideoOptions }) {
    if (!Object.keys(options).length) {
      throw Error('No options provided to responsive-vid.js');
    }
    if (typeof el === 'string' || el.nodeName !== 'VIDEO') {
      throw Error('Invalid "el" provided to responsive-vid.js');
    }

    this.videoEl = el;
    this.options = options;
    this.breakpoints = Object.keys(options) as Breakpoint[];
    this.isPaused = this.videoEl.paused;
    this.init();
  }

  init() {
    this.videoEl.addEventListener('pause', this.pauseListener);
    this.videoEl.addEventListener('play', this.playListener);
    this.listeners.push(() => this.videoEl.removeEventListener('pause', this.pauseListener));
    this.listeners.push(() => this.videoEl.removeEventListener('play', this.playListener));

    this.breakpoints.forEach((breakpoint) => {
      const bp = validateBreakpoint(breakpoint);
      const mediaQuery = window.matchMedia(bp);
      const listener = ({ matches }: MediaQueryListEvent) => {
        if (matches) {
          this.addVideo(breakpoint);
        }
      };

      // Initially add the appropriate video
      if (mediaQuery.matches) this.addVideo(breakpoint);

      mediaQuery.addEventListener('change', listener);
      this.listeners.push(() => mediaQuery.removeEventListener('change', listener));
    });
  }

  playListener = () => {
    this.isPaused = false;
  };

  pauseListener = () => {
    this.isPaused = true;
  };

  addVideo(breakpoint: Breakpoint): void {
    const currentProgress = this.videoEl.currentTime;
    const { src, poster } = this.options[breakpoint];
    const sources = Array.isArray(src) ? [...src] : [src];
    const loadListener = () => {
      this.videoEl.currentTime = currentProgress < this.videoEl.duration ? currentProgress : 0;
      if (this.isPaused === false) this.videoEl.play();
      this.videoEl.removeEventListener('loadedmetadata', loadListener);
    };

    if (poster) this.videoEl.setAttribute('poster', poster);

    this.videoEl.querySelectorAll('source')?.forEach((sourceEl: HTMLSourceElement) => {
      sourceEl.remove();
    });

    sources.forEach((source) => {
      const sourceEl = document.createElement('source');
      const type = getMediaType(source);
      sourceEl.setAttribute('src', source);
      if (type) sourceEl.setAttribute('type', type);
      else sourceEl.removeAttribute('type');
      this.videoEl.appendChild(sourceEl);
    });

    this.videoEl.addEventListener('loadedmetadata', loadListener);
    this.videoEl.load();
  }

  destroy() {
    while (this.listeners.length > 0) {
      const listener = this.listeners.pop();
      if (listener) listener();
    }
  }
}

export { autoResponsiveVideo, ResponsiveVideo };
