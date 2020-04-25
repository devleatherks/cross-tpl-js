import { CrossTplConstructorOptions } from './header';
export declare class CrossTpl {
    #private;
    constructor(options: CrossTplConstructorOptions);
    build(): void;
    private create;
    watch(): void;
    private upload;
    outDir(): any;
    outDirJs(): string;
    outDirTs(): string;
    isSourceJs(): boolean;
    isUpload(): boolean;
}
