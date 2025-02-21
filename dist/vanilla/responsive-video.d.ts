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
    constructor({ el, options }: {
        el: HTMLVideoElement;
        options: ResponsiveVideoOptions;
    });
    init(): void;
}
export { AutoResponsiveVideo, ResponsiveVideo };
