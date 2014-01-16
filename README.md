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
{path: './routes', auto: true, watch: true}

path - Path to the directory with routing files

auto - Autorun routing default true

watch - Watch change of routing and rebuild route path default true

### Routing structure

###### Directory structure
    /routers
        |-index.js

```javascript

var router = {

    base: '/',

    routes:{
        'get':{
            'index': 'index',
            'hello/:params': 'hello'
        },
        'post':{
            'signin/': 'signin'
        }
    },

    index: function(req,res){
        res.send("Welcome SpRouter !");
    },

    hello: function(req,res){
        res.send("Hello :" + req.params.params);
    },

    //post
    signin: function(req,res){
        //write code here
    }

};

module.exports = router;

```

