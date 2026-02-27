export interface HomeUpdateApiDto {
    uniq_id: string;
    image: string;
    platforms: string[];
    start_date: string;
    end_date: string;
    title: string;
    resume: string;
    content: string;
    button_label?: string;
    button_url?: string;
}
