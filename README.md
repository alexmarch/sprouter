SpRouter
========

Simple dynamic routing for expressjs can help you create any type of routing with ability editing routings and handlers in real time !

## Installation

via npm:

```bash
$ npm install sprouter
```
------

## Using

After installation SpRouter can be created with constructor:

##### Constructor:
```javascript
    SpRouter(express_app, {path: String, auto: Boolean, watch: Boolean});
```
#### Example

```javascript
...
var SpRouter = require('sprouter');
var Router = new SpRouter(app, {path: './routes', auto: true, watch: true});
...
```

Where app is a instance of express
```javascript
var app = express();
```
path - Path to the directory with routing files
auto - Autorun routing default true
watch - Watch change of routing and rebuild route path default true