import fse from "fs-extra";
import yargs from "yargs";
import { json2csv } from "json-2-csv";
import { convertPostCodeToLongLat, queryFsPlaces } from "../utils";

// you *have to* specify <postcode>
exports.command = "find <postcode>";
exports.desc =
    "This is the find command. You enter a UK postcode and the app outputs the FourSquare locations near you in a CSV file <postcode>.csv";

exports.builder = (yargs: yargs.Argv<{}>) => {
    yargs
        .example(
            `$0 find NW13FG`,
            `This is an example of how to use this command`
        )
        .example(
            `$0 find EC1R5EY`,
            `This is another example of how to use this command`
        );
};

exports.handler = async (argv: { postcode: string }) => {
    const { postcode } = argv;

    // Convert postcode to long/lat
    const longLat = await convertPostCodeToLongLat(postcode);

    // Query FourSquare API
    const fsApiResult = await queryFsPlaces(longLat);

    // Create a csv file <postcode>.csv and save results
    const csv = await json2csv(fsApiResult);
    await fse.outputFile(`results/${postcode}.csv`, csv);
    console.log("File successfully saved in results folder");
};
