export class RequestFilter {
    private constructor(
        private readonly status?: string | null,
        private readonly startDate?: Date | null,
        private readonly endDate?: Date | null,
        private readonly search?: string | null,
        private readonly page?: number,
        private readonly pageSize?: number
    ) {}

    static create(data: any = {} as any): RequestFilter {
        return new RequestFilter(
            data.status,
            data.startDate,
            data.endDate,
            data.search,
            data.page,
            data.pageSize
        );
    }

    toDto(): any {
        const params: any = {};

        if (this.status) params['status'] = this.status;
        if (this.startDate) params['start_date'] = this.startDate;
        if (this.endDate) params['end_date'] = this.endDate;
        if (this.search) params['search'] = this.search;
        if (this.page) params['page'] = this.page;
        if (this.pageSize) params['page_size'] = this.pageSize;

        return params;
    }
}
