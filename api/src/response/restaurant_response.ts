import { User } from "./user_response";

interface IRestaurant {
    id: number;
    name: string;
    address: string;
    prefecture_id: number;
    rating: number;
    user?: User | null;
}

export type Restaurant = {
    id: number;
    name: string;
    address: string;
    prefecture_id: number;
    rating: number;
    author?: User | null;
}

export type GetAllRestaurantsResponse = {
    restaurants: Restaurant[];
}

export type GetRestaurantByIDResponse = {
    restaurant: Restaurant;
}

export type GetRestaurantsByKeywordResponse = {
    restaurants: Restaurant[];
}

export const newGetAllRestaurantsResponse = (restaurants: IRestaurant[]): GetAllRestaurantsResponse => {
    return {
        restaurants: restaurants.map((restaurant) => {
            return {
                id: restaurant.id,
                name: restaurant.name,
                address: restaurant.address,
                prefecture_id: restaurant.prefecture_id,
                rating: restaurant.rating,
                author: restaurant.user
            }
        }),
    };
};

export const newGetRestaurantByIDResponse = (restaurant: IRestaurant): GetRestaurantByIDResponse => {
    return {
        restaurant: {
            id: restaurant.id,
            name: restaurant.name,
            address: restaurant.address,
            prefecture_id: restaurant.prefecture_id,
            rating: restaurant.rating,
            author: restaurant.user,
        }
    };
};

export const newGetRestaurantsByKeywordResponse = (restaurants: IRestaurant[]): GetRestaurantsByKeywordResponse => {
    return {
        restaurants: restaurants.map((restaurant) => {
            return {
                id: restaurant.id,
                name: restaurant.name,
                address: restaurant.address,
                prefecture_id: restaurant.prefecture_id,
                rating: restaurant.rating,
                author: restaurant.user,
            };
        }),
    };
};
