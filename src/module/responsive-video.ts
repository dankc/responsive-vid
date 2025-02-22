'use strict';

type BreakpointOptions = {
  src: string | string[];
  poster?: string;
};
type Breakpoint = string & { readonly __brand: unique symbol };
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
  return Array.from( document.querySelectorAll( 'video[data-responsive-video]' ) );
}

function getMediaType(url: string)  {
  const splits = url.split( '.' );
  const type = splits[splits.length - 1];
  // Return undefined if video is an url
  return validMimeTypes.includes( type ) ? `video/${ type }` : undefined;
}
function validateBreakpoint(breakpoint: string): string {
  // Find any missing parenthesis and add them to the media query
  breakpoint = /^\(/.test( breakpoint ) ? breakpoint : `(${ breakpoint }`;
  return /\)$/.test( breakpoint ) ? breakpoint : `${ breakpoint })`;
}

const addVideo = (
  { videoEl, options, breakpoint }: {
    videoEl: HTMLVideoElement,
    options: ResponsiveVideoOptions,
    breakpoint: Breakpoint
  }
): void => {
  const currentProgress = videoEl.currentTime;
  const { src, poster } = options[breakpoint];
  const sources = Array.isArray( src ) ? [ ...src ] : [ src ];
  const listenerFn = () => {
    videoEl.currentTime = currentProgress < videoEl.duration ? currentProgress : 0;
    videoEl.play();
    videoEl.removeEventListener( 'loadedmetadata', listenerFn );
  }

  videoEl.pause();

  if ( poster ) videoEl.setAttribute( 'poster', poster );

  videoEl.querySelectorAll( 'source' )?.forEach( (sourceEl: HTMLSourceElement) => {
    sourceEl.remove();
  } )

  sources.forEach( source => {
    const sourceEl = document.createElement( 'source' );
    const type = getMediaType( source );
    sourceEl.setAttribute( 'src', source );
    if ( type ) sourceEl.setAttribute( 'type', type );
    else sourceEl.removeAttribute( 'type' );
    videoEl.appendChild( sourceEl );
  } );

  videoEl.addEventListener( 'loadedmetadata', listenerFn );
  videoEl.load();
}

// Supply the options in the DOM and have the script find them for you
function AutoResponsiveVideo(): void {
  const videoEls = getResponsiveVideos();
  videoEls.forEach( (videoEl) => {
    const options: ResponsiveVideoOptions = JSON.parse( videoEl.dataset.responsiveVideo );
    const breakpoints: Breakpoint[] = (Object.keys( options ) as Breakpoint[]);

    breakpoints.forEach( (breakpoint) => {
      const bp = validateBreakpoint( breakpoint );

      // Initially add the appropriate video
      if ( window.matchMedia( bp ).matches ) addVideo( { videoEl, options, breakpoint } );

      window.matchMedia( bp ).addEventListener( 'change', ({ matches }) => {
        if ( matches ) {
          addVideo( { videoEl, options, breakpoint } );
        }
      } );
    } );
  } );
}

// Manually set up your responsive videos in JS
class ResponsiveVideo {
  private readonly videoEl: HTMLVideoElement;
  private readonly options: ResponsiveVideoOptions;
  private breakpoints: Breakpoint[];

  constructor({ el, options }: { el: HTMLVideoElement, options: ResponsiveVideoOptions }) {
    if ( !Object.keys( options ).length ) {
      throw Error( 'No options provided to responsive-video.js' );
    }
    if ( typeof el === 'string' || el.nodeName !== 'VIDEO' ) {
      throw Error( 'Invalid "el" provided to responsive-video.js' );
    }

    this.videoEl = el;
    this.options = options;
    this.breakpoints = (Object.keys( options ) as Breakpoint[]);
    this.init();
  }

  init() {
    this.breakpoints.forEach( (breakpoint) => {
      const bp = validateBreakpoint( breakpoint );
      const mediaQuery = window.matchMedia( bp );

      // Initially add the appropriate video
      if ( mediaQuery.matches ) addVideo( { videoEl: this.videoEl, options: this.options, breakpoint } );

      mediaQuery.addEventListener( 'change', ({ matches }) => {
        if ( matches ) {
          addVideo( { videoEl: this.videoEl, options: this.options, breakpoint } );
        }
      } );
    } );
  }
}

export { AutoResponsiveVideo, ResponsiveVideo };