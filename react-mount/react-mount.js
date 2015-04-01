/*
  TODO:

  - Allow Data binding with {…} and data object 
  - replace elements:
      <br>   ->   <br />
      class  ->   className
      for    ->   htmlFor

    check: https://facebook.github.io/react/docs/tags-and-attributes.html

*/

var React = require("react");
var ReactTools = require("react-tools");
var objectKeys = Object.keys || objectKeysShim;

///////////////////////////////////////////////////////////////////////////////

module.exports = mount;

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function mount(context, tags, data){
  // Normalize Input
  if(!isDOMElement(context)){
    data = tags;
    tags = context;
    context =  document.body;
  }
  mountTags(context, tags, data || {});
}

///////////////////////////////////////////////////////////////////////////////

function mountTags(context, tags, data){
  var keys = objectKeys(tags);

  // keys to uppercase to compare to nodeName
  for(var i=0; i<keys.length; i++) keys[i]=keys[i].toUpperCase();

  // if context is tag
  if(keys.indexOf(context.nodeName) >= 0) {
    mountTag(context, tags, data);
    return;
  };

  //Mount all top-level child tags within context
  var nodes, el, mount, n;
  for(var i=0; i<keys.length; i++) {
    nodes = context.getElementsByTagName(keys[i]);
    for(n=0; n<nodes.length; n++) {
      el = nodes[n];
      mount = true;
      while(el = el.parentNode) {
        if(keys.indexOf(el.nodeName) >= 0) {
          mount = false;
          break;
        }
        if(el === context) break;
      }
      if(mount) mountTag(nodes[n], tags, data);
    }
  }  
}

///////////////////////////////////////////////////////////////////////////////

function mountTag(tag, tags, data) {
  var str = tag.outerHTML;
  var keys = objectKeys(tags);

  // remove comments  
  str = str.replace(/<!--((\s*.*)*)-->/g,"");

  // replace all lowercase html tagnames with actual tagnames
  for(var i = 0; i<keys.length; i++) {
    str = str
      .replace(new RegExp("\<\s*"+keys[i], "ig"), "<"+keys[i])
      .replace(new RegExp("\<\s*\/\s*"+keys[i], "ig"), "</"+keys[i]);
  }

  var jsx = ReactTools.transform(str);

  // replace component variables (ComponentName) with corrected variables (tags.ComponentName)
  for(var i = 0; i<keys.length; i++) {
    jsx = jsx
      .replace(new RegExp("createElement\\("+keys[i], "g"), "createElement(tags."+keys[i]); 
  }

  // Render JSX and transform it into HTML
  var tempElement = document.createElement('div');
  tempElement.innerHTML = React.renderToString(eval(jsx));
  
  // Replace tag with rendered HTML
  tag.parentNode.replaceChild(tempElement.childNodes[0], tag);
}

///////////////////////////////////////////////////////////////////////////////

function isDOMElement(o) {
  return (
    typeof HTMLElement === "object" ? 
      o instanceof HTMLElement : //DOM2
      o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
  );
}

///////////////////////////////////////////////////////////////////////////////

function objectKeysShim(o){
  var keys = [];
  for(key in o) keys.push(key);
  return keys;
}
