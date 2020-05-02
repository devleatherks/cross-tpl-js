export interface CrossTplConstructorOptions {
    [key: string]: string | boolean | number | undefined
    templates?: string
    debug?: boolean
    dirname?: string
    outDir?: string
    templateBodyLang?: string
    templateBodyMix?: string
    templatesBody?: string
    templatesBodyLocal?: string
    templatesMain?: string
    templatesWrapper?: string
    localDir?: string
    contentBase64?: boolean
    dirHash?: boolean
    templatesModuleWindow?: string,
    templatesModuleCommon?: string,
    moduleBuild?: string
    upload?: boolean,
}

export interface CrossTplFilesContentObject {
    file: string,
    mime: {
        type: string
        content: string | Promise<string>
        create: Date
        modified: Date
        size: number
    }
}

export interface DiskMime  {
    type: string,
    name: string,
    create: Date,
    modified: Date,
    size: number
}

export interface CrossFile {
    path: string,
    pwd: string,
    mime: DiskMime,
    lang: string | false,
    content: string
}

export interface CrossLocalInfoPath { type: string, name: string, lang: string }