export interface IStatistiquesBox {
    id?: number;
    cardBgColor: string;
    cardBorderColor?: string;
    countColor?: string;
    legendColor?: string;
    legend: string;
    count: number;
    taux?: number;
    icon?: string;
    width?: String;
    routerFilter?: () => void;
    iframeLink?: string;
}
