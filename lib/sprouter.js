var fs = require('fs'),
    path = require('path');

var SpRouter = module.exports = function SpRouter (app, options) {
    this._app = app || {},
        this._options = options || {},
        this.baseDir = '',
        this.routers = {};
    if (this.hasProp(this._options, 'auto') == true) {
        this.run();
    }
    if (this.hasProp(this._options, 'watch') == true) {
        this.watch();
    }

};

SpRouter.prototype.Exception = function(message){
    this.message = message;
    this.name = "SpRouterException";
};

SpRouter.prototype = {
    run: function () {
        if (this._options.hasOwnProperty('path')) {
            this.baseDir = this._options.path || '';
            var self = this;
            fs.lstat(this.baseDir, function (err, stat) {
                if (!err && stat.isDirectory()) {
                    fs.readdir(self.baseDir, function (err, files) {
                        if (!err && files.length > 0) {
                            for (var i = 0; i < files.length; i++) {
                                self.include(path.join(self.baseDir, files[i]));
                            }
                        } else {
                            throw new this.Exception("Path with routers is empty !");
                        }
                    });
                }
            });
        }
    },
    set: function (router) {
        if (router) {
            if (router.base) {
                var routes = router.routes;
                if (routes) {
                    for (var method in routes) {
                        switch (method) {
                            case 'get':
                                this.get(router,routes);
                                break;
                            case 'post':
                                this.post(router,routes);
                                break;
                            default :
                                this.get(router,routes);
                                break;
                        }
                    }
                }
            }
        }
    },
    /**
     *
     * @param router - Base router object
     */
    unset: function (router) {
        if (router) {
            if (router.base) {
                var routes = router.routes;
                if (routes) {
                    for (var method in routes) {
                        var actions = routes[method];
                        for (var action in actions) {
                            var name = actions[action];
                            var cb = router[name];
                            if (typeof  cb === 'function') {
                                if (this._app && 'function' === typeof this._app.del) {
                                    var appRoutes = method == "get" ? this._app.routes.get : this._app.routes.post;
                                    for (var key in appRoutes) {
                                        if( appRoutes[key].path == router.base + action){
                                            appRoutes.splice(key,1);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    /**
     *
     * @param router - Base router object
     * @param routes - Array of routes
     */
    get: function (router, routes) {
        var actions = routes['get'];
        for (var action in actions) {
            var name = actions[action];
            var cb = router[name];
            if (typeof  cb === 'function') {
                if (this._app && 'function' === typeof this._app.get) {
                    this._app.get(router.base + action, cb);
                }
            }
        }
    },
    /**
     *
     * @param router - Base router object
     * @param routes - Array of routes
     */
    post: function (router, routes) {
        var actions = routes['post'];
        for (var action in actions) {
            var name = actions[action];
            var cb = router[name];
            if (typeof  cb === 'function') {
                if (this._app && 'function' === typeof this._app.post) {
                    this._app.post(router.base + action, cb);
                }
            }
        }
    },

    include: function (routes_path) {
        try {
            var cache = require.cache[path.resolve(routes_path)];
            if (cache) delete require.cache[path.resolve(routes_path)];

            var router = require(path.resolve(routes_path));

            if (this.is_exist(routes_path)) {
                this.replaceRoute(routes_path, router);
            } else {
                this.routers[routes_path] = router;
                this.set(router);
            }

        } catch (e) {
            console.log("Error load router", e);
        }
    },

    watch: function () {
        this.baseDir = this._options.path || '';
        var self = this;
        fs.exists(this.baseDir, function (exist) {
            if (exist) {
                fs.watch(self.baseDir, function (event, filename) {
                    if (filename) {
                        fs.exists(path.join(self.baseDir, filename), function(exist){
                            if (exist) {
                                setTimeout(function() {
                                    self.include(path.join(self.baseDir, filename));
                                },300);
                            }
                        });
                    }
                });
            }
        });
    },

    is_exist: function (routes_path) {
        return this.routers[routes_path] ? true : false;
    },

    replaceRoute: function (routes_path, router) {
        var old = this.routers[routes_path];
        var _new = router;
        this.unset(old);
        this.set(_new);
        this.routers[routes_path] = _new;
    },

    hasProp: function(obj,name) {
        return obj.hasOwnProperty(name) ? obj[name] : undefined;
    }
};




