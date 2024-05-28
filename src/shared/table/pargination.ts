export class Pargination {
    p: number;
    to: number;
    last_page: number;
    total: number;
    per_page: number;
    currentPage: number;
    offset: number;
    constructor(p: number, to: number, last_page: number, total: number, 
        per_page: number, currentPage: number, offset: number) {
            this.p= p;
            this.to= to;
            this.last_page= last_page;
            this.total= total;
            this.per_page= per_page;
            this.currentPage= currentPage;
            this.offset= offset;
    }
}