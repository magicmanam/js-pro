﻿(function (pro) {
    'use strict';

    var unit = new pro.core();

    unit.to = function (view, vm) {
        let tree = pro.tree.new();

        tree.on('node', function (node) {
            if (node.is('pro')) {
                tree.once('end', function () {
                    vm.on(function (model) {
                        var modelKeys = '';

                        for (let key in model)
                            modelKeys += 'var ' + key + '=' + JSON.stringify(model[key]) + ';';

                        pro.mvvm.eval(node, modelKeys);
                    });
                });
            }
        });
        tree.depth([view]);
    };

    unit.eval = (function () {
        var node;

        function _show(value) {
            (value ? this.out : this.to).call(this, 'hidden');
        }
        function show(value) { _show.call(node, value); }
        function hide(value) { _show.call(node, !value); }

        function _each(list, viewFn) {
            this.toChildFree();
            //viewFn = viewFn || getBindFn(g.elem);
            list.forEach(function (item) {
                viewFn(item);
            });
        }
        function each() { return _each.apply(node, arguments); }
        function _view(name) {
            var parent = this;

            return function (model) {
                pro.view.out(name, model, function (node) {
                    parent.appendChild(node);
                });
            };
        }
        function view(name) { return _view.call(node, name); }

        return function (element, models) {
            node = element;
            eval(models + node.getAttribute('pro'));
        };
    })();

    pro.mvvm = unit;
})(pro);