(function(module, require, window, document, undefined){
/*
  TODO:

  - Allow Data binding with {…} and data object 
  - Transform style string to object

*/
require = require || requireShim;
var React = window.React || require("react");
var ReactTools = window.JSXTransformer || require("react-tools");
var objectKeys = Object.keys || objectKeysShim;
var selfClosingTags = ["area","base","br","col","command","embed","hr","img","input","keygen","link","meta","param","source","track","wbr"];

///////////////////////////////////////////////////////////////////////////////
// Export / Attach / Public

module.exports = mount;
if(typeof window.React === "object") window.React.mount = mount;
if(typeof define === "function" && define.amd) define(function(){return mount});

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

  // html to jsx (More info: https://facebook.github.io/react/docs/tags-and-attributes.html)
  str = str
    // remove comments  
    .replace(/<!--((\s|.)*)-->/g,"")
    // class attribute to className
    .replace(/(<(?:[^>"']|".*"|'.*')*)class(\s*=(?:[^>"']|".*"|'.*')*>)/g, "$1"+"className"+"$2")
    // for attribute to htmlFor
    .replace(/(<(?:[^>"']|".*"|'.*')*)for(\s*=(?:[^>"']|".*"|'.*')*>)/g, "$1"+"htmlFor"+"$2");

  // "selfclose" self closing tags: ">" to "/>"
  for(var k=0; k<selfClosingTags.length; k++) {
    str = str.replace(new RegExp("(<"+selfClosingTags[k]+"(?:[^>\"']|\".*\"|'.*')*)\/?>","ig"),"$1"+" />");
  }
 
  // all lowercase html tagnames to all uppercase tagnames
  var key, reactTags = {}, reactKeys=[];
  for(var i = 0; i<keys.length; i++) {
    key = keys[i].toUpperCase().replace("-", "_");
    reactTags[key] = tags[keys[i]];
    reactKeys.push(key);
    str = str
      .replace(new RegExp("\<\s*"+keys[i], "ig"), "<"+key)
      .replace(new RegExp("\<\s*\/\s*"+keys[i], "ig"), "</"+key);
  }
  
  var jsx = ReactTools.transform(str);

  // replace component variables (ComponentName) with corrected variables (reactTags.ComponentName)
  for(var i = 0; i<reactKeys.length; i++) {
    jsx = jsx
      .replace(new RegExp("createElement\\("+reactKeys[i], "g"), "createElement(reactTags."+reactKeys[i]); 
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

///////////////////////////////////////////////////////////////////////////////

function requireShim(required){
  throw "react-mount: Error – React and JSXTransformer/react-tools are required for react-mount to work";
}

})(typeof module === "object" ? module : {}, typeof require === "function" ? require : undefined, window, document);
