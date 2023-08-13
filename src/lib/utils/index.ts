import postcodes from "node-postcodes.io";

const sdk = require("api")("@fsq-developer/v1.0#78iknmrc2aljgfbp90");

sdk.auth(process.env.FOURSQUARE_API_KEY);

type LongLatResult = {
    status: number;
    result: { longitude: number; latitude: number };
};

type SearchResultItem = {
    fsq_id: string;
    categories: { name: string }[];
    location: { formatted_address: string };
    geocodes: { main: { latitude: number; longitude: number } };
    distance: number;
};

type ImageResult = { data: [{ prefix: string; suffix: string }] };
type SearchResult = {
    results: SearchResultItem[];
};

export const convertPostCodeToLongLat = async (
    postcode: string
): Promise<LongLatResult> => {
    const result = await postcodes.lookup(postcode);

    if (result.status !== 200) {
        throw new Error(
            `Error converting postcode to long/lat: ${result.error}`
        );
    }

    return result;
};

export const queryFsPlaces = async (longLat: LongLatResult) => {
    let searchResult: SearchResult, imageResults: ImageResult[];

    try {
        searchResult = (
            await sdk.placeSearch({
                ll: encodeURI(
                    `${longLat.result.latitude},${longLat.result.longitude}`
                ),
            })
        ).data;

        imageResults = await Promise.all(
            searchResult.results.map(({ fsq_id }: SearchResultItem) =>
                sdk.placePhotos({ fsq_id })
            )
        );
    } catch (err) {
        throw new Error(
            `An error occurred while querying FourSquare API: ${err}`
        );
    }

    return searchResult.results.map((item: SearchResultItem, index: number) => {
        const imageObj = imageResults[index].data[0];
        const image = `${imageObj.prefix}original${imageObj.suffix}`;
        return {
            "FSQ ID": item.fsq_id,
            Category: item.categories
                .map((category) => category.name)
                .join(", "),
            "Formatted Address": item.location.formatted_address,
            Geocodes: `${item.geocodes.main.latitude}, ${item.geocodes.main.longitude}`,
            Distance: `${item.distance}m away`,
            Image: image,
        };
    });
};
