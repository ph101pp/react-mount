var React = require("react");
var ExampleApplication = require("./ExampleApplication.jsx");

var start = new Date().getTime();

setInterval(function() {
  React.render(
    <ExampleApplication elapsed={new Date().getTime() - start} />,
    document.getElementById('container')
  );
}, 50);