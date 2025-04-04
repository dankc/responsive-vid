<template>
  <video
    ref="videoEl"
    :poster="poster"
    v-bind="backgroundVideoAttrs"
    @loadedmetadata="handleVideoLoad"
    @pause="() => (isPaused = true)"
    @play="() => (isPaused = false)"
  >
    <source v-for="(source, index) in sources" :key="index" :src="source" :type="getMediaType(source)" />
    <!-- Slot for providing fallback content -->
    <slot />
  </video>
</template>

<script lang="ts">
  import { onUnmounted, type PropType } from 'vue';
  import { computed, defineComponent, onMounted, ref, toRefs } from 'vue';

  type BreakpointOptions = {
    src: string | string[];
    poster?: string;
  };
  type Breakpoint = `${'('}${string}${')'}`;
  export type ResponsiveVideoOptions = {
    [key: Breakpoint]: BreakpointOptions;
  };

  export default defineComponent({
    name: 'ResponsiveVideo',
    props: {
      options: {
        type: Object as PropType<ResponsiveVideoOptions>,
        required: true,
      },
      isAutoplay: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    setup(props) {
      const { options, isAutoplay } = toRefs(props);
      const breakpoints = Object.keys(options.value) as Breakpoint[];
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
      const currentTime = ref(0);
      const isPaused = ref(!isAutoplay.value);
      const listeners = ref<Array<() => void>>([]);
      const backgroundVideoAttrs = computed(() =>
        isAutoplay.value ? { muted: true, autoplay: true, loop: true, playsinline: true } : {}
      );
      const getMediaType = (url: string) => {
        const splits = url.split('.');
        const type = splits[splits.length - 1];
        // Return undefined if video is an url
        return validMimeTypes.some((t) => t === type) ? `video/${type}` : undefined;
      };
      const validateBreakpoint = (breakpoint: Breakpoint) => {
        // Find any missing parenthesis and add them to the media query
        breakpoint = /^\(/.test(breakpoint) ? breakpoint : `(${breakpoint}`;
        return /\)$/.test(breakpoint) ? breakpoint : `${breakpoint})`;
      };
      const handleVideoLoad = () => {
        if (videoEl.value) {
          videoEl.value.currentTime = currentTime.value < videoEl.value?.duration ? currentTime.value : 0;
          if (!isPaused.value) videoEl.value.play();
        }
      };
      const setVideo = (breakpoint: Breakpoint): void => {
        const { src, poster: pstr } = options.value[breakpoint];
        videoEl.value?.pause();

        currentTime.value = videoEl.value?.currentTime || 0;
        poster.value = pstr || poster.value || undefined;
        sources.value = Array.isArray(src) ? [...src] : [src];

        videoEl.value?.load();
      };
      const generateQueries = () => {
        breakpoints.forEach((breakpoint) => {
          const bp = validateBreakpoint(breakpoint);
          const mediaQuery = window.matchMedia(bp);

          if (mediaQuery.matches) setVideo(breakpoint);

          const listener = ({ matches }: MediaQueryListEvent): void => {
            if (matches) setVideo(breakpoint);
          };

          mediaQuery.addEventListener('change', listener);

          listeners.value.push(() => mediaQuery.removeEventListener('change', listener));
        });
      };

      onMounted(() => {
        generateQueries();
      });

      onUnmounted(() => {
        listeners.value.forEach((listener): void => listener());
      });

      return {
        backgroundVideoAttrs,
        getMediaType,
        handleVideoLoad,
        isPaused,
        poster,
        sources,
        videoEl,
      };
    },
  });
</script>
