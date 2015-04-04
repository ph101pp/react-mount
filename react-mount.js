(function(module, require, window, document, undefined){
"use strict";

require = require || requireShim;
var React = window.React || require("react");
var ReactTransform = window.JSXTransformer ? window.JSXTransformer.transform : require("react-tools").transformWithDetails;
var objectKeys = Object.keys || objectKeysShim;
var selfClosingTags = ["area","base","br","col","command","embed","hr","img","input","keygen","link","meta","param","source","track","wbr"];

///////////////////////////////////////////////////////////////////////////////
// Export / Attach / Public

module.exports = mount;
if(typeof window.React === "object") window.React.mount = mount;
if(typeof define === "function" && define.amd) define(function(){return mount});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// html to jsx (More info: https://facebook.github.io/react/docs/tags-and-attributes.html)

function htmlToJsx(str){
  str = str
    // remove html comments.. doesn't work in safari.. wtf
    //.replace(/<!--((?:\s|.)*)-->/g,"")
    // class attribute to className
    .replace(/(<(?:[^>"']|".*"|'.*')*)class(\s*=(?:[^>"']|".*"|'.*')*>)/ig, "$1"+"className"+"$2")
    // for attribute to htmlFor
    .replace(/(<(?:[^>"']|".*"|'.*')*)for(\s*=(?:[^>"']|".*"|'.*')*>)/ig, "$1"+"htmlFor"+"$2");

  // "selfclose" self closing tags: "…>" to "…/>"
  for(var k=0; k<selfClosingTags.length; k++) {
    str = str.replace(new RegExp("(<"+selfClosingTags[k]+"(?:[^>\"']|\".*\"|'.*')*)\/?>","ig"),"$1"+" />");
  }

  // Remove auto-quotes around {expressions}
  str = str
    .replace(/<(?:[^>\"']|\".*\"|'.*')*=(?:[^>\"']|\".*\"|'.*')*>/g, function(match){
      return match.replace(/(?:"|')(\{.*?\})(?:"|')/g,"$1");
    });

  // Transform style attribute string ("color:red; background-image:url()") to object ({{color:'red', backgroundImage:'url()'}})
  str = str.replace(/(<[A-Z](?:[^>"']|".*"|'.*')*style\s*=\s*)((?:"(?:[^"]|\s)*")|(?:'(?:[^']|\s)*'))((?:[^>"']|".*"|'.*')*>)/ig, function(match, start, style, end){
    var styles = "";
    style
      .slice(1,-1)
      .replace(/(&quot)|'/g,'"')
      .replace(/\s*([^:;]*)\s*:\s*((?:[^;"]|".*")*)\s*;?/g, function(match, key, value){

        // transform key to camelCase
        key = key.replace(/-([^-]*)/g, function(match, part){
          if(part === "ms") return part;
          return part.charAt(0).toUpperCase()+part.slice(1);
        });

        styles+=key+":'"+value+"',";
        
        return match;
      });

    return start+"{{"+styles.slice(0,-1)+"}}"+end;
  });

  return str;
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

function mount(context, tags, props){
  // Normalize Input
  if(!isDOMElement(context)){
    props = tags;
    tags = context;
    context =  document.body;
  }
  mountTags(context, tags, props || {});
}

///////////////////////////////////////////////////////////////////////////////

function mountTag(tag, tags, props) {
  var str = tag.outerHTML;
  var keys = objectKeys(tags);

  // transform tagnames to random strings starting with "AB" (Aj4awwubx1or);
  var key, reactTags = {}, reactKeys=[];
  for(var i = 0; i<keys.length; i++) {
    key = "AB"+Math.random().toString(36).substring(2);
    reactTags[key] = tags[keys[i]];
    reactKeys.push(key);
    str = str
      .replace(new RegExp("(<\/?)"+keys[i], "ig"), "$1"+key)
  }

  // remove/disable comments
  str = str.replace(/<!--|-->/g,"");

  var jsx = htmlToJsx(str);

  // replace props variables {key} with corrected variables {props['key']}
  for(key in props) {
    jsx = jsx
      .replace(new RegExp("(\{"+key+"\})","g"),"{props['"+key+"']}");
  }
  
  var component = ReactTransform(jsx).code;
  
  // replace component variables (ComponentName) with corrected variables (reactTags['ComponentName'])
  for(var i = 0; i<reactKeys.length; i++) {
    component = component
      .replace(new RegExp(reactKeys[i],"g"), "reactTags['"+reactKeys[i]+"']"); 
  }
  
  // Render JSX and transform it into HTML
  var tempElement = document.createElement('div');
  tempElement.innerHTML = React.renderToString(eval(component));
  
  // Replace tag with rendered HTML
  tag.parentNode.replaceChild(tempElement.childNodes[0], tag);
} 

///////////////////////////////////////////////////////////////////////////////

function mountTags(context, tags, props){
  var keys = objectKeys(tags);

  // keys to uppercase to compare to nodeName
  for(var i=0; i<keys.length; i++) keys[i]=keys[i].toUpperCase();

  // if context is tag
  if(keys.indexOf(context.nodeName) >= 0) {
    mountTag(context, tags, props);
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
      if(mount) mountTag(nodes[n], tags, props);
    }
  }  
}

///////////////////////////////////////////////////////////////////////////////

function objectKeysShim(o){
  var keys = [];
  for(key in o) keys.push(key);
  return keys;
}

///////////////////////////////////////////////////////////////////////////////

function requireShim(required){
  throw "react-mount: Error - React and JSXTransformer/react-tools are required for react-mount to work";
}

///////////////////////////////////////////////////////////////////////////////

})(typeof module === "object" ? module : {}, typeof require === "function" ? require : undefined, window, document);
