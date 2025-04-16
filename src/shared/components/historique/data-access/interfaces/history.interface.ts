import { Paginate } from "@shared/interfaces/paginate";

export interface historyApiResponseInterface {
    error: boolean;
    statusCode: number;
    message: string;
    data: Paginate<historyInterface>;
}

export interface historyInterface {
    module: string;
    typeAction: string;
    typeModel: string;
    idModel: string;
    action: string;
    source: string;
    createdAt: string;
}