# Responsive Video

A collection of scripts and a Vue 3 component (requires Vue 3.2+) to dynamically change video sources at different viewport widths. 
It's intended to be used for autoplaying background videos where you'd want to use videos of different files sizes and/or aspect ratios at defined breakpoints.

## How to use
Install it with npm

`npm i responsive-video`

### Options object
#### This is the same object shape used across all implementations
`options` is an object with keys that represent the media queries (e.g. `('width <= 767px')`) and contains an object with a `src` and `poster` keys. You can provide multiple different video formats or just a single url if you're using a video management service. If there's a file extension in your src string, it'll be added as the `type` attribute on the `source` element.

#### Example options object:

```
{
  '(width <= 767px)': {
    src: ['https://youtube.com/video-sm'],
    poster: 'https://img.youtube.com/poster-sm',
  },
  '(768px <= width <= 1024px)': {
    src: ['https://your-domain.com/video-md.mp4', 'https://your-domain.com/video-md.ogg'],
    poster: 'https://your-domain.com/poster.png',
  },
  '(width >= 1025px)': {
    src: ['https://youtube.com/video-lg'],
    poster: 'https://img.youtube.com/poster-lg',
  },
}
```

### Vue 3
Import the component in the component consuming it

`import ResponsiveVideo from 'responsive-video/vue'`

Import the type definitions if you're using TypeScript

`import type { ResponsiveVideoOptions } from 'responsive-video/vue';`

The component accepts two props: `options` and `isautoplay`.

`isautoplay` is boolean and will automatically add the `muted autoplay loop playsinline` attributes to the video element for you to enable autoplay and loop the video. This is how I invision the component being used every time, but it's false by default to not be opinionated so you can add whichever attributes you want.

`options` (described above in the previous section)

There's also a default slot available to provide fallback content.

#### Example:

```
// Your .vue file
<template>
    <ResponsiveVideo :options="responsiveVideoOpts" />
</template>

<script setup lang="ts">
import type { ResponsiveVideoOptions } from 'responsive-video/vue';
import ResponsiveVideo from 'responsive-video/vue';

const responsiveVideoOpts: ResponsiveVideoOptions = {
  '(width <= 767px)': {
    src: 'https://youtube.com/video-sm',
    poster: 'https://img.youtube.com/poster-sm',
  },
  '(768px <= width <= 1024px)': {
    src: ['https://your-domain.com/video-md.mp4', 'https://your-domain.com/video-md.ogg'],
    poster: 'https://your-domain.com/poster.png',
  },
  '(width >= 1025px)': {
    src: 'https://youtube.com/video-lg',
    poster: 'https://img.youtube.com/poster-lg',
  },
};
</script>
```

## Javascript

### Auto version
#### Supply the options as a data attribute on the video element(s) for the script to find

There are two implementation of this - one a function you can import as a module (Module build) and the other's a plain JS function (Browser build). Host the browser build on your domain or bundle it in with your other scripts manually, then initialize it (`ResponsiveVideo()`). Or you can import the module build `import { AutoResponsiveVideo } from 'responsive-video/module/responsive-video.js';`, then initialize it (`AutoResponsiveVideo()`).
It looks for a `data-responsive-video` attribute on video elements to supply it with options in JSON format. 

#### Example:
```
<video data-responsive-video='{
      "(width <= 767px)": {
        "src": ["https://youtube.com/video-sm"],
        "poster": "https://img.youtube.com/poster-sm"
      },
      "(768px <= width <= 1024px)": {
        "src": ["https://your-domain.com/video-md.mp4", "https://your-domain.com/video-md.ogg"],
        "poster": "https://your-domain.com/poster.png"
      },
      '(width >= 1025px)': {
        src: ['https://youtube.com/video-lg'],
        poster: 'https://img.youtube.com/poster-lg',
      },
   }'
>
</video>

<!-- ...Below the body tag as a function -->
<script src="your/path/to/browser/build/responsive-video.js"></script>
<script type="application/javascript">
  window.addEventListener('load', ResponsiveVideo)
</script>
<!-- Or as a module -->
<script type="module">
  import { AutoResponsiveVideo } from 'responsive-video/module/responsive-video.js';
  window.addEventListener('load', AutoResponsiveVideo)
</script>
```
### Manual Version
#### You target the video elements and supply the appropriate options with JS/TS
If you want more control, or don't want to put the options in the HTML, you can use the manual version. This version also has TypeScript support. Unlike the auto version, this version uses a Class instead of a Function. 

#### Example:
```
// Inside of a .ts file
import type { ResponsiveVideoOptions } from 'responsive-video/module';
import { ResponsiveVideo } from 'responsive-video/module';

const videoEl: HTMLVideoElement = document.querySelector('video.your-responsive-video');
const videoOptions: ResponsiveVideoOptions = {
  '(width <= 767px)': {
    src: ['https://youtube.com/video-sm'],
    poster: 'https://img.youtube.com/poster-sm'
  },
  '(768px <= width <= 1024px)': {
    src: ['https://your-domain.com/video-md.mp4', 'https://your-domain.com/video-md.ogg'],
    poster: 'https://your-domain.com/poster.png'
  },
  '(width >= 1025px)': {
    src: ['https://youtube.com/video-lg'],
    poster: 'https://img.youtube.com/poster-lg',
  },
};

new ResponsiveVideo({ 
  el: videoEl, 
  options: videoOptions,
});
```

## Roadmap

- Add React component
