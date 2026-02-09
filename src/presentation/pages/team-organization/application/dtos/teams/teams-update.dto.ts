export interface TeamsUpdateDto {
    uniqId: string;
    code: string;
    name: string;
    description: string;
    reportTypes: string[];
    operators: string[];
    permissions: string[];
}
