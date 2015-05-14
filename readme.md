# react-mount
React goes web component – Use custom tags to place react components directly in html.

[![npm version](https://badge.fury.io/js/react-mount.svg)](http://badge.fury.io/js/react-mount)
[![Bower version](https://badge.fury.io/bo/react-mount.svg)](http://badge.fury.io/bo/react-mount)

- [Install](#install)
- [Basic Usage](#basic-usage)
- [Tag Content](#tag-content)
- [Nested Components](#nested-components)
- [Expressions and Properties](#expressions-and-properties)
- [Case-Sensitive Attributes](#case-sensitive-attributes)
- [Html Comments](#html-comments)
- [API: mount( tags _[, opts]_ );](#api)
- [License](#license)


## Install

##### Download
From Github, [NPM](https://www.npmjs.org/package/react-mount):

```sh
$ npm install --save react-mount
```
 or [Bower](http://bower.io/search/?q=react-mount):
```sh
$ bower install react-mount
```

##### Include
With AMD or Browserify:
```js
var mount = require("react-mount");
```
Vanilla JS:
```html
<script src="path/to/file/react-mount.js"></script>
<script>
	var mount = React.mount;
</script>
```


## Basic Usage
```html
<body>
	<react-component />
	
	<!-- Dependencies -->
	<script src="react.js"></script>
	<script src="JSXTransformer.js"></script>
	<script src="react-mount.js"></script>

	<script>
		// React component
		var ReactComponent = React.createClass({
			render: function() {
				return React.createElement("i", null, "Component mounted. React is running.")
			}
		});
		
		// Mount component
		React.mount({
			"react-component" : ReactComponent
		});
	</script>
</body>
```
##### Output
_Component mounted. React is running._

## Tag Content
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
##### Output
HTML IS TRANSFORMED TO __JSX__ FOR YOU.</u>

## Nested Components
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
##### Output
_Component mounted. React is running._

## Expressions and Properties
`{expressions}` can be used within a tag and are executed properly.<br>
Within `{expressions}` properties from the global namespace `window` can be accessed.
However to keep the global namespace clear, properties can also be defined in the `opts` object passed to the `mount` function:
```js
window.paragraph = "Component mounted. React is running.";

React.mount({
	"translucent-component" : ReactComponent
},
{
	props : {
		list : [
			  "Item 1",
			  "Item 2",
			  "Item 3"
		],
		attribute : "myAttribute"
	}
});
```
These properties are avaliable within expressions as `props.key`:
```js
{window.paragraph} // "Component mounted. React is running."

{props.list.length <= 3 ? "Yes!" : "No!"} // Yes!

// shortcut for simple reference (props. is appended for you)
{attribute} 	// "myAttribute"

```
```html

<translucent-component attribute={attribute}>
	<p>{window.paragraph}</p>
	<p>Less than four list items? </b>{props.list.length <= 3 ? "Yes!" : "No!"}</b></p>
	<ul>
		{props.list.map(function(value, i){
			return <li key={i} >{value}</li>;
		})}
	</ul>
</translucent-component>
```
Within react component:<br>
`this.props.attribute === "myAttribute"`<br>
`this.props.children` contains `<p>...</p>`, `<p>...</p>` and `<ul>...</ul>`.
##### Output
Component mounted. React is running.

Less than four list items? __Yes!__

- Item 1
- Item 2
- Item 3

## Case-Sensitive Attributes
Html is case insensitiv and transforms everything outside of strings to lowercase. React `props` however are case sensitive and therefore some components require correctly capitalized attributes.

There are two ways to preserve the capitalization of attributes:

__A) Per component__
```js
mount({
	"react-component" : ["camelCaseAttribute", "anotherAttribute", ReactComponent]
});
```
__B) For all components__
```js
mount({
	"react-component" : ReactComponent
}, {
	preserveAttributes : ["camelCaseAttribute", "anotherAttribute"]
});
```
In both cases you can now savely use the preserved attributes:
```html
<react-component camelCaseAttribute="preserved attribute" notPreservedAttribute="not preserved" />
```
Within react component:<br>
`this.props.camelCaseAttribute === "preserved attribute"`<br>
__but__<br>
`this.props.notPreservedAttribute === undefined` <br>
`this.props.notpreservedattribute === "not preserved"`


## HTML Comments
Html comments do not affect the output of the rendering in any way.<br>
They can be used to mask unrendered content before react kicks in.
```html
<translucent-component>
	<!--
		<i>{paragraph}</i>
	-->
</translucent-component>
```
`this.props.children` still contains `<i>value</i>`.
##### Output
_value_

__Tipp:__ Use JSX style `{/* comments */}` for actual comments.

## API

### `mount(      tags      [, opts]      );`

##### tags `required`
> _Type_ `Object`
> 
> Object with _tags_ and their corresponding _components_ to be mounted.
> 
> ```js
> {
> 	"tag-name"	: 	ReactComponent,
> 	"tag-Name"	: 	ReactComponent,
>	...
> 	"TAG-NAME"	: 	["camelCaseAttribute", ReactComponent],
> 	...
> 	[tag]		: 	[component | Array]
> }
> ```
> Tag names are __case insensitive__. All the above definitions would do the same / the first component would be mounted to all of the tags.
>
> __Optional:__ Instead of a React component, an array with case-sensitive attributes can be defined. The last item of the array is the react component to be mounted. <br>
> See: [Case-Sensitive Attributes](#case-sensitive-attributes)
>
> __Tipp:__ Lower case tag names containing at least one dash are/will be valid html. <br>
> See: http://w3c.github.io/webcomponents/spec/custom/#concepts

##### opts `optional`
> _Type_ `Object`
>
> Available options for `react-mount`:
>
> ```js
> {
> 	"context"				: 	[HTMLElement],
> 	"props"					: 	{...},
> 	"preserveAttributes"	: 	[...],
> 	"wrapper"				: 	[HTMLElement]
> }
> ```
>
> ###### context
> > _Type_ `HTMLElement` <br>
> > _Default_ `document.body`
> > 
> > Only tags within this element will be mounted.
> 
> ###### props
> > _Type_ `Object`
> > 
> > `key:value` pairs of Properties.<br>
> > Properties can be used in `{expressions}` within the mounted tags.
> >
> > See: [Expressions and Properties](#expressions-and-properties)
>
> ###### preserveAttributes
> > _Type_ `Array`
> > 
> > Array of case-sensitive attributes to preserve capitatization.
> >
> > See: [Case-Sensitive Attributes](#case-sensitive-attributes)
>
> ###### wrapper
> > _Type_ `HTMLElement` <br>
> > _Default_ `document.createElement("div")`
> > 
> > Define a custom wrapper to mount react components into.

## License

[The MIT License (MIT)](http://opensource.org/licenses/MIT)

Copyright (c) 2015 Philipp Adrian, philippadrian.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
