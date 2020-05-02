import { CrossTplConstructorOptions } from './header';
export declare class CrossTpl {
    #private;
    constructor(options: CrossTplConstructorOptions);
    build(): Promise<void>;
    private create;
    watch(): void;
    private upload;
    get dir(): string;
    outDir(): any;
    get outDirJs(): string;
    get outDirTs(): string;
    isSourceJs(): boolean;
    isUpload(): boolean;
}
