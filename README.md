# Responsive-Vid
[![vue3](https://img.shields.io/badge/Vue-v3.2+-green.svg)](https://v3.vuejs.org/)
[![React](https://img.shields.io/badge/React-v17.0+-61DAFB.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/types-TypeScript-blue.svg)](https://v3.vuejs.org/)
![Downloads](https://img.shields.io/npm/dm/responsive-vid.svg)
[![bundle-size](https://badgen.net/bundlephobia/min/responsive-vid)](https://bundlephobia.com/result?p=responsive-vid)
![License: LGPL-3.0-or-later](https://img.shields.io/badge/License-LGPL--3.0--or--later-blue.svg)

A TypeScript-powered library to dynamically swap responsive video sources and posters using media queries for Vue, React, JS modules, and browsers. Perfect for autoplaying background videos with varying file sizes or aspect ratios across viewport widths—or any media query condition like resolution or orientation.

## Features
- Swap video sources and posters dynamically with media queries.
- Supports Vue 3, React 17+, ES modules, and plain JS browser scripts.
- TypeScript-ready with full type definitions.
- Perfect for responsive background videos, orientation changes, or resolution tweaks.

## How to use
Install via npm:

```bash
npm i responsive-vid
```

### Browser Support
Works in modern browsers supporting ES2015+ (e.g., Chrome 49+, Firefox 45+, Safari 10+, Edge 14+). No support for legacy browsers like IE11.

### Options object
#### Same object shape across all implementations
The `options` object uses media query strings as keys (e.g. `('width <= 767px')`) mapped to an object with `src` and `poster` properties. `src` can be a single URL (e.g., from a video service) or an array of URLs for multiple formats. If a `src` string has a file extension (e.g., `.mp4`), it’s automatically set as the `<source>` element’s `type` attribute.

#### Example:

```javascript
{
  '(width <= 767px)': {
    src: ['https://example.com/video-sm.mp4'],
    poster: 'https://example.com/poster-sm.jpg'
  },
  '(768px <= width <= 1024px)': {
    src: ['https://example.com/video-md.mp4', 'https://example.com/video-md.webm'],
    poster: 'https://example.com/poster-md.jpg'
  },
  '(width >= 1025px)': {
    src: 'https://example.com/video-lg.mp4',
    poster: 'https://example.com/poster-lg.jpg'
  }
}
```

### Vue 3
Requires Vue 3.2+. Import the component and optional TypeScript types:

```typescript
import type { ResponsiveVideoOptions } from 'responsive-vid/vue';
import ResponsiveVideo from 'responsive-vid/vue';

```
#### Props
- `options`: The media query options object (see above)
- `is-autoplay`: Boolean (default: false). Adds `muted`, `autoplay`, `loop`, and `playsinline` attributes for seamless background playback.

#### Slots
- **Default**: Fallback content if the video fails to load.

#### Example:

```vue
<template>
  <ResponsiveVideo :options="responsiveVideoOpts" is-autoplay>
    <p>Video not supported</p>
  </ResponsiveVideo>
</template>

<script setup lang="ts">
import type { ResponsiveVideoOptions } from 'responsive-vid/vue';
import ResponsiveVideo from 'responsive-vid/vue';

const responsiveVideoOpts: ResponsiveVideoOptions = {
  '(width <= 767px)': {
    src: ['https://example.com/video-sm.mp4'],
    poster: 'https://example.com/poster-sm.jpg'
  },
  '(768px <= width <= 1024px)': {
    src: ['https://example.com/video-md.mp4', 'https://example.com/video-md.webm'],
    poster: 'https://example.com/poster-md.jpg'
  },
  '(width >= 1025px)': {
    src: 'https://example.com/video-lg.mp4',
    poster: 'https://example.com/poster-lg.jpg'
  }
};
</script>
```

### React
Requires React and React DOM v17+. Import the component and optional TypeScript types:

```typescript
import type { ResponsiveVideoOptions, ResponsiveVideoProps } from 'responsive-vid/react';
import ResponsiveVideo from 'responsive-vid/react';

```
#### Props
- `options`: The media query options object (see above)
- `isAutoplay`: Boolean (default: false). Adds `muted`, `autoPlay`, `loop`, and `playsInline` attributes for seamless background playback.

#### Children
Fallback content if the video fails to load.

#### Example:

```tsx
import type { ResponsiveVideoOptions } from 'responsive-vid/react';
import ResponsiveVideo from 'responsive-vid/react';

const responsiveVideoOpts: ResponsiveVideoOptions = {
  '(width <= 767px)': {
    src: ['https://example.com/video-sm.mp4'],
    poster: 'https://example.com/poster-sm.jpg'
  },
  '(768px <= width <= 1024px)': {
    src: ['https://example.com/video-md.mp4', 'https://example.com/video-md.webm'],
    poster: 'https://example.com/poster-md.jpg'
  },
  '(width >= 1025px)': {
    src: 'https://example.com/video-lg.mp4',
    poster: 'https://example.com/poster-lg.jpg'
  }
};

export default function YourComponent() {
  
  return (
    <ResponsiveVideo options={responsiveVideoOpts} isAutoplay={true}>
      <p>Video not supported</p>
    </ResponsiveVideo>
  )
}
```

## Javascript
Two flavors: an automatic function and a manual class, both with TypeScript support.

### Auto version
Scans for `<video>` elements with a `data-responsive-video` attribute containing JSON-formatted options. Available as:
- **Browser Build**: Plain JS, no build system required.
- **Module Build**: ES module for modern workflows.

#### Browser Build
Host `responsive-vid.js` and initialize it:

```html
<video data-responsive-video='{
      "(width <= 767px)": {
        src: ["https://example.com/video-sm.mp4"],
        poster: "https://example.com/poster-sm.jpg"
      },
      "(768px <= width <= 1024px)": {
        src: ["https://example.com/video-md.mp4", "https://example.com/video-md.webm"],
        poster: "https://example.com/poster-md.jpg"
      },
      "(width >= 1025px)": {
        src: "https://example.com/video-lg.mp4",
        poster: "https://example.com/poster-lg.jpg"
      }
   }'
>
</video>

<script src="/path/to/responsive-vid.js"></script>
<script>
  window.addEventListener('load', () => ResponsiveVideo());
</script>
```
#### Module Build
Import and run:

```html
<script type="module">
  import { autoResponsiveVideo } from 'responsive-vid';
  window.addEventListener('load', () => autoResponsiveVideo());
</script>
```

### Manual Version
A class for fine-grained control, ideal when options live in your JS/TS code. Import from the module build:

```typescript
import type { ResponsiveVideoOptions } from 'responsive-vid';
import { ResponsiveVideo } from 'responsive-vid';
```

#### Example:
```typescript
const videoEl: HTMLVideoElement = document.querySelector('video.your-responsive-video');
const videoOptions: ResponsiveVideoOptions = {
  '(width <= 767px)': {
    src: ['https://example.com/video-sm.mp4'],
    poster: 'https://example.com/poster-sm.jpg'
  },
  '(768px <= width <= 1024px)': {
    src: ['https://example.com/video-md.mp4', 'https://example.com/video-md.webm'],
    poster: 'https://example.com/poster-md.jpg'
  },
  '(width >= 1025px)': {
    src: 'https://example.com/video-lg.mp4',
    poster: 'https://example.com/poster-lg.jpg'
  }
};

new ResponsiveVideo({ 
  el: videoEl, 
  options: videoOptions,
});
```
