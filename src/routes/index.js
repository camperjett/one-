module.exports = function (app) {
  app.use("/admin/upload", require("./upload.routes"));
  app.use("/api", require("./api/index"));
}