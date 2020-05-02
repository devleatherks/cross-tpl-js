import { CrossTplConstructorOptions } from './header';
export declare class CrossLocal {
    #private;
    constructor(options: CrossTplConstructorOptions);
    build(): Promise<void>;
    private create;
    watch(): void;
    private upload;
    outDir(): any;
    get localDir(): string;
    get outDirJs(): string;
    get outDirTs(): string;
    isSourceJs(): boolean;
    isUpload(): boolean;
}
