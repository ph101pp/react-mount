/**
 * Copyright 2015, Philipp Adrian, philippadrian.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

"use strict";
(function(module, require, window, document, undefined){

var React = window.React || require("react");
var ReactTransform = window.JSXTransformer ? 
  window.JSXTransformer.transform : 
  require("react-tools").transformWithDetails;
var objectKeys = Object.keys || objectKeysShim;
var selfClosingTags = ["area","base","br","col","command","embed","hr","img","input","keygen","link","meta","param","source","track","wbr"];
var preserveReactAttributes = ["onBeforeInput", "onBeforeInputCapture", "onCompositionEnd", "onCompositionEndCapture", "onCompositionStart", "onCompositionStartCapture", "onCompositionUpdate", "onCompositionUpdateCapture", "onChange", "onChangeCapture", "ResponderEventPlugin", "SimpleEventPlugin", "TapEventPlugin", "EnterLeaveEventPlugin", "ChangeEventPlugin", "SelectEventPlugin", "BeforeInputEventPlugin", "AnalyticsEventPlugin", "MobileSafariClickEventPlugin", "onMouseEnter", "onMouseLeave", "onSelect", "onSelectCapture", "onBlur", "onBlurCapture", "onClick", "onClickCapture", "onContextMenu", "onContextMenuCapture", "onCopy", "onCopyCapture", "onCut", "onCutCapture", "onDoubleClick", "onDoubleClickCapture", "onDrag", "onDragCapture", "onDragEnd", "onDragEndCapture", "onDragEnter", "onDragEnterCapture", "onDragExit", "onDragExitCapture", "onDragLeave", "onDragLeaveCapture", "onDragOver", "onDragOverCapture", "onDragStart", "onDragStartCapture", "onDrop", "onDropCapture", "onFocus", "onFocusCapture", "onInput", "onInputCapture", "onKeyDown", "onKeyDownCapture", "onKeyPress", "onKeyPressCapture", "onKeyUp", "onKeyUpCapture", "onLoad", "onLoadCapture", "onError", "onErrorCapture", "onMouseDown", "onMouseDownCapture", "onMouseMove", "onMouseMoveCapture", "onMouseOut", "onMouseOutCapture", "onMouseOver", "onMouseOverCapture", "onMouseUp", "onMouseUpCapture", "onPaste", "onPasteCapture", "onReset", "onResetCapture", "onScroll", "onScrollCapture", "onSubmit", "onSubmitCapture", "onTouchCancel", "onTouchCancelCapture", "onTouchEnd", "onTouchEndCapture", "onTouchMove", "onTouchMoveCapture", "onTouchStart", "onTouchStartCapture", "onWheel", "onWheelCapture", "className"];
///////////////////////////////////////////////////////////////////////////////
// Export / Attach / Public

module.exports = mount;

if(typeof window.React === "object") 
  window.React.mount = mount;
if(typeof define === "function" && define.amd) 
  define(function(){return mount});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function getNodes(tags, context) {
  var keys = objectKeys(tags);
  var returns = [];

  // keys to uppercase to compare to nodeName
  for(var i=0; i<keys.length; i++) keys[i]=keys[i].toUpperCase();

  // if context is tag
  if(keys.indexOf(context.nodeName.toUpperCase()) >= 0) {
    return [context];
  };

  //Mount all top-level child tags within context
  var nodes, el, mount, n;
  for(var i=0; i<keys.length; i++) {
    nodes = context.getElementsByTagName(keys[i]);
    for(n=0; n<nodes.length; n++) {
      el = nodes[n];
      mount = true;
      while(el = el.parentNode) {
        if(keys.indexOf(el.nodeName.toUpperCase()) >= 0) {
          mount = false;
          break;
        }
        if(el === context) break;
      }
      if(mount) returns.push(nodes[n]);
    }
  }  
  return returns;
}

///////////////////////////////////////////////////////////////////////////////

function htmlToComponent(str, tags, opts) {
  var keys = objectKeys(tags);
  var props = opts.props || {};
  var preserveAttributes = opts.preserveAttributes || [];
  var tagAttributes = [];
  var reactTags={};
  var reactKeys=[];
  var key;
  for(var i = 0; i<keys.length; i++) {
    key = "AB"+Math.random().toString(36).substring(2);
    if(typeof tags[keys[i]] !== "function") {
      if(typeof tags[keys[i]].slice !== "function") continue;
      tagAttributes = tags[keys[i]].slice(0,-1);
      reactTags[key] = tags[keys[i]].slice(-1)[0];
    }
    else
      reactTags[key] = tags[keys[i]];

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
  var attributes = preserveReactAttributes.concat(preserveAttributes);
  for(var i=0; i<attributes.length; i++) 
    str = replaceAttribute(str, attributes[i], attributes[i]);
 
  var jsx = htmlToJsx(str);

  // replace props variables {key} with corrected variables {props['key']}
  for(var key in props) {
    jsx = jsx
      .replace(new RegExp("(\{"+key+"\})","g"),"{props['"+key+"']}");
  }
  
  var component = ReactTransform(jsx).code;
  
  // replace component variables (ComponentName) with corrected variables (tags['ComponentName'])
  for(var i=0; i<reactKeys.length; i++) {
    component = component
      .replace(new RegExp(reactKeys[i],"g"), "reactTags['"+reactKeys[i]+"']"); 
  }

  return eval(component);
}

///////////////////////////////////////////////////////////////////////////////
// html to jsx (More info: https://facebook.github.io/react/docs/tags-and-attributes.html)

function htmlToJsx(str){

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

function mount(tags, opts){
  opts = opts || {};
  var component, wrapper;

  // Get HTML nodes that need to be mounted.
  var nodes = getNodes(tags, opts.context || document.body);
  
  for(var i=0; i<nodes.length; i++) {

    // create component to be mounted
    component = htmlToComponent(nodes[i].outerHTML, tags, opts);

    // get wrapper to mount into
    wrapper = typeof opts.wrapper === "object" && typeof opts.wrapper.cloneNode === "function"?
      opts.wrapper.cloneNode(false):
      document.createElement('div');

    wrapper.className += wrapper.className ? " react-mount":"react-mount";

    // Replace tag with wrapper
    nodes[i].parentNode.replaceChild(wrapper, nodes[i]);

    // Render component into wrapper.
    React.render(component, wrapper);
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

})(
typeof module === "object" ? 
  module : {}, 
typeof require === "function" ? 
  require : 
  function (required){
    throw "react-mount: Error - React and JSXTransformer/react-tools are required for react-mount to work";
  },
window, 
document);