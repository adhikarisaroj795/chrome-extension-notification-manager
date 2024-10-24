const connectDb = require("../backend/API/utils/db.config");
const app = require("./API/app");

app.get("/test", (req, res) => {
  res.json("test passed");
});

connectDb();
app.listen(process.env.PORT, (err) => {
  if (err) {
    console.error("error while connecting to the server", err);
    return;
  } else {
    console.log(
      `Server connected to the PORT ${process.env.PORT} on ${process.env.NODE_ENV}`
    );
    console.log("server is running");
  }
});
