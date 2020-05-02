import { CrossTplConstructorOptions } from './header';
export declare class CrossLocal {
    #private;
    constructor(options: CrossTplConstructorOptions);
    build(): void;
    private create;
    watch(): void;
    private upload;
    outDir(): any;
    localDir(): string;
    outDirJs(): string;
    outDirTs(): string;
    isSourceJs(): boolean;
    isUpload(): boolean;
}
