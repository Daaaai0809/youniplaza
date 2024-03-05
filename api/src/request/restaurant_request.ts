export type CreateRestaurantRequest = {
    name: string;
    address: string;
    prefecture_id: number;
};

export type UpdateRestaurantRequest = {
    name?: string;
    address?: string;
    prefecture_id?: number;
};
