const mongoose = require("mongoose");
const app = require("./app");

const { DB_HOST, PORT_LOCAL = 3000 } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() =>
    app.listen(PORT_LOCAL, () => {
      console.log(
        `Database "denmark-api" connection successful. Use API on port: ${PORT_LOCAL}`,
      );
    }),
  )
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
