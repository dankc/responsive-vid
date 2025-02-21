<template>
  <video ref="videoEl" :poster="poster" v-bind="backgroundVideoAttrs">
    <source
        v-for="(source, index) in sources"
        :key="index"
        :src="source"
        :type="getMediaType(source)"
    />
    <!-- Slot for providing fallback content -->
    <slot />
  </video>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent, onMounted, ref, toRefs } from 'vue';

type BreakpointOptions = {
  src: string | string[];
  poster?: string;
};
export type ResponsiveVideoOptions = {
  [key: string]: BreakpointOptions;
};

export default defineComponent({
  name: 'ResponsiveVideo',
  props: {
    options: {
      type: Object as PropType<ResponsiveVideoOptions>,
      required: true,
    },
    isautoplay: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  setup(props) {
    const { options, isautoplay } = toRefs(props);
    const breakpoints = Object.keys(options.value);
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
    const videoEl = ref<HTMLVideoElement>();
    const sources = ref<string[]>([]);
    const poster = ref<string | undefined>();
    const backgroundVideoAttrs = isautoplay.value
                                 ? { muted: true, autoplay: true, loop: true, playsinline: true }
                                 : {};
    const getMediaType = (url: string) => {
      const splits = url.split('.');
      const type = splits[splits.length - 1];
      // Return undefined if video is an url
      return validMimeTypes.includes(type) ? `video/${type}` : undefined;
    };
    const validateBreakpoint = (breakpoint: string) => {
      // Find any missing parenthesis and add them to the media query
      breakpoint = /^\(/.test(breakpoint) ? breakpoint : `(${breakpoint}`;
      return /\)$/.test(breakpoint) ? breakpoint : `${breakpoint})`;
    };
    const generateQueries = () => {
      breakpoints.forEach((breakpoint) => {
        const bp = validateBreakpoint(breakpoint);

        window.matchMedia(bp).addEventListener('change', () => {
          const currentProgress = videoEl.value?.currentTime || 0;
          const { src, poster: pstr } = options.value[breakpoint];

          poster.value = pstr || poster.value || undefined;
          sources.value = Array.isArray(src) ? [...src] : [src];

          videoEl.value?.load();
          if( videoEl.value ) videoEl.value.currentTime = currentProgress < videoEl.value.duration ? currentProgress : 0;
          videoEl.value?.play();
        });
      });
    };

    onMounted(() => {
      generateQueries();
    });

    return {
      backgroundVideoAttrs,
      getMediaType,
      poster,
      sources,
    }
  },
})
</script>
