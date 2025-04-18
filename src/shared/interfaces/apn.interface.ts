export interface ApiResponseApnInterface {
    error: boolean;
    message: string;
    data: Array<ApnInterface>;
}

export interface ApnInterface {
    apn: string;
}
