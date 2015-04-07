(function(module, require, window, document, undefined){
"use strict";

require = require || requireShim;
var React = window.React || require("react");
var ReactTransform = window.JSXTransformer ? window.JSXTransformer.transform : require("react-tools").transformWithDetails;
var objectKeys = Object.keys || objectKeysShim;
var selfClosingTags = ["area","base","br","col","command","embed","hr","img","input","keygen","link","meta","param","source","track","wbr"];

///////////////////////////////////////////////////////////////////////////////
// Export / Attach / Public

module.exports = mountTags;
if(typeof window.React === "object") window.React.mount = mountTags;
if(typeof define === "function" && define.amd) define(function(){return mountTags});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// html to jsx (More info: https://facebook.github.io/react/docs/tags-and-attributes.html)

function htmlToJsx(str){
  // // remove html comments.. doesn't work in safari.. wtf
  // str = str
  //   .replace(/<!--((?:\s|.)*)-->/g,"")

  // for attribute to htmlFor
  str = replaceAttribute(str, "for", "htmlFor");
  // class attribute to className
  str = replaceAttribute(str, "class", "className");

  // "selfclose" self closing tags: "…>" to "…/>"
  for(var k=0; k<selfClosingTags.length; k++) {
    str = str.replace(new RegExp("(<"+selfClosingTags[k]+"(?:[^>\"']|\".*\"|'.*')*)\/?>","ig"),"$1"+" />");
  }

  // Remove auto-quotes around {expressions} + Remove {expression}="" attachment
  str = str
    .replace(/<(?:[^>\"']|\".*\"|'.*')*=(?:[^>\"']|\".*\"|'.*')*>/g, function(match){
      return match.replace(/(?:"|')?(\{(?:[^\'"}]|".*"|'.*')*\})(?:"|')?(?:=""|='')?/g, "$1");
    });

  // Transform style attribute string ("color:red; background-image:url()") to object ({{color:'red', backgroundImage:'url()'}})
  str = str.replace(/(<(?:[^>"']|".*"|'.*')*\sstyle\s*=\s*)((?:"(?:[^"]|\s)*")|(?:'(?:[^']|\s)*'))((?:[^>"']|".*"|'.*')*>)/ig, function(match, start, style, end){
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

function mountTag(tag, tags, opts) {
  var str = tag.outerHTML;
  var keys = objectKeys(tags);
  var props = opts.props || {};
  var attributes = opts.attributes || [];

  // transform tagnames to random strings starting with "AB" (Aj4awwubx1or);
  var key, reactTags = {}, reactKeys=[], tagAttributes = [];
  for(var i = 0; i<keys.length; i++) {
    key = "AB"+Math.random().toString(36).substring(2);
    if(typeof tags[keys[i]] !== "function") {
      if(typeof tags[keys[i]].slice !== "function") continue;
      reactTags[key] = tags[keys[i]].slice(-1)[0];
      tagAttributes = tags[keys[i]].slice(0,-1);
    }
    else reactTags[key] = tags[keys[i]];

    reactKeys.push(key);
    str = str
      .replace(new RegExp("(<\/?)"+keys[i]+"(?:[^>\"']|\".*\"|'.*')*>", "ig"), function(match, start){
        // find/replace spell-save attributes within tag to restore capitals
        if(start !== "</")
          for(var a=0; a<tagAttributes.length; a++)
            match = replaceAttribute(match, tagAttributes[a], tagAttributes[a]);

        // replace key
        return match
          .replace(new RegExp(start+keys[i]+"(\\s|>)", "i"), start+key+"$1");
      });
  }

  // remove/disable html comments
  str = str.replace(/<!--|-->/g,"")

  // find/replace global spell-save attributes to restore capitals
  for(var i=0; i<attributes.length; i++) 
    str = replaceAttribute(str, attributes[i], attributes[i]);

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

function mountTags(tags, opts){
  opts = opts || {};
  var context = opts.context || document.body;
  var keys = objectKeys(tags);

  // keys to uppercase to compare to nodeName
  for(var i=0; i<keys.length; i++) keys[i]=keys[i].toUpperCase();

  // if context is tag
  if(keys.indexOf(context.nodeName) >= 0) {
    mountTag(context, tags, opts);
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
      if(mount) mountTag(nodes[n], tags, opts);
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

function replaceAttribute(str, search, replace){
  return str
    .replace(new RegExp("(<(?:[^>\"']|\".*\"|'.*')*\\s)"+search+"(\s*=(?:[^>\"']|\".*\"|'.*')*>)", "ig"), "$1"+replace+"$2");
}

///////////////////////////////////////////////////////////////////////////////

function requireShim(required){
  throw "react-mount: Error - React and JSXTransformer/react-tools are required for react-mount to work";
}

///////////////////////////////////////////////////////////////////////////////

})(typeof module === "object" ? module : {}, typeof require === "function" ? require : undefined, window, document);
