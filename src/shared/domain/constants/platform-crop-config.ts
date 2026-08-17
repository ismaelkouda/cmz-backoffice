type PlatformType = 'web' | 'mobile' | 'pwa';

export interface PlatformImageConfig {
    width: number;
    height: number;
    aspectRatio: number;
}

export const PLATFORM_IMAGE_CONFIG: Record<PlatformType, PlatformImageConfig> =
    {
        web: {
            width: 1600,
            height: 600,
            aspectRatio: 1600 / 600,
        },

        mobile: {
            width: 800,
            height: 1000,
            aspectRatio: 800 / 1000,
        },

        pwa: {
            width: 1200,
            height: 800,
            aspectRatio: 1200 / 800,
        },
    };
