#react-mount
Use custom tags to place your react components directly in html.

- [Install](#install)
- [Usage](#usage)
- [Tag Content](#tag-content)
- [Expressions and Properties](#expressions-and-properties)
- [Html Comments](#html-comments)
- [API: mount(…)](#api)


##Install

####Download
From Github or [npm](https://www.npmjs.org/package/react-mount) or

```sh
$ npm install --save react-mount
```

####Include
With AMD or Browserify:
```js
var mount = require("react-mount");
```
Vanilla:
```html
<script src="path/to/file/react-mount.js"></script>
```


##Usage
```html
<body>
	<react-component />
	
	<!-- Dependencies -->
	<script src="react.js"></script>
	<script src="JSXTransformer.js"></script>
	
	<!-- React component -->
	<script>
	    var ReactComponent = React.createClass({
	      render: function() {
	        return (
	        	<i>React is running.</i>
	        );
	      }
	    });
	</script>
 	
	<!-- Mount component -->
	<script>
		// Wait for JSXTransform: Not necessary with precompiled components
		window.addEventListener( "DOMContentLoaded", function(){ 
			
			React.mount({
				"react-component" : ReactComponent
			});
		
		});
	</script>
</body>
```
#####Output
_React is running._

##Tag content
You can write normal HTML or JSX in your custom tags.<br>
All children of your custom tag will be available in the mounted react component with `this.props.children`.

##Expressions and Properties
`{expressions}` can be used within a tag and are executed properly.
Properties to be used within expressions can be passed as optional last parameter to the `mount` function:
```js
React.mount({
	"react-component" : ReactComponent
},
{
	"key" : "value"
});
```
These properties are avaliable within expressions as `props.key`:
```js
{props.key} // "value"
{props.key === "value" ? "Yes" : "No"} // Yes

// shortcut for simple reference
{key} 	// "value"

```

##HTML Comments
Html comments do not affect the output of the rendering in any way.<br>
They can be used to mask unrendered content before react kicks in.
```html
<react-component>
	<!--
		<p>{key}</p>
	-->
</react-component>
```
`this.props.children` still contains `<p>value</p>`.

##API

### `mount(      [context,]      tags      [, props]      );`

####context `optional`
> _Type_ `HTMLElement` <br>
> _Default_ `document.body`
> 
> Only tags within this element will be mounted.


####tags `required`
> _Type_ `object`
> 
> Object with _tags_ and their corresponding _components_ to be mounted.
> 
> ```js
> {
> 	"tagname"	: 	ReactComponent,
> 	"tagName"	: 	ReactComponent,
> 	"TAGNAME"	: 	ReactComponent,
> 	...
> 	[tag]		: 	[component]
> }
> ```
> Tag names are __case insensitive__. All the above definitions would do the same / override each other.

####props `optional`
> _Type_ `object`
> 
> `key:value` pairs of Properties:
> ```js
> {
> 	"status"	: 	"React is running.",
> 	"flag"		: 	true
> 	...
> 	[key]		: 	[value]
> }
> ```
> 
> Properties can be used in `{expressions}` within the mounted tags:
> ```js
> {props.key}
> {props.status} 				// React is running.
> {props.flag ? "Yes" : "No"}	// Yes
> 
> // shortcut for simple reference
> {key} 	// React is running.
> {flag}	// true
> 
> ```
> See also: [Expressions and Properties](#expressions-and-properties)
