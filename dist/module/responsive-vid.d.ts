type BreakpointOptions = {
    src: string | string[];
    poster?: string;
};
type Breakpoint = `${'('}${string}${')'}`;
export type ResponsiveVideoOptions = {
    [key: Breakpoint]: BreakpointOptions;
};
declare function autoResponsiveVideo(): void;
declare class ResponsiveVideo {
    private readonly videoEl;
    private readonly options;
    private breakpoints;
    private isPaused;
    constructor({ el, options }: {
        el: HTMLVideoElement;
        options: ResponsiveVideoOptions;
    });
    init(): void;
    playListener: () => void;
    pauseListener: () => void;
    addVideo(breakpoint: Breakpoint): void;
}
export { autoResponsiveVideo, ResponsiveVideo };
