export interface TeamsCreateApiDto {
    code: string;
    name: string;
    description: string;
    operators: string[];
    report_types: string[];
    permissions: number[];
}
