var mount = require("../../../react-mount.js");

mount({
  "Text" : require("./Text.jsx"),
  "example-application" : require("./ExampleApplication.jsx")
}, {
  "method":"hello",
  "add":"philipp"
});