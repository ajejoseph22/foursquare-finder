#!/usr/bin/env node
import "dotenv/config";
import yargs from "yargs";

(async () => {
  yargs
      .commandDir("./lib/commands")
      .demandCommand(1, "Did you forget to specify a command?")
      .recommendCommands()
      .showHelpOnFail(true, "Specify --help for available options")
      .strict(true)
      .help()
      .wrap(yargs.terminalWidth()).argv;
})();
