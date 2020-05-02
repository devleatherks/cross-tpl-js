export interface CrossTplConstructorOptions {
    [key: string]: string | boolean | number | undefined
    templates?: string
    debug?: boolean
    dirname?: string
    outDir?: string
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
        content: string
        create: Date
        modified: Date
        size: number
    }
}