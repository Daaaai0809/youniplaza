import { Tag } from "./tag_reponse";
import { User } from "./user_response";

interface ISpot {
    id: number;
    name: string;
    address: string;
    prefecture_id: number;
    rating: number;
    user?: User | null;
    tag_to_spots?: {
        tag: Tag;
    }[];
}

export type Spot = {
    id: number;
    name: string;
    address: string;
    prefecture_id: number;
    rating: number;
    author?: User | null;
    tags?: Tag[];
}

export type GetAllSpotsResponse = {
    spots: Spot[];
}

export type GetSpotByIDResponse = {
    spot: Spot;
}

export type GetSpotsByKeywordResponse = {
    spots: Spot[];
}

export const newGetAllSpotsResponse = (spots: ISpot[]): GetAllSpotsResponse => {
    return {
        spots: spots.map((spot) => {
            const tags = spot.tag_to_spots?.map((tagToSpot) => {
                return tagToSpot.tag;
            });

            return {
                id: spot.id,
                name: spot.name,
                address: spot.address,
                prefecture_id: spot.prefecture_id,
                rating: spot.rating,
                author: spot.user,
                tags: tags || [],
            }
        }),
    };
};

export const newGetSpotByIDResponse = (spot: ISpot): GetSpotByIDResponse => {
    const tags = spot.tag_to_spots?.map((tagToSpot) => {
        console.log(tagToSpot.tag);

        return tagToSpot.tag;
    }) || [];

    return {
        spot: {
            id: spot.id,
            name: spot.name,
            address: spot.address,
            prefecture_id: spot.prefecture_id,
            rating: spot.rating,
            author: spot.user,
            tags: tags,
        }
    };
};

export const newGetSpotsByKeywordResponse = (spots: ISpot[]): GetSpotsByKeywordResponse => {
    return {
        spots: spots.map((spot) => {
            const tags = spot.tag_to_spots?.map((tagToSpot) => {
                return tagToSpot.tag;
            });

            return {
                id: spot.id,
                name: spot.name,
                address: spot.address,
                prefecture_id: spot.prefecture_id,
                rating: spot.rating,
                author: spot.user,
                tags: tags || [],
            };
        }),
    };
};
