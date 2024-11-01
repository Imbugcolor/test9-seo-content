import { Article } from "../interfaces/article.interface";

export interface ArticleDataResponse {
    statusCode: number,
    message: string,
    data: {
        data: {
            data: Article[],
            page: string,
            total: number,
        }
    }
}