const { createApp } = require("./app");
const dataSource = require("./src/models/dataSource");

const start = async () => {
  const app = createApp();

  try {
    dataSource
      .initialize()
      .then(() => {
        console.log("Data Source has been initialized!");
      })
      .catch((err) => {
        console.log("Error occured during Data Source initializtion!", err);
        dataSource.destroy();
      });

    const port = process.env.PORT || 3000;

    app.listen(port, () => console.log(`Server is listening on ${port}`));
  } catch (err) {
    console.log(err);
  }
};

start();
