import mocked = jest.mocked;

const postcodes = require("node-postcodes.io");
import { convertPostCodeToLongLat, queryFsPlaces } from "../../src/lib/utils";

jest.mock("node-postcodes.io", () => ({
    lookup: jest.fn().mockResolvedValue({
        status: 200,
    }),
}));

jest.mock("api", () => {
    return (uri: string) => ({
        placeSearch: jest.fn().mockResolvedValue({
            data: {
                results: [
                    {
                        fsq_id: "string",
                        categories: [{ name: "something" }],
                        location: { formatted_address: "something" },
                        geocodes: { main: { latitude: 23, longitude: 34 } },
                        distance: 2,
                    },
                ],
            },
        }),
        placePhotos: jest.fn(() => ({
            data: [
                {
                    prefix: "some/",
                    suffix: "/image.png",
                },
            ],
        })),
        auth: jest.fn((auth?: string) => "mocked response"),
    });
});

describe("convertPostCodeToLongLat", () => {
    it("calls postcodes.lookup with the right postcode", async () => {
        // Arrange
        const postcode = "NW13FG";

        // Act
        await convertPostCodeToLongLat(postcode);

        // Assert
        expect(postcodes.lookup).toHaveBeenCalledWith(postcode);
    });

    it("throws an error if postcodes.lookup returns an error", async () => {
        // Arrange
        const postcode = "NW13FG";
        mocked(postcodes.lookup).mockResolvedValue({
            status: 404,
            error: "Invalid postcode",
        });

        // Act & Assert
        await expect(convertPostCodeToLongLat(postcode)).rejects.toThrow(
            "Error converting postcode to long/lat: Invalid postcode"
        );
    });
});

describe("queryFsPlaces", () => {
    it("returns the right csv object", async () => {
        // Arrange
        const params = { status: 200, result: { longitude: 23, latitude: 34 } };

        // Act
        const result = await queryFsPlaces(params);

        // Assert
        expect(result).toEqual([
            {
                Category: "something",
                Distance: "2m away",
                "FSQ ID": "string",
                "Formatted Address": "something",
                Geocodes: "23, 34",
                Image: "some/original/image.png",
            },
        ]);
    });
});
