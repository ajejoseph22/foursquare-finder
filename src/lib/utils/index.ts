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

export const convertPostCodeToLongLat = async (
    postcode: string
): Promise<LongLatResult> => {
  return await postcodes.lookup(postcode);
};

export const queryFsPlaces = async (longLat: LongLatResult) => {
  const searchResult = (await sdk.placeSearch({
    ll: encodeURI(`${longLat.result.latitude},${longLat.result.longitude}`),
  })).data;

  const imageResults = await Promise.all(
      searchResult.results.map(({fsq_id}: SearchResultItem) =>
          sdk.placePhotos({fsq_id})
      )
  );

  return searchResult.results.map((item: SearchResultItem, index: number) => {
    const imageObj = imageResults[index].data[0];
    const image = `${imageObj.prefix}original${imageObj.suffix}`;
    return {
      image,
      "FSQ ID": item.fsq_id,
      Category: item.categories.map((category) => category.name).join(", "),
      "Formatted Address": item.location.formatted_address,
      Geocodes: `${item.geocodes.main.latitude}, ${item.geocodes.main.longitude}`,
      Distance: `${item.distance}m away`,
    };
  });
};
