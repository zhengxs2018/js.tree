(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.jsTree = {}));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function isNil(value) {
        return value === undefined || value === null;
    }
    function defaultTo(value, defaultValue) {
        return isNil(value) ? defaultValue : value;
    }
    function get(object, path, defaultValue) {
        return defaultTo(object[path], defaultValue);
    }

    var ROOT_ID = '__root__';
    var ID_KEY = 'id';
    var PARENT_ID_KEY = 'parentId';
    var CHILDREN_KEY = 'children';

    function map(data, callback, childrenKey) {
        if (childrenKey === void 0) { childrenKey = CHILDREN_KEY; }
        function iter(data, parents) {
            return data.map(function (node, index) {
                var _a;
                var source = callback(__assign({}, node), index, parents);
                var children = iter(defaultTo(source[childrenKey], []), parents.concat(node));
                if (children.length > 0) {
                    return __assign(__assign({}, source), (_a = {}, _a[childrenKey] = children, _a));
                }
                return source;
            });
        }
        return iter(data, []);
    }

    function each(data, callback, childrenKey) {
        if (childrenKey === void 0) { childrenKey = CHILDREN_KEY; }
        function iter(data, parents) {
            var items = [];
            data.forEach(function (node, index) {
                if (callback(node, index, parents)) {
                    return;
                }
                iter(defaultTo(node[childrenKey], []), parents.concat(node));
            });
            return items;
        }
        return iter(data, []);
    }

    function filter(data, callback, childrenKey) {
        if (childrenKey === void 0) { childrenKey = CHILDREN_KEY; }
        function iter(data, parents) {
            var items = [];
            data.forEach(function (node, index) {
                var _a;
                if (callback(node, index, parents)) {
                    items.push(__assign({}, node));
                    return;
                }
                var children = iter(defaultTo(node[childrenKey], []), parents.concat(node));
                if (children.length > 0) {
                    items.push(__assign(__assign({}, node), (_a = {}, _a[childrenKey] = children, _a)));
                }
            });
            return items;
        }
        return iter(data, []);
    }

    function exclude(data, callback, childrenKey) {
        if (childrenKey === void 0) { childrenKey = CHILDREN_KEY; }
        function iter(data, parents) {
            var items = [];
            data.forEach(function (node, index) {
                var _a;
                if (callback(node, index, parents)) {
                    return;
                }
                var children = defaultTo(node[childrenKey], []);
                if (children.length === 0) {
                    items.push(node);
                    return;
                }
                var results = iter(children, parents.concat(node));
                if (results.length > 0) {
                    items.push(__assign(__assign({}, node), (_a = {}, _a[childrenKey] = results, _a)));
                }
            });
            return items;
        }
        return iter(data, []);
    }

    function isNotNil(value) {
        return isNil(value) === false;
    }
    function assert(value, message) {
        if (value)
            return;
        if (message instanceof Error) {
            throw message;
        }
        throw new Error(message);
    }
    function popKey(object, key, defaultValue) {
        var value = object[key];
        delete object[key];
        return defaultTo(value, defaultValue);
    }
    function exporter(nodes, root) {
        if (typeof root === 'function') {
            return root(nodes) || [];
        }
        return nodes[defaultTo(root, ROOT_ID)] || [];
    }

    function parse(data, options) {
        if (options === void 0) { options = {}; }
        var idKey = defaultTo(options.idKey, ID_KEY);
        var parentKey = defaultTo(options.parentKey, PARENT_ID_KEY);
        var childrenKey = defaultTo(options.childrenKey, CHILDREN_KEY);
        var transform = defaultTo(options.transform, function (x) { return x; });
        var insert = defaultTo(options.insert, function (siblings, node) { return siblings.push(node); });
        var nodes = {};
        var childNodes = {};
        data.forEach(function (row, i) {
            var id = get(row, idKey);
            assert(isNotNil(id), "id is required, in " + i + ".");
            var node = transform(row, i);
            if (isNil(node))
                return;
            var children = childNodes[id];
            if (children) {
                node[childrenKey] = children;
            }
            else {
                childNodes[id] = node[childrenKey] = [];
            }
            var parentId = defaultTo(get(row, parentKey), ROOT_ID);
            var siblings = childNodes[parentId];
            if (siblings) {
                insert(siblings, node);
            }
            else {
                insert((childNodes[parentId] = []), node);
            }
            nodes[id] = node;
        });
        return {
            idKey: idKey,
            parentKey: parentKey,
            childrenKey: childrenKey,
            nodes: nodes,
            childNodes: childNodes,
        };
    }

    function toTree(data, options) {
        if (options === void 0) { options = {}; }
        var childNodes = parse(data, options).childNodes;
        return exporter(childNodes, defaultTo(options.root, ROOT_ID));
    }

    function toRows(data, childrenKey) {
        if (childrenKey === void 0) { childrenKey = CHILDREN_KEY; }
        var result = [];
        function callback(source) {
            var target = __assign({}, source);
            var children = popKey(target, childrenKey, []);
            result.push(target);
            children.forEach(callback);
        }
        data.forEach(callback);
        return result;
    }

    var version = '0.2.0';

    exports.CHILDREN_KEY = CHILDREN_KEY;
    exports.ID_KEY = ID_KEY;
    exports.PARENT_ID_KEY = PARENT_ID_KEY;
    exports.ROOT_ID = ROOT_ID;
    exports.each = each;
    exports.exclude = exclude;
    exports.exporter = exporter;
    exports.filter = filter;
    exports.map = map;
    exports.parse = parse;
    exports.toRows = toRows;
    exports.toTree = toTree;
    exports.version = version;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
