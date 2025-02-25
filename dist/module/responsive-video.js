'use strict';
const validMimeTypes = [
    'mp4',
    'webm',
    'ogg',
    'x-m4v',
    'quicktime',
    'x-ms-wmv',
    'mpeg',
    '3gpp',
    '3gpp2',
];
function getResponsiveVideos() {
    return Array.from(document.querySelectorAll('video[data-responsive-video]'));
}
function getMediaType(url) {
    const splits = url.split('.');
    const type = splits[splits.length - 1];
    return validMimeTypes.includes(type) ? `video/${type}` : undefined;
}
function validateBreakpoint(breakpoint) {
    breakpoint = /^\(/.test(breakpoint) ? breakpoint : `(${breakpoint}`;
    return /\)$/.test(breakpoint) ? breakpoint : `${breakpoint})`;
}
function AutoResponsiveVideo() {
    const videoEls = getResponsiveVideos();
    videoEls.forEach((videoEl) => {
        const options = JSON.parse(videoEl.dataset.responsiveVideo);
        new ResponsiveVideo({ el: videoEl, options });
    });
}
class ResponsiveVideo {
    videoEl;
    options;
    breakpoints;
    isPaused;
    constructor({ el, options }) {
        if (!Object.keys(options).length) {
            throw Error('No options provided to responsive-video.js');
        }
        if (typeof el === 'string' || el.nodeName !== 'VIDEO') {
            throw Error('Invalid "el" provided to responsive-video.js');
        }
        this.videoEl = el;
        this.options = options;
        this.breakpoints = Object.keys(options);
        this.isPaused = this.videoEl.paused;
        this.init();
    }
    init() {
        this.videoEl.addEventListener('pause', this.pauseListener);
        this.videoEl.addEventListener('play', this.playListener);
        this.breakpoints.forEach((breakpoint) => {
            const bp = validateBreakpoint(breakpoint);
            const mediaQuery = window.matchMedia(bp);
            if (mediaQuery.matches)
                this.addVideo(breakpoint);
            mediaQuery.addEventListener('change', ({ matches }) => {
                if (matches) {
                    this.addVideo(breakpoint);
                }
            });
        });
    }
    playListener = () => {
        this.isPaused = false;
    };
    pauseListener = () => {
        this.isPaused = true;
    };
    addVideo(breakpoint) {
        const currentProgress = this.videoEl.currentTime;
        const { src, poster } = this.options[breakpoint];
        const sources = Array.isArray(src) ? [...src] : [src];
        const loadListener = () => {
            this.videoEl.currentTime = currentProgress < this.videoEl.duration ? currentProgress : 0;
            if (this.isPaused === false)
                this.videoEl.play();
            this.videoEl.removeEventListener('loadedmetadata', loadListener);
        };
        if (poster)
            this.videoEl.setAttribute('poster', poster);
        this.videoEl.querySelectorAll('source')?.forEach((sourceEl) => {
            sourceEl.remove();
        });
        sources.forEach(source => {
            const sourceEl = document.createElement('source');
            const type = getMediaType(source);
            sourceEl.setAttribute('src', source);
            if (type)
                sourceEl.setAttribute('type', type);
            else
                sourceEl.removeAttribute('type');
            this.videoEl.appendChild(sourceEl);
        });
        this.videoEl.addEventListener('loadedmetadata', loadListener);
        this.videoEl.load();
    }
}
export { AutoResponsiveVideo, ResponsiveVideo };
