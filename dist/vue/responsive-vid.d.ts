import type { PropType } from 'vue';
type BreakpointOptions = {
    src: string | string[];
    poster?: string;
};
type Breakpoint = `${'('}${string}${')'}`;
export type ResponsiveVideoOptions = {
    [key: Breakpoint]: BreakpointOptions;
};
declare const _default: import("vue").DefineComponent<{
    options: {
        type: PropType<ResponsiveVideoOptions>;
        required: true;
    };
    isAutoplay: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
}, {
    backgroundVideoAttrs: import("vue").ComputedRef<{
        muted: boolean;
        autoplay: boolean;
        loop: boolean;
        playsinline: boolean;
    } | {
        muted?: undefined;
        autoplay?: undefined;
        loop?: undefined;
        playsinline?: undefined;
    }>;
    getMediaType: (url: string) => string | undefined;
    handleVideoLoad: () => void;
    isPaused: import("vue").Ref<boolean>;
    poster: import("vue").Ref<string | undefined>;
    sources: import("vue").Ref<string[]>;
    videoEl: import("vue").Ref<HTMLVideoElement | undefined>;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    options: {
        type: PropType<ResponsiveVideoOptions>;
        required: true;
    };
    isAutoplay: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
}>>, {
    isAutoplay: boolean;
}>;
export default _default;
