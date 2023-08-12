import postcodes from "node-postcodes.io";

type LongLatResult = {
    status: number;
    result: { longitude: number; latitude: number };
};

export const convertPostCodeToLongLat = async (
    postcode: string
): Promise<LongLatResult> => {
    return await postcodes.lookup(postcode);
};
