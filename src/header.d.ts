export interface CrossTplConstructorOptions {
    [key: string]: string | boolean | number | undefined
    templates?: string
    debug?: boolean
    dirname?: string
    outDir?: string
    templatesBody?: string
    templatesMain?: string
    templatesWrapper?: string
    contentBase64?: boolean
    dirHash?: boolean
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