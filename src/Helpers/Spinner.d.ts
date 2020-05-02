export declare class Spinner {
    private prefix;
    private spinner;
    constructor(prefix: string);
    start(prefix: string): this;
    text(text: string): this;
    succeed(text: string): this;
    clear(): void;
    stop(): this;
}
