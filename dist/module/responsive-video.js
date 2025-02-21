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
const addVideo = ({ videoEl, options, breakpoint }) => {
    const currentProgress = videoEl.currentTime;
    const { src, poster } = options[breakpoint];
    const sources = Array.isArray(src) ? [...src] : [src];
    const listenerFn = () => {
        videoEl.currentTime = currentProgress < videoEl.duration ? currentProgress : 0;
        videoEl.play();
        videoEl.removeEventListener('loadedmetadata', listenerFn);
    };
    videoEl.pause();
    if (poster)
        videoEl.setAttribute('poster', poster);
    videoEl.querySelectorAll('source')?.forEach((sourceEl) => {
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
        videoEl.appendChild(sourceEl);
    });
    videoEl.addEventListener('loadedmetadata', listenerFn);
    videoEl.load();
};
function AutoResponsiveVideo() {
    const videoEls = getResponsiveVideos();
    videoEls.forEach((videoEl) => {
        const options = JSON.parse(videoEl.dataset.responsiveVideo);
        const breakpoints = Object.keys(options);
        breakpoints.forEach((breakpoint) => {
            const bp = validateBreakpoint(breakpoint);
            if (window.matchMedia(bp).matches)
                addVideo({ videoEl, options, breakpoint });
            window.matchMedia(bp).addEventListener('change', ({ matches }) => {
                if (matches) {
                    addVideo({ videoEl, options, breakpoint });
                }
            });
        });
    });
}
class ResponsiveVideo {
    videoEl;
    options;
    breakpoints;
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
        this.init();
    }
    init() {
        this.breakpoints.forEach((breakpoint) => {
            const bp = validateBreakpoint(breakpoint);
            if (window.matchMedia(bp).matches)
                addVideo({ videoEl: this.videoEl, options: this.options, breakpoint });
            window.matchMedia(bp).addEventListener('change', ({ matches }) => {
                if (matches) {
                    addVideo({ videoEl: this.videoEl, options: this.options, breakpoint });
                }
            });
        });
    }
}
export { AutoResponsiveVideo, ResponsiveVideo };
