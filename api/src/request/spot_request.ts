export type CreateSpotRequest = {
    name: string;
    address: string;
    prefecture_id: number;
};

export type UpdateSpotRequest = {
    name?: string;
    address?: string;
    prefecture_id?: number;
};
