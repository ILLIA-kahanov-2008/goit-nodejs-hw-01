const chalk = require("chalk");
const { Command } = require("commander");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
} = require("./contacts");
const program = new Command();
program
  .requiredOption("-a, --action <type>", "choose action")
  .option("-i, --id <type>", "user id")
  .option("-n, --name <type>", "user name")
  .option("-e, --email <type>", "user email")
  .option("-p, --phone <type>", "user phone");

program.parse(process.argv);

const argv = program.opts();

const invokeAction = async ({ action, id, name, email, phone }) => {
  switch (action) {
    case "list":
      try {
        const data = await listContacts();
        if (data.length===0)
          return console.log(
            chalk.green.bgGrey("Unfortunately there are no contacts to display"),
          );
        if (data?.ERROR) throw new Error(data.ERROR);
        console.log(
          chalk.green("Successfully done.") +
            chalk.bgGrey.underline("Contacts in your phoneBook is:"),
        );        
        console.table(data);
      } catch (error) {
        console.log(
          chalk.red(
            chalk.underline.bold("Oops, ERROR:") +
              chalk.bgGrey(`${error.message}`),
          ),
        );
      }
      break;

    case "get":
      try {
        const data = await getContactById(id);
        if (data?.ERROR) throw new Error(data.ERROR);
        console.log(
          chalk.green("Successfully done.") +
            chalk.bgGrey.underline(`Contact data by id="${id}" is:`),
        );   
        console.table(data);
      } catch (error) {
        console.log(
          chalk.red(
            chalk.underline.bold("Oops, ERROR:") +
              chalk.bgGrey(`${error.message}`),
          ),
        );
      }

      break;

    case "add":
      try {
        const data = await addContact(name, email, phone);
        if (data?.ERROR) throw new Error(data.ERROR);
         console.log(
          chalk.green("Successfully done.") +
            chalk.bgGrey("Added contact is:"),
        );        
        console.table(data);
      } catch (error) {
        console.log(
          chalk.red(
            chalk.underline.bold("Oops, ERROR:") +
              chalk.bgGrey(`${error.message}`),
          ),
        );
      }
      break;

    case "remove":
      try {
        const data = await removeContact(id);
        if (data?.ERROR) throw new Error(data.ERROR);
        console.log(
          chalk.green("Successfully done.") +
            chalk.bgGrey(`Removed contact by id="${id}" is:`),
        );
        console.table(data);
      } catch (error) {
        console.log(
          chalk.red(
            chalk.underline.bold("Oops, ERROR:") +
              chalk.bgGrey(`${error.message}`),
          ),
        );
      }
      break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
};

invokeAction(argv);

