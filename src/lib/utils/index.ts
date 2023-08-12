import postcodes from "node-postcodes.io";

const sdk = require('api')('@fsq-developer/v1.0#78iknmrc2aljgfbp90');

sdk.auth(process.env.FOURSQUARE_API_KEY);

type LongLatResult = {
    status: number;
    result: { longitude: number; latitude: number };
};

export const convertPostCodeToLongLat = async (
    postcode: string
): Promise<LongLatResult> => {
    return await postcodes.lookup(postcode);
};

export const queryFsPlaces = async (longLat: LongLatResult) => {
    return await sdk.placeSearch({ll: encodeURI(`${longLat.result.latitude},${longLat.result.longitude}`)});
};

