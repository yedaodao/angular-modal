(function (root, init) {
    if (typeof define === 'function' && defined.amd) {
        define(['angular'], init);
    } else if (root.angular) {
        init(root.angular);
    }
}(this, function (angular) {
    var module = angular.module('angularModal', []),
        $ = angular.element;
    module.provider('stack', function () {
        this.$get = [function () {
            var stack = [];

            return {
                add: function (key, value) {
                    stack.push({
                        key: key,
                        value: value
                    });
                },
                get: function (key) {
                    for (var i = 0; i < stack.length; i++) {
                        if (key == stack[i].key) {
                            return stack[i];
                        }
                    }
                },
                keys: function () {
                    var keys = [];
                    for (var i = 0; i < stack.length; i++) {
                        keys.push(stack[i].key);
                    }
                    return keys;
                },
                top: function () {
                    return stack[stack.length - 1];
                },
                remove: function (key) {
                    var idx = -1;
                    for (var i = 0; i < stack.length; i++) {
                        if (key == stack[i].key) {
                            idx = i;
                            break;
                        }
                    }
                    return stack.splice(idx, 1)[0];
                },
                removeTop: function () {
                    return stack.splice(stack.length - 1, 1)[0];
                },
                length: function () {
                    return stack.length;
                },
                openedLength: function () {
                    var length = 0;
                    for (var i = 0; i < stack.length; i++) {
                        if (true == stack[i].value.modalScope.display) {
                            length++;
                        }
                    }
                    return length;
                }
            };
        }];
    });

    module.provider('angularModal', function () {
        this.$get = ['$window', '$document', '$templateCache', '$compile', '$q', '$http', '$rootScope', 'stack', '$controller',
            function ($window, $document, $templateCache, $compile, $q, $http, $rootScope, stack, $controller) {
                var body = $document.find('body'),
                    diffX = 0,
                    diffY = 0;
                /**
                 * 生成uuid
                 * @returns {string}
                 */
                function uuid() {
                    var s = [];
                    var hexDigits = "0123456789abcdef";
                    for (var i = 0; i < 36; i++) {
                        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                    }
                    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
                    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
                    s[8] = s[13] = s[18] = s[23] = "-";

                    var uuid = s.join("");
                    return uuid;
                }

                /**
                 * 加载html模板
                 * @param url
                 * @param config
                 * @returns {*}
                 */
                function loadTemplateUrl(url, config) {
                    $rootScope.$broadcast('modal.tmplLoading.event');
                    return $http.get(url, (config || {})).then(function (res) {
                        $rootScope.$broadcast('modal.tmplLoaded.event');
                        return res.data || '';
                    });
                }

                /**
                 * 注入controller
                 * @param ctrlName
                 * @returns {{instance: *, modalScope: (*|Object)}}
                 */
                function createCtrlInstance(ctrlName) {
                    var ctrlLocals = {};
                    ctrlLocals.$scope = $rootScope.$new();
                    ctrlLocals.$scope.display = false;
                    var instance = $controller(ctrlName, ctrlLocals);

                    return {
                        instance: instance,
                        modalScope: ctrlLocals.$scope
                    }
                }

                //模态框背景
                var bgEl = $('<div class="angular-modal-bg"></div>'),
                    bgDomEl = $compile(bgEl)($rootScope);
                body.append(bgDomEl);
                bgDomEl.bind('click', function () {
                    var keys = stack.keys(),
                        i = 0;
                    for (i; i < keys.length; i++) {
                        var obj = stack.get(keys[i]),
                            scope = obj.value.modalScope,
                            element = obj.value.element;
                        if (element[0].style['z-index'] == 3000 && scope.display) {
                            close(keys[i]);
                            scope.$apply();
                            return;
                        }
                    }
                    i = keys.length - 1;
                    for (i; i >= 0; i--) {
                        var obj = stack.get(keys[i]);
                        if (obj.value.modalScope.display) {
                            close(keys[i]);
                            scope.$apply();
                            return;
                        } else {
                            continue;
                        }
                    }
                });

                /**
                 * 初始化模态框层级为2000
                 */
                function changeLayerIndex() {
                    var keys = stack.keys(),
                        i = 0;
                    for (i; i < keys.length; i++) {
                        var obj = stack.get(keys[i]);
                        var element = obj.value.element;
                        element[0].style['z-index'] = 2000;
                    }
                }

                /**
                 * 绑定鼠标拖动事件
                 * @param modalDomEl
                 */
                function bindMouseEvent(modalDomEl) {
                    modalDomEl.bind('mousedown', function (event) {
                        var key = modalDomEl.attr('id'),
                            obj = stack.get(key);
                        //初始化模态框层级为2000
                        changeLayerIndex();
                        //置顶当前激活模态框
                        obj.value.element[0].style['z-index'] = 3000;
                        obj.mousedown = true;
                        diffX = event.clientX - modalDomEl[0].offsetLeft;
                        diffY = event.clientY - modalDomEl[0].offsetTop;
                    });

                    modalDomEl.bind('mousemove', function (event) {
                        var key = modalDomEl.attr('id'),
                            obj = stack.get(key);
                        if (obj.mousedown) {
                            modalDomEl[0].style.left = (event.clientX - diffX) + 'px';
                            modalDomEl[0].style.top = (event.clientY - diffY) + 'px';
                        }
                    });

                    modalDomEl.bind('mouseup', function () {
                        var key = modalDomEl.attr('id'),
                            obj = stack.get(key);
                        obj.mousedown = false;
                        diffX = 0;
                        diffY = 0;
                    });
                }

                /**
                 * 初始化模态框
                 * @param opts
                 * @returns {*}
                 */
                function init(opts) {
                    var initDefered = $q.defer();
                    var options = {
                        position: 'center',
                        scope: {},
                        width: 600,
                        theme: 'default-theme',
                        template: '',
                        templateUrl: 'angular-modal-basic.html',
                        controller: 'modalController',
                        overlay: true,
                        closeAndDestroy: true,
                        removable: false
                    };
                    angular.extend(options, opts);
                    //加载模板
                    if(options.template == ''){
                        loadTemplateUrl(options.templateUrl).then(function (result) {
                            var obj = initAction(result, options);
                            angular.extend(obj.modalScope, options.scope);
                            initDefered.resolve(obj);
                        });
                    }else{
                        var obj = initAction(options.template, options);
                        angular.extend(obj.modalScope, options.scope);
                        initDefered.resolve(obj);
                    }
                    return initDefered.promise;
                }

                function initAction(result, options) {
                    var top = 30;
                    if(options.position == 'center'){
                        //top = body[0].clientHeight / 2 - options.width / 2;
                    }
                    var left = body[0].clientWidth / 2 - options.width / 2;
                    var uid = uuid(),
                        instanceObj = createCtrlInstance(options.controller),
                        modalEl = $('<div style="top:' + ((stack.openedLength() + 1) * top) + 'px;left:' + left + 'px" id="' + uid + '" class="angular-modal ' + options.theme + '" ng-class="{open:display}">' + result + '</div>'),
                        modalDomEl = $compile(modalEl)(instanceObj.modalScope);

                    modalDomEl[0].style.width = options.width + 'px';
                    body.append(modalDomEl);

                    if (options.removable) {
                        modalDomEl.addClass('can-remove');
                        bindMouseEvent(modalDomEl);
                    }
                    var obj = {
                        closeAndDestroy: options.closeAndDestroy,
                        modalScope: instanceObj.modalScope,
                        controller: instanceObj.instance,
                        key: uid,
                        element: modalDomEl
                    };
                    stack.add(uid, obj);
                    obj.modalScope.close = close;
                    obj.modalScope.open = open;
                    obj.modalScope.destroy = destroy;
                    obj.modalScope.key = uid;
                    return obj;
                }

                /**
                 * 模态框显示
                 */
                function open(key) {
                    setTimeout(function () {
                        bgDomEl.addClass('open');
                        var obj = stack.get(key),
                            scope = obj.value.modalScope;
                        scope.$broadcast('modal.open.start.event');
                        scope.display = true;
                        scope.$apply();
                        setTimeout(function () {
                            scope.$broadcast('modal.open.end.event');
                        }, 300);
                    }, 10);
                }

                /**
                 * 模态框关闭
                 * @param key
                 */
                function close(key) {
                    var obj = stack.get(key);
                    if (obj.value.closeAndDestroy) {
                        destroy(key);
                    } else {
                        closeAction(obj);
                    }
                }

                /**
                 * 关闭所有模态框
                 */
                function closeAll() {
                    var keys = stack.keys();
                    $rootScope.$broadcast('modal.closeAll.start.event');
                    var i = 0;
                    for (i; i < keys.length; i++) {
                        var obj = stack.get(keys[i]);
                        if (obj.value.closeAndDestroy) {
                            destroy(keys[i]);
                        } else {
                            closeAction(obj);
                        }

                    }
                    setTimeout(function () {
                        $rootScope.$broadcast('modal.closeAll.end.event');
                    }, 300);
                }

                function closeAction(obj) {
                    obj.value.modalScope.$broadcast('modal.close.start.event');
                    obj.value.modalScope.display = false;
                    if (stack.openedLength() <= 0) {
                        bgDomEl.removeClass('open');
                    }
                    setTimeout(function () {
                        obj.value.modalScope.$broadcast('modal.close.end.event');
                    }, 300);
                }

                /**
                 * 销毁模态框
                 * @param key
                 */
                function destroy(key) {
                    var obj = stack.get(key),
                        scope = obj.value.modalScope;
                    if (scope.display) {
                        closeAction(obj);
                        setTimeout(function () {
                            scope.$broadcast('modal.destroy.event');
                            destroyAction(obj);
                        }, 300);
                    } else {
                        scope.$broadcast('modal.destroy.event');
                        destroyAction(obj);
                    }
                }

                function destroyAction(obj) {
                    obj.value.element.unbind();
                    obj.value.element.remove();
                    obj.value.modalScope.$destroy();
                    stack.remove(obj.key);
                }

                /**
                 * 销毁所有模态框
                 */
                function destroyAll() {
                    var keys = stack.keys();
                    setTimeout(function () {
                        var i = 0;
                        for (i; i < keys.length; i++) {
                            var obj = stack.get(keys[i]);
                            if (obj.value.modalScope.display) {
                                closeAction(obj);
                                setTimeout(function () {
                                    destroyAction(obj);
                                }, 300);
                            }
                        }
                        $rootScope.$broadcast('modal.destroy.all.event');
                    }, 10);
                }

                return {
                    init: init,
                    open: open,
                    close: close,
                    closeAll: closeAll,
                    destroy: destroy,
                    destroyAll: destroyAll
                }
            }
        ];
    });
}));