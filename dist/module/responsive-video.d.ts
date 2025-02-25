type BreakpointOptions = {
    src: string | string[];
    poster?: string;
};
type Breakpoint = string & {
    readonly __brand: unique symbol;
};
export type ResponsiveVideoOptions = {
    [key: Breakpoint]: BreakpointOptions;
};
declare function AutoResponsiveVideo(): void;
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
export { AutoResponsiveVideo, ResponsiveVideo };
