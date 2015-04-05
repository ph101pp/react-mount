#react-mount
Use your react components directly in HTML.

##Install

Download _react-mount_ from Github or [npm](https://www.npmjs.org/package/react-mount):

```sh
	$ npm install --save react-save
```

Include it into your project:

```js
	var mount = require("react-mount");
```
```html
	<script src="path/to/file/react-mount.js"></script>
```


##Usage

```html
	<body>
		<react-component />

		<script src="path/to/file/react-mount.js"></script>
		<script>

			var ReactComponent = React.createClass({
			  render: function() {
			    return React.createElement("p", null, React is running.);
			  }
			});

			mount({
				"react-component" : ReactComponent
			});
		</script>
	</bod>

```


