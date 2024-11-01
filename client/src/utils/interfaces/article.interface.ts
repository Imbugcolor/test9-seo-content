export interface Article {
    _id: string,
    title: string,
    originalContent: string,
    seoContent?: string,
    url: string,
    createdAt?: string,
    updatedAt?: string
}