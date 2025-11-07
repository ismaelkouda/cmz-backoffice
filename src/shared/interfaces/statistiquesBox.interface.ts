export interface IStatisticsBox {
    id?: number;
    cardBgColor: string;
    cardBorderColor?: string;
    countColor?: string;
    legendColor?: string;
    legend: string;
    count: number | string;
    taux?: number;
    icon?: string;
    width?: string;
    routerFilter?: () => void;
    iframeLink?: string;
}
