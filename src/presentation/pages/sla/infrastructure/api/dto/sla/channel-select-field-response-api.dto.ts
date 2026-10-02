export interface ChannelSelectFieldItemApiDto {
    id: string;
    name: string;
}

export interface ChannelSelectFieldResponseApiDto {
    error: boolean;
    message: string;
    data: ChannelSelectFieldItemApiDto[];
}
