var React = require("react");

module.exports = React.createClass({
  render: function() {
   
    return (
      <div>
        {this.props.children} 

        <p><br />React <b>is</b> running.</p> 
      </div>
    );
  }
});
