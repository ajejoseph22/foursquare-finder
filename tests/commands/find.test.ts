const fs = require("fs");
const {handler} = require("../../src/lib/commands/find");

jest.mock("api", () => {
  return (uri: string) => ({
    placeSearch: jest.fn(() => ({
      data: {
        results: [
          {
            fsq_id: "string",
            categories: [{name: "something"}],
            location: {formatted_address: "something"},
            geocodes: {main: {latitude: 23, longitude: 45}},
            distance: 2,
          },
        ],
      },
    })),
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

describe("find command handler", () => {
  const PATH = "results/NW13FG.csv";

  beforeAll(() => {
    if (fs.existsSync(PATH)) {
      throw new Error(`File ${PATH} already exists`);
    }
  });

  afterAll(() => {
    fs.unlinkSync(PATH);
  });

  it("creates a correct <postcode>.csv file in results folder`", async () => {
    await handler({postcode: "NW13FG"});

    expect(fs.existsSync(PATH)).toBe(true);
    expect(fs.readFileSync(PATH, "utf8")).toBe(
        `FSQ ID,Category,Formatted Address,Geocodes,Distance,Image\nstring,something,something,"23, 45",2m away,some/original/image.png`
    );
  });
});
