import yargs from "yargs"

// you *have to* specify <postcode>
exports.command = "find <postcode>";
exports.desc =
    "This is the find command. You enter a postcode and the app outputs the FourSquare locations near you in a CSV file <postcode>.csv";

exports.builder = (yargs: yargs.Argv<{}>) => {
  yargs
      .example(`$0 find NW13FG`, `This is an example of how to use this command`)
      .example(
          `$0 find EC1R5EY`,
          `This is another example of how to use this command`
      );
};

exports.handler = async (argv: { postcode: string }) => {
  const {postcode} = argv;

  console.log("postcode", postcode);
};
