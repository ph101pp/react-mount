var React = require("react");
var Text = require("./Text.jsx");
module.exports = React.createClass({

  render: function() {
    var message = "ExampleApplication:";

    return (
      <div>
        <p>{this.props.test} {this.props.bla}</p>
        {this.props.children}
      </div>
    ); 
  }, 
});
