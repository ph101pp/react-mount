#react-mount
Use custom tags to place react components directly in html.

- [Install](#install)
- [Usage](#usage)
- [Tag Content](#tag-content)
- [Nested Components](#nested-components)
- [Expressions and Properties](#expressions-and-properties)
- [Html Comments](#html-comments)
- [API: mount(…)](#api)


##Install

#####Download
From Github or [npm](https://www.npmjs.org/package/react-mount) or

```sh
$ npm install --save react-mount
```

#####Include
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
Content of custom tags can be written in Html or JSX.
```html
<translucent-component>
	<p style="text-transform: uppercase">
		Html is transformed to <span style="font-weight:bold">JSX</span> for you.
	</p>
</translucent-component>
```
The content of a custom tag is available in the mounted react component with `this.props.children`:
```js
var translucentComponent = React.createClass({
	render: function() {
		return (
			{this.props.children}
		);
	}
});
```
#####Output
HTML IS TRANSFORMED TO __JSX__ FOR YOU.</u>

##Nested Components
Custom component tags can be nested as long as all used components are properly mounted:
```html
<translucent-component>
	<react-component />
</translucent-component>
```
```js 
mount({
	"react-component"		:	ReactComponent,
	"translucent-component"	:	TranslucentComponent
});
```
#####Output
_React is running._
##Expressions and Properties
`{expressions}` can be used within a tag and are executed properly.
Properties to be used within expressions can be passed as optional last parameter to the `mount` function:
```js
React.mount({
	"translucent-component" : ReactComponent
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
```html
<translucent-component property={props.key}>
	<i>{key}</i>
	<b>{props.key === "value" ? "Yes" : "No"}</b>
</translucent-component>
```
Within react component:<br>
`this.props.property === "value"`<br>
`this.props.children` contains `<p>value</p>` and `<p>Yes</p>`.
#####Output
_value_ __Yes__


##HTML Comments
Html comments do not affect the output of the rendering in any way.<br>
They can be used to mask unrendered content before react kicks in.
```html
<translucent-component>
	<!--
		<i>{key}</i>
	-->
</translucent-component>
```
`this.props.children` still contains `<p>value</p>`.
#####Output
_value_
##API

### `mount(      [context,]      tags      [, props]      );`

#####context `optional`
> _Type_ `HTMLElement` <br>
> _Default_ `document.body`
> 
> Only tags within this element will be mounted.


#####tags `required`
> _Type_ `object`
> 
> Object with _tags_ and their corresponding _components_ to be mounted.
> 
> ```js
> {
> 	"tag-name"	: 	ReactComponent,
> 	"tag-Name"	: 	ReactComponent,
> 	"TAG-NAME"	: 	ReactComponent,
> 	...
> 	[tag]		: 	[component]
> }
> ```
> Tag names are __case insensitive__. All the above definitions would do the same / the first component would be mounted to all of the tags).
>
> __Tipp:__ All lower case tag names containing at least one dash are valid html.

#####props `optional`
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
