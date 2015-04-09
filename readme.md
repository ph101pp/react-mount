# react-mount
Use custom tags to place react components directly in html.

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
From Github or [npm](https://www.npmjs.org/package/react-mount) or

```sh
$ npm install --save react-mount
```

##### Include
With AMD or Browserify:
```js
var mount = require("react-mount");
```
Vanilla:
```html
<script src="path/to/file/react-mount.js"></script>
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
`{expressions}` can be used within a tag and are executed properly.
Properties to be used within expressions can be passed as optional last parameter to the `mount` function:
```js
React.mount({
	"translucent-component" : ReactComponent
},
{
	paragraph : "Component mounted. React is running.",
	list : [
		  "Item 1",
		  "Item 2",
		  "Item 3"
	],
	attribute : "myAttribute"
});
```
These properties are avaliable within expressions as `props.key`:
```js
{props.paragraph} // "Component mounted. React is running."
{props.list.length <= 3 ? "Yes" : "No"} // Yes

// shortcut for simple reference
{paragraph} 	// "Component mounted. React is running."

```
```html

<translucent-component attribute={props.attribute}>
	<p>{paragraph}</p>
	<p>Less than four list items? </b>{props.list.length <= 3 ? "Yes" : "No"}</b></p>
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

Less than four list items? __Yes__

- Item 1
- Item 2
- Item 3

## Case-Sensitive Attributes

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
> Tag names are __case insensitive__. All the above definitions would do the same / the first component would be mounted to all of the tags.
>
> __Tipp:__ Lower case tag names containing at least one dash are/will be valid html. See: http://w3c.github.io/webcomponents/spec/custom/#concepts

##### opts `optional`
> _Type_ `object`
>
> Options and parameter for `react-mount`:
>
> ```js
> {
> 	"context"				: 	[HTMLElement],
> 	"props"					: 	{...}
> 	"preserveAttributes"	: 	[...]
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
> > _Type_ `object`
> > 
> > `key:value` pairs of Properties.<br>
> > Properties can be used in `{expressions}` within the mounted tags.
> >
> > See: [Expressions and Properties](#expressions-and-properties)

> ###### preserveAttributes
> > _Type_ `array`
> > 
> > Array of case-sensitive attribute names to preserve capitatization.
> >
> > See: [Case-Sensitive Attributes](#case-sensitive-attributes)

## License

[The MIT License (MIT)](http://opensource.org/licenses/MIT)

Copyright (c) 2015 Philipp Adrian, philippadrian.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
