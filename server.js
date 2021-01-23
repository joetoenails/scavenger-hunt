const express = require("express");
const app = express();
const server = require("http").createServer(app);
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

// START THE SERVER ==========================================================
const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
