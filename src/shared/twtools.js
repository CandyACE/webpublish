/**
     * @exports defined
     *
     * @param {*} value 对象.
     * @returns {Boolean} 如果定义了对象，则返回true，否则返回false。
     *
     * @example
     * if (twtools.defined(positions)) {
     *      doSomething();
     * } else {
     *      doSomethingElse();
     * }
     */
    function defined(value) {
        return value !== undefined && value !== null;
    }

/**
 * 构造由于开发人员错误而引发的异常对象，例如无效参数、参数超出范围等。此异常应仅在开发期间引发；它通常表示调用代码中存在错误。永远不应该捕获此异常；相反，调用代码应该尽量不生成它。
 * <br /><br />
 * 另一方面，{@link RuntimeError} 表示在运行时可能抛出的异常，例如内存不足，调用代码应该准备好捕获该异常。
 *
 * @alias DeveloperError
 * @constructor
 * @extends Error
 *
 * @param {String} [message] 此异常的错误消息。
 *
 * @see RuntimeError
 */
function DeveloperError(message) {
    /**
     * 'DeveloperError' 表示此异常是由于开发人员错误引发的。
     * @type {String}
     * @readonly
     */
    this.name = 'DeveloperError';

    /**
     * 解释为什么抛出异常。
     * @type {String}
     * @readonly
     */
    this.message = message;

    //Browsers such as IE don't have a stack property until you actually throw the error.
    var stack;
    try {
        throw new Error();
    } catch (e) {
        stack = e.stack;
    }

    /**
     * 此异常的堆栈跟踪，如果可用的话。
     * @type {String}
     * @readonly
     */
    this.stack = stack;
}

if (defined(Object.create)) {
    DeveloperError.prototype = Object.create(Error.prototype);
    DeveloperError.prototype.constructor = DeveloperError;
}

DeveloperError.prototype.toString = function () {
    var str = this.name + ': ' + this.message;

    if (defined(this.stack)) {
        str += '\n' + this.stack.toString();
    }

    return str;
};

/**
 * @private
 */
DeveloperError.throwInstantiationError = function () {
    throw new DeveloperError('This function defines an interface and should not be called directly.');
};

/**
 * Contains functions for checking that supplied arguments are of a specified type
 * or meet specified conditions
 * @private
 */
var Check = {};

/**
 * Contains type checking functions, all using the typeof operator
 */
Check.typeOf = {};

function getUndefinedErrorMessage(name) {
    return name + ' is required, actual value was undefined';
}

function getFailedTypeErrorMessage(actual, expected, name) {
    return 'Expected ' + name + ' to be typeof ' + expected + ', actual typeof was ' + actual;
}

/**
 * Throws if test is not defined
 *
 * @param {String} name The name of the variable being tested
 * @param {*} test The value that is to be checked
 * @exception {DeveloperError} test must be defined
 */
Check.defined = function (name, test) {
    if (!defined(test)) {
        throw new DeveloperError(getUndefinedErrorMessage(name));
    }
};

/**
 * Throws if test is not typeof 'function'
 *
 * @param {String} name The name of the variable being tested
 * @param {*} test The value to test
 * @exception {DeveloperError} test must be typeof 'function'
 */
Check.typeOf.func = function (name, test) {
    if (typeof test !== 'function') {
        throw new DeveloperError(getFailedTypeErrorMessage(typeof test, 'function', name));
    }
};

/**
 * Throws if test is not typeof 'string'
 *
 * @param {String} name The name of the variable being tested
 * @param {*} test The value to test
 * @exception {DeveloperError} test must be typeof 'string'
 */
Check.typeOf.string = function (name, test) {
    if (typeof test !== 'string') {
        throw new DeveloperError(getFailedTypeErrorMessage(typeof test, 'string', name));
    }
};

/**
 * Throws if test is not typeof 'number'
 *
 * @param {String} name The name of the variable being tested
 * @param {*} test The value to test
 * @exception {DeveloperError} test must be typeof 'number'
 */
Check.typeOf.number = function (name, test) {
    if (typeof test !== 'number') {
        throw new DeveloperError(getFailedTypeErrorMessage(typeof test, 'number', name));
    }
};

/**
 * Throws if test is not typeof 'number' and less than limit
 *
 * @param {String} name The name of the variable being tested
 * @param {*} test The value to test
 * @param {Number} limit The limit value to compare against
 * @exception {DeveloperError} test must be typeof 'number' and less than limit
 */
Check.typeOf.number.lessThan = function (name, test, limit) {
    Check.typeOf.number(name, test);
    if (test >= limit) {
        throw new DeveloperError('Expected ' + name + ' to be less than ' + limit + ', actual value was ' + test);
    }
};

/**
 * Throws if test is not typeof 'number' and less than or equal to limit
 *
 * @param {String} name The name of the variable being tested
 * @param {*} test The value to test
 * @param {Number} limit The limit value to compare against
 * @exception {DeveloperError} test must be typeof 'number' and less than or equal to limit
 */
Check.typeOf.number.lessThanOrEquals = function (name, test, limit) {
    Check.typeOf.number(name, test);
    if (test > limit) {
        throw new DeveloperError('Expected ' + name + ' to be less than or equal to ' + limit + ', actual value was ' + test);
    }
};

/**
 * Throws if test is not typeof 'number' and greater than limit
 *
 * @param {String} name The name of the variable being tested
 * @param {*} test The value to test
 * @param {Number} limit The limit value to compare against
 * @exception {DeveloperError} test must be typeof 'number' and greater than limit
 */
Check.typeOf.number.greaterThan = function (name, test, limit) {
    Check.typeOf.number(name, test);
    if (test <= limit) {
        throw new DeveloperError('Expected ' + name + ' to be greater than ' + limit + ', actual value was ' + test);
    }
};

/**
 * Throws if test is not typeof 'number' and greater than or equal to limit
 *
 * @param {String} name The name of the variable being tested
 * @param {*} test The value to test
 * @param {Number} limit The limit value to compare against
 * @exception {DeveloperError} test must be typeof 'number' and greater than or equal to limit
 */
Check.typeOf.number.greaterThanOrEquals = function (name, test, limit) {
    Check.typeOf.number(name, test);
    if (test < limit) {
        throw new DeveloperError('Expected ' + name + ' to be greater than or equal to' + limit + ', actual value was ' + test);
    }
};

/**
 * Throws if test is not typeof 'object'
 *
 * @param {String} name The name of the variable being tested
 * @param {*} test The value to test
 * @exception {DeveloperError} test must be typeof 'object'
 */
Check.typeOf.object = function (name, test) {
    if (typeof test !== 'object') {
        throw new DeveloperError(getFailedTypeErrorMessage(typeof test, 'object', name));
    }
};

/**
 * Throws if test is not typeof 'boolean'
 *
 * @param {String} name The name of the variable being tested
 * @param {*} test The value to test
 * @exception {DeveloperError} test must be typeof 'boolean'
 */
Check.typeOf.bool = function (name, test) {
    if (typeof test !== 'boolean') {
        throw new DeveloperError(getFailedTypeErrorMessage(typeof test, 'boolean', name));
    }
};

/**
 * Throws if test1 and test2 is not typeof 'number' and not equal in value
 *
 * @param {String} name1 The name of the first variable being tested
 * @param {String} name2 The name of the second variable being tested against
 * @param {*} test1 The value to test
 * @param {*} test2 The value to test against
 * @exception {DeveloperError} test1 and test2 should be type of 'number' and be equal in value
 */
Check.typeOf.number.equals = function (name1, name2, test1, test2) {
    Check.typeOf.number(name1, test1);
    Check.typeOf.number(name2, test2);
    if (test1 !== test2) {
        throw new DeveloperError(name1 + ' must be equal to ' + name2 + ', the actual values are ' + test1 + ' and ' + test2);
    }
};

/**
 * 冻结对象，使用对象冻结如果可用，则返回未更改的对象。此函数应在安装程序代码中使用，以防止错误完全停止旧版浏览器中的JavaScript执行。
 *
 * @private
 *
 * @export freezeObject
 *
 */
var freezeObject = Object.freeze;
if (!defined(freezeObject)){
    freezeObject = function (o) {
        return o;
    };
}

var freezeObject$1 = freezeObject;

/**
 * 如果未定义，则返回第一个参数，否则返回第二个参数。
 * 对于设置参数的默认值很有用。
 *
 * @exports defaultValue
 *
 * @param {*} a
 * @param {*|Function} b 对象或者Function，如果是Funcation，则需要返回一个
 * @returns {*} 如果未定义，则返回第一个参数，否则返回第二个参数。
 *
 * @example
 * param = twtools.defaultValue(param, 'default');
 */
function defaultValue(a, b) {
    if (a !== undefined && a !== null) {
        return a;
    }
    if (b instanceof Function) {
        return b();
    }
    return b;
}

defaultValue.EMPTY_OBJECT = freezeObject$1({});

/**
 * @function
 * @export clone
 * 克隆一个对象，返回一个包含相同属性的新对象。
 * @param object 要克隆的对象。
 * @param [deep] 如果为true，则将递归深度克隆所有属性。
 * @returns {*} 克隆的对象。
 */
function clone(object, deep) {
    if (object === null || typeof object !== 'object') {
        return object;
    }

    deep = defaultValue(deep, false);

    var result = new object.constructor();
    for (var propertyName in object) {
        if (object.hasOwnProperty(propertyName)) {
            var value = object[propertyName];
            if (deep) {
                value = clone(value, deep);
            }
            result[propertyName] = value;
        }
    }

    return result;
}

var definePropertyWorks = (function() {
        try {
            return 'x' in Object.defineProperty({}, 'x', {});
        } catch (e) {
            return false;
        }
    })();

    /**
     * Defines properties on an object, using Object.defineProperties if available,
     * otherwise returns the object unchanged.  This function should be used in
     * setup code to prevent errors from completely halting JavaScript execution
     * in legacy browsers.
     *
     * @private
     *
     * @exports defineProperties
     */
    var defineProperties = Object.defineProperties;
    if (!definePropertyWorks || !defined(defineProperties)) {
        defineProperties = function(o) {
            return o;
        };
    }
var defineProperty = defineProperties;

function returnTrue() {
    return true;
}

/**
 * 销毁对象。对象的每个功能，包括其原型中的功能，
 * 被抛出 DeveloperError 的函数所代替，但对象的 <code>isDestroyed</code> 函数，
 * 该函数设置为返回 <code>true</code> 的函数。使用 <code>delete</code> 删除对象的属性。
 * <br /><br />
 * 拥有本机资源（例如WebGL资源）的对象使用此功能，需要明确发布。客户代码调用对象的 <code>destroy</code> 函数，然后释放本机资源并调用 <code>destroyObject</code> 放置自身处于破坏状态。
 *
 * @exports destroyObject
 *
 * @param {Object} object 要摧毁的物体。
 * @param {String} [message] 包含在异常中的消息，如果被破坏的对象的函数被调用。
 *
 *
 * @example
 * // How a texture would destroy itself.
 * this.destroy = function () {
 *     _gl.deleteTexture(_texture);
 *     return twtools.destroyObject(this);
 * };
 *
 * @see DeveloperError
 */
function destroyObject(object, message) {
    message = defaultValue(message, 'This object was destroyed, i.e., destroy() was called.');

    function throwOnDestroyed() {
        //>>includeStart('debug', pragmas.debug);
        throw new DeveloperError(message);
        //>>includeEnd('debug');
    }

    for (var key in object) {
        if (typeof object[key] === 'function') {
            object[key] = throwOnDestroyed;
        }
    }

    object.isDestroyed = returnTrue;

    return undefined;
}

/**
 * A generic utility class for managing subscribers for a particular event.
 * This class is usually instantiated inside of a container class and
 * exposed as a property for others to subscribe to.
 *
 * @alias Event
 * @constructor
 * @example
 * MyObject.prototype.myListener = function(arg1, arg2) {
 *     this.myArg1Copy = arg1;
 *     this.myArg2Copy = arg2;
 * }
 *
 * var myObjectInstance = new MyObject();
 * var evt = new twtools.Event();
 * evt.addEventListener(MyObject.prototype.myListener, myObjectInstance);
 * evt.raiseEvent('1', '2');
 * evt.removeEventListener(MyObject.prototype.myListener);
 */
function Event() {
    this._listeners = [];
    this._scopes = [];
    this._toRemove = [];
    this._insideRaiseEvent = false;
}

defineProperty(Event.prototype, {
    /**
     * The number of listeners currently subscribed to the event.
     * @memberof Event.prototype
     * @type {Number}
     * @readonly
     */
    numberOfListeners: {
        get: function () {
            return this._listeners.length - this._toRemove.length;
        }
    }
});

/**
 * Registers a callback function to be executed whenever the event is raised.
 * An optional scope can be provided to serve as the <code>this</code> pointer
 * in which the function will execute.
 *
 * @param {Function} listener The function to be executed when the event is raised.
 * @param {Object} [scope] An optional object scope to serve as the <code>this</code>
 *        pointer in which the listener function will execute.
 * @returns {Event~RemoveCallback} A function that will remove this event listener when invoked.
 *
 * @see Event#raiseEvent
 * @see Event#removeEventListener
 */
Event.prototype.addEventListener = function (listener, scope) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.func('listener', listener);
    //>>includeEnd('debug');

    this._listeners.push(listener);
    this._scopes.push(scope);

    var event = this;
    return function () {
        event.removeEventListener(listener, scope);
    };
};

/**
 * Unregisters a previously registered callback.
 *
 * @param {Function} listener The function to be unregistered.
 * @param {Object} [scope] The scope that was originally passed to addEventListener.
 * @returns {Boolean} <code>true</code> if the listener was removed; <code>false</code> if the listener and scope are not registered with the event.
 *
 * @see Event#addEventListener
 * @see Event#raiseEvent
 */
Event.prototype.removeEventListener = function (listener, scope) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.func('listener', listener);
    //>>includeEnd('debug');

    var listeners = this._listeners;
    var scopes = this._scopes;

    var index = -1;
    for (var i = 0; i < listeners.length; i++) {
        if (listeners[i] === listener && scopes[i] === scope) {
            index = i;
            break;
        }
    }

    if (index !== -1) {
        if (this._insideRaiseEvent) {
            //In order to allow removing an event subscription from within
            //a callback, we don't actually remove the items here.  Instead
            //remember the index they are at and undefined their value.
            this._toRemove.push(index);
            listeners[index] = undefined;
            scopes[index] = undefined;
        } else {
            listeners.splice(index, 1);
            scopes.splice(index, 1);
        }
        return true;
    }

    return false;
};

function compareNumber(a, b) {
    return b - a;
}

/**
 * Raises the event by calling each registered listener with all supplied arguments.
 *
 * @param {*} arguments This method takes any number of parameters and passes them through to the listener functions.
 *
 * @see Event#addEventListener
 * @see Event#removeEventListener
 */
Event.prototype.raiseEvent = function () {
    this._insideRaiseEvent = true;

    var i;
    var listeners = this._listeners;
    var scopes = this._scopes;
    var length = listeners.length;

    for (i = 0; i < length; i++) {
        var listener = listeners[i];
        if (defined(listener)) {
            listeners[i].apply(scopes[i], arguments);
        }
    }

    //Actually remove items removed in removeEventListener.
    var toRemove = this._toRemove;
    length = toRemove.length;
    if (length > 0) {
        toRemove.sort(compareNumber);
        for (i = 0; i < length; i++) {
            var index = toRemove[i];
            listeners.splice(index, 1);
            scopes.splice(index, 1);
        }
        toRemove.length = 0;
    }

    this._insideRaiseEvent = false;
};

/**
 * 安全获取对象中深度的值
 * @exports getter
 * @param {Object} from 对象
 * @param {Array} selectors 深度值
 * @returns {Array} 值
 */
var getter = (from, ...selectors) => [...selectors].map(s =>
    s
        .replace(/\[([^\[\]]*)\]/g, '.$1.')
        .split('.')
        .filter(t => t !== "")
        .reduce((prev, cur) => prev && prev[cur], from)
);

/**
 * 安全获取对象中深度的值
 * @exports get
 * @param {Object} from 对象
 * @param {Array} selectors 选择的
 * @param {Object} defaultValue 默认值
 * @returns {*}
 *
 * @example
 * var data = {
 *     id:'001',
 *     nodes:[{
 *         name:'node1'
 *     }]
 * }
 *
 * twtools.get(data, 'id'); // '001'
 * twtools.get(data, 'nodes'); // [{name:'node1'}]
 * twtools.get(data, 'nodes[0].name'); // 'node1'
 * twtools.get(data, 'nodes[1]'); // undefined
 * twtools.get(data, 'nodes[1]', '005'); // '005'
 *
 * var data2 = [{
 *     id:'001'
 * }]
 *
 * twtools.get(data1, '[0]'); // '001'
 */
var get = function (from, selectors, defaultValue) {
    var res = this.getter(from, selectors)[0];
    return this.defaultValue(res, defaultValue);
};

var get$1 = {get, getter};

/**
 * @exports guid
 * 在浏览器中生成 UUID。
 * <br/>
 * 使用 API 生成符合RFC4122版本 4 的 UUID。
 * @returns {String} UUID
 * @example
 * twtools.guid(); // '7982fcfe-5721-4632-bede-6000885be57d'
 */
var guid = () =>
    ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
    );

class HTML {

    /**
     * 加载JS文件
     * @param {string} filePath JS文件的路径
     */
    static loadJS(filePath) {
        let script = document.createElement("script");
        script.type = "text/javascript";
        script.src = filePath;
        document.getElementsByTagName('head')[0].appendChild(script);
        return script;
    }

    /**
     * 加载CSS文件
     * @param {string} filePath CSS文件的路径
     */
    static loadCSS(filePath) {
        let link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = filePath;
        this.dom.getElementsByTagName('head')[0].appendChild(link);
        return link;
    }
}

/**
 * 常用方法
 * @exports Utils
 */
var Utils = {
    /**
     * 序列化json，支持序列化Function
     * @param {Object} obj 序列化的对象
     * @returns {String} 序列化的字符串
     */
    JSONStringifyWithFun: function (obj) {
        return JSON.stringify(obj, function (key, val) {
            if (typeof val == "function") {
                return val + '';
            }
            return val;
        }, 2)
    },
    /**
     * 反序列化为对象，支持反序列化Function
     * @param {String} string 要序列化的字符串
     * @return {Object} 返回的对象
     */
    JSONParseWithFun: function (string) {
        return JSON.parse(string, function (k, v) {
            if (v.indexOf && v.indexOf('function') > -1) {
                return eval("(function(){return " + v + " })()")
            }
            return v;
        })
    },
    /**
    * 计时器，使用setTimeout防止重复触发
    * @param {Function} fn 触发的方法
    * @param {Number} millisec 触发的时间
    * @param {Number} count 重试次数
    */
    updateInterval: function (fn, millisec, count) {
        function interval() {
            if (typeof count === "undefined" || --count > 0) {
                setTimeout(interval, millisec);
                try {
                    fn();
                } catch (e) {
                    count = 0;
                    throw e.toString();
                }
            }
        }

        setTimeout(interval, millisec);
    },
    /**
     * 根据ID获取元素对象
     * @param {*} obj id
     * @param {*} parent 父元素 
     */
    getByElement: function (obj, parent) {
        if (!defined(parent)) {
            parent = document;
        }
        var num = obj.substr(0, 1);
        var res = [];
        if (num != '#') {
            if (num == '.') {
                obj = obj.substr(1, obj.length);
            }
            if (parent.getElementsByClassName) {
                res = parent.getElementsByClassName(obj);
            } else {
                var reg = new RegExp(' ' + obj + ' ', 'i');
                var ele = parent.getElementsByTagName('*');
                for (var i = 0; i < ele.length; i++) {
                    if (reg.test(' ' + ele[i].className + ' ')) {
                        res.push(ele[i]);
                    }
                }
            }
            if (res.length > 0) {
                return res[0];
            } else {
                return res;
            }
        } else {
            if (num == '#') {
                obj = obj.substr(1, obj.length);
            }
            return document.getElementById(obj);
        }
    },
    /**
     * 修改样式或获取指定样式的值，
     * @param {String|String[]|Element|Element[]} elem ID对象或ID对应的字符，如果多个对象一起设置，则可以使用数组
     * @param {Element|String} attribute 样式名称或对象，如果是对象，则省略掉value值
     * @param {String} [value] attribute为样式名称时，定义的样式值
     * 
     * @example
     * // 示例一：
     * twtools.Utils.css(ID,'width','100px');
     * // 示例二：
     * twtools.Utils.css('id','width','100px');
     * // 示例三：
     * twtools.Utils.css([ID1,ID2,ID3],'width','100px');
     * // 示例四：
     *  twtools.Utils.css(ID,{
     *     width:'100px',
     *     height:'100px'
     * });
     * 示例五(获取宽度)：
     * // var width=twtools.Utils.css(ID,'width');
     */
    css: function (elem, attribute, value) {
        var i = 0;
        var k = '';
        if (typeof (elem) == 'object') { //对象或数组
            if (defined(typeof (elem.length))) { //说明是数组
                for (i = 0; i < elem.length; i++) {
                    var el;
                    if (typeof (elem[i]) == 'string') {
                        el = this.getByElement(elem[i]);
                    } else {
                        el = elem[i];
                    }
                    if (typeof (attribute) != 'object') {
                        if (defined(value)) {
                            el.style[attribute] = value;
                        }
                    } else {
                        for (k in attribute) {
                            if (defined(attribute[k])) {
                                try {
                                    el.style[k] = attribute[k];
                                } catch (event) {
                                    this.log(event);
                                }
                            }
                        }
                    }
                }
                return;
            }
        }
        if (typeof (elem) == 'string') {
            elem = this.getByElement(elem);
        }
        if (typeof (attribute) != 'object') {
            if (defined(value)) {
                elem.style[attribute] = value;
            } else {
                if (defined(this.getStyle(elem, attribute))) {
                    return this.getStyle(elem, attribute);
                } else {
                    return false;
                }
            }
        } else {
            for (k in attribute) {
                if (defined(attribute[k])) {
                    elem.style[k] = attribute[k];
                }
            }
        }
    },
    /**
     * @private
     * 
     * 内置函数
     * 兼容型获取style
     * @param {*} obj 
     * @param {*} attr 
     */
    getStyle: function (obj, attr) {
        if (!this.isUndefined(obj.style[attr])) {
            return obj.style[attr];
        } else {
            if (obj.currentStyle) {
                return obj.currentStyle[attr];
            } else {
                return getComputedStyle(obj, false)[attr];
            }
        }
    },
    /**
     * 获取当前本地时间
     * @returns {String} 时间
     * @example 2020/02/11 12:00:00
     */
    getNowDate: function () {
        var nowDate = new Date();
        var month = nowDate.getMonth() + 1;
        var date = nowDate.getDate();
        var hours = nowDate.getHours();
        var minutes = nowDate.getMinutes();
        var seconds = nowDate.getSeconds();
        var tMonth = '',
            tDate = '',
            tHours = '',
            tMinutes = '',
            tSeconds = '',
            tSeconds = (seconds < 10) ? '0' + seconds : seconds + '',
            tMinutes = (minutes < 10) ? '0' + minutes : minutes + '',
            tHours = (hours < 10) ? '0' + hours : hours + '',
            tDate = (date < 10) ? '0' + date : date + '',
            tMonth = (month < 10) ? '0' + month : month + '';
        return tMonth + '/' + tDate + ' ' + tHours + ':' + tMinutes + ':' + tSeconds;
    },
    /**
     * 格式化时分秒
     * @param {Int} seconds 秒数
     * @param {Boolean} ishours 是否显示小时，如果设置成false，则会显示如80:20，表示1小时20分钟20秒
     */
    formatTime: function (seconds, ishours) {
        var tSeconds = '',
            tMinutes = '',
            tHours = '';
        if (isNaN(seconds)) {
            seconds = 0;
        }
        var s = Math.floor(seconds % 60),
            m = 0,
            h = 0;
        if (ishours) {
            m = Math.floor(seconds / 60) % 60;
            h = Math.floor(seconds / 3600);
        } else {
            m = Math.floor(seconds / 60);
        }
        tSeconds = (s < 10) ? '0' + s : s + '';
        tMinutes = (m > 0) ? ((m < 10) ? '0' + m + ':' : m + ':') : '00:';
        tHours = (h > 0) ? ((h < 10) ? '0' + h + ':' : h + ':') : '';
        if (ishours) {
            return tHours + tMinutes + tSeconds;
        } else {
            return tMinutes + tSeconds;
        }
    }
};

/**
 * 对象操作类
 * @exports ObjectHelper
 */
var ObjectHelper = {};

/**
 * 对象转换成Html对象
 * @param {Object} options 传入的数据
 * @param {Object} [options.object] 传入的对象
 * @param {String[]} [options.filter=undefined] 过滤器，不转义改字段
 * @param {Object[]} [options.paramKey=undefined] key的中英文翻译，采用keyValue的形式
 * @param {Boolean} [options.isIgnoreNull=false] 是否忽略空值
 * @returns {String} Html  
 */
ObjectHelper.toHtml = function ({ object, filter, paramKey, isIgnoreNull }) {
    var option = Utils.defaultValue(object, {});
    var propertieFilter = Utils.defaultValue(filter, []);
    var param = Utils.defaultValue(paramKey, {});
    isIgnoreNull = Utils.defaultValue(isIgnoreNull, false);
    // var resultHtml = '<ul id="Ts-info-attr">';
    var resultHtml = convert(option, propertieFilter, param, undefined, isIgnoreNull);
    // resultHtml += `</ul>`;
    return resultHtml;
};

function convert(val, filter, paramKey, key, isIgnoreNull) {
    if (filter.indexOf(key) != -1) return "";
    var html = "";
    if (!val && isIgnoreNull) return "";
    if (val instanceof Array) {
        html += convertArray(val, filter, paramKey, key, isIgnoreNull);
    } else if (val instanceof Object) {
        html += convertObject(val, filter, paramKey, key, isIgnoreNull);
    } else {
        if (key) {
            var itemName, value;
            if (paramKey[key]) {
                if (paramKey[key] instanceof Object) {
                    itemName = paramKey[key].key;
                    value = paramKey[key].value[val] ? paramKey[key].value[val] : val;
                } else {
                    itemName = paramKey[key];
                    value = val;
                }
            } else {
                itemName = key;
                value = val;
            }

            html += `
                <li>
                    <span>${itemName}</span>
                    <span>${value}</span>
                </li>`;
        } else {
            html += `
                <li style='text-align: center;'>
                    <span style='width: 100%;'>${val}</span>
                </li>`;
        }
    }
    return html;
}

function convertArray(array, filter, paramKey, key, isIgnoreNull) {
    if (filter.indexOf(key) != -1) return "";
    var html = ``;
    if (key) {
        var itemName;
        if (paramKey[key]) {
            if (paramKey[key] instanceof Object) {
                itemName = paramKey[key].key;
            } else {
                itemName = paramKey[key];
            }
        } else {
            itemName = key;
        }
        html += `
        <ul style='text-align: center;'>
            <span style="font-size: 17px;">${itemName}</span>`;
    }
    for (let i = 0, size = array.length; i < size; i++) {
        const data = array[i];
        // html += `<ul>`
        html += convert(data, filter, paramKey, undefined, isIgnoreNull);
        // html += `</ul>`
    }
    if (key)
        html += `</ul>`;
    return html
}

function convertObject(object, filter, paramKey, key, isIgnoreNull) {
    if (filter.indexOf(key) != -1) return "";
    var html = "";
    if (key) {
        var itemName;
        if (paramKey[key]) {
            if (paramKey[key] instanceof Object) {
                itemName = paramKey[key].key;
            } else {
                itemName = paramKey[key];
            }
        } else {
            itemName = key;
        }
        html += `
        <ul style='text-align: center;'>
            <span style="font-size: 17px;">${itemName}</span>`;
    }
    html += `<ul>`;
    for (item in object) {
        html += convert(object[item], filter, paramKey, item, isIgnoreNull);
    }
    html += `</ul>`;
    if (key)
        html += `</ul>`;

    return html;
}

/**
 * @exports prettyBytes
 * 
 * 将字节数转换为人可读字符串。
 * <br/>
 * 使用要根据指数访问的单位数组字典。用于将数字截划为一定数字数。通过构建伪装的字符串来返回它，同时考虑到提供的选项以及它是否为负数。
 * @param {Number} num 要转换的字节数
 * @param {Number} precision=3 数字的精度
 * @param {Boolean} addSpace=true 在数字和单位之间添加空格
 * @returns {String} 可读字符串
 * @example
 * twtools.prettyBytes(1000); // "1 KB"
 * twtools.prettyBytes(-27145424323.5821, 5); // "-27.145 GB"
 * twtools.prettyBytes(123456789, 3, false); // "123MB"
 */
var prettyBytes = (num, precision = 3, addSpace = true) => {
    const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    if (Math.abs(num) < 1) return num + (addSpace ? ' ' : '') + UNITS[0];
    const exponent = Math.min(Math.floor(Math.log10(num < 0 ? -num : num) / 3), UNITS.length - 1);
    const n = Number(((num < 0 ? -num : num) / 1000 ** exponent).toPrecision(precision));
    return (num < 0 ? '-' : '') + n + (addSpace ? ' ' : '') + UNITS[exponent];
};

/**
     * 所有属性的界面，代表一个值，该值可以随时间变化。此类型定义一个接口，不能直接实例化。
     *
     * @alias Property
     * @constructor
     * @abstract
     *
     */
    function Property() {
        DeveloperError.throwInstantiationError();
    }

    defineProperty(Property.prototype, {
        /**
         * 获取一个值，该值指示此属性是否恒定。考虑财产如果getValue始终为当前定义返回相同的结果，则为常数。
         * @memberof Property.prototype
         *
         * @type {Boolean}
         * @readonly
         */
        isConstant : {
            get : DeveloperError.throwInstantiationError
        },
        /**
         * 获取每当此属性的定义更改时引发的事件。如果对getValue的调用返回，则认为定义已更改同一时间的结果不同。
         * @memberof Property.prototype
         *
         * @type {Event}
         * @readonly
         */
        definitionChanged : {
            get : DeveloperError.throwInstantiationError
        }
    });

    /**
     * 在提供的时间获取属性的值。
     * @function
     *
     * @param {JulianDate} time 检索值的时间。
     * @param {Object} [result] 将值存储到的对象（如果省略）将创建并返回一个新实例。
     * @returns {Object} 修改后的结果参数；如果未提供结果参数，则为新实例。
     */
    Property.prototype.getValue = DeveloperError.throwInstantiationError;

    /**
     * 将此属性与提供的属性进行比较并返回如果相等，则为 true ，否则为 false 。
     * @function
     *
     * @param {Property} [other] 另一个属性。
     * @returns {Boolean} 真正 如果左右相等 假 除此以外。
     */
    Property.prototype.equals = DeveloperError.throwInstantiationError;

    /**
     * @private
     */
    Property.equals = function(left, right) {
        return left === right || (defined(left) && left.equals(right));
    };

    /**
     * @private
     */
    Property.arrayEquals = function(left, right) {
        if (left === right) {
            return true;
        }
        if ((!defined(left) || !defined(right)) || (left.length !== right.length)) {
            return false;
        }
        var length = left.length;
        for (var i = 0; i < length; i++) {
            if (!Property.equals(left[i], right[i])) {
                return false;
            }
        }
        return true;
    };

    /**
     * @private
     */
    Property.isConstant = function(property) {
        return !defined(property) || property.isConstant;
    };

    /**
     * @private
     */
    Property.getValueOrUndefined = function(property, time, result) {
        return defined(property) ? property.getValue(time, result) : undefined;
    };

    /**
     * @private
     */
    Property.getValueOrDefault = function(property, time, valueDefault, result) {
        return defined(property) ? defaultValue(property.getValue(time, result), valueDefault) : valueDefault;
    };

    /**
     * @private
     */
    Property.getValueOrClonedDefault = function(property, time, valueDefault, result) {
        var value;
        if (defined(property)) {
            value = property.getValue(time, result);
        }
        if (!defined(value)) {
            value = valueDefault.clone(value);
        }
        return value;
    };

/**
 * @exports toKebabCase
 * 
 * 将字符串转换为烤肉串
 * @param {String} str 输入字符串
 * @returns {String} 烤肉串字符串
 * @example
 * twtools.toKebabCase('camelCase'); // 'camel-case'
 * twtools.toKebabCase('some text'); // 'some-text'
 * twtools.toKebabCase('some-mixed_string With spaces_underscores-and-hyphens'); // 'some-mixed-string-with-spaces-underscores-and-hyphens'
 * twtools.toKebabCase('AllThe-small Things'); // "all-the-small-things"
 * twtools.toKebabCase('IAmListeningToFMWhileLoadingDifferentURLOnMyBrowserAndAlsoEditingSomeXMLAndHTML'); // "i-am-listening-to-fm-while-loading-different-url-on-my-browser-and-also-editing-xml-and-html"
 */
var toKebabCase = str =>
    str &&
    str
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map(x => x.toLowerCase())
        .join('-');

/**
 * 自定义监听（简单）
 * @constructor
 *
 * @example
 *
 * // 创建Event
 * var event = new TSEvent();
 *
 * // 添加触发
 * event.fireEvent('click', {data:"001"});
 *
 * // 添加监听触发
 * event.addEvent('click',function(data){
 *     console.log(data.data); // "001"
 * })
 *
 */
function TSEvent() {
    this._listeners = {};
}

/**
 * 添加监听事件
 * @param {String} type 监听的标识符
 * @param {Function} fn 监听的时间
 */
TSEvent.prototype.addEvent = function (type, fn) {
    if (typeof this._listeners[type] === "undefined") {
        this._listeners[type] = [];
    }
    if (typeof fn === "function") {
        this._listeners[type].push(fn);
    }
    return this;
};

/**
 * 触发监听的事件
 * @param {String} type 触发监听事件的标识
 * @param {Object} data 触发事件的传入的数据
 */
TSEvent.prototype.fireEvent = function (type, data) {
    var arrayEvent = this._listeners[type];
    var _data = defaultValue(data, {data: {}, result: {}});
    _data._event = {
        _handle: false
    };
    if (arrayEvent instanceof Array) {
        for (var i = 0, length = arrayEvent.length; i < length; i += 1) {
            if (typeof arrayEvent[i] === "function") {
                arrayEvent[i](_data);
                if (_data._event._handle) break;
            }
        }
    }
    return _data;
};

/**
 * 移除监听的事件
 * @param {String} type 监听的标识符
 * @param {Function} fn 监听的时间
 */
TSEvent.prototype.removeEvent = function (type, fn) {
    var arrayEvent = this._listeners[type];
    if (typeof type === "string" && arrayEvent instanceof Array) {
        if (typeof fn === "function") {
            for (var i = 0, length = arrayEvent.length; i < length; i += 1) {
                if (arrayEvent[i] === fn) {
                    this._listeners[type].splice(i, 1);
                    break;
                }
            }
        } else {
            delete this._listeners[type];
        }
    }
    return this;
};

/**
  @license
  when.js - https://github.com/cujojs/when

  MIT License (c) copyright B Cavalier & J Hann

 * A lightweight CommonJS Promises/A and when() implementation
 * when is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @version 1.7.1
 */

var reduceArray, slice, undef;

//
// Public API
//

when.defer     = defer;     // Create a deferred
when.resolve   = resolve;   // Create a resolved promise
when.reject    = reject;    // Create a rejected promise

when.join      = join;      // Join 2 or more promises

when.all       = all;       // Resolve a list of promises
when.map       = map;       // Array.map() for promises
when.reduce    = reduce;    // Array.reduce() for promises

when.any       = any;       // One-winner race
when.some      = some;      // Multi-winner race

when.chain     = chain;     // Make a promise trigger another resolver

when.isPromise = isPromise; // Determine if a thing is a promise

/**
 * Register an observer for a promise or immediate value.
 *
 * @param {*} promiseOrValue
 * @param {function?} [onFulfilled] callback to be called when promiseOrValue is
 *   successfully fulfilled.  If promiseOrValue is an immediate value, callback
 *   will be invoked immediately.
 * @param {function?} [onRejected] callback to be called when promiseOrValue is
 *   rejected.
 * @param {function?} [onProgress] callback to be called when progress updates
 *   are issued for promiseOrValue.
 * @returns {Promise} a new {@link Promise} that will complete with the return
 *   value of callback or errback or the completion value of promiseOrValue if
 *   callback and/or errback is not supplied.
 * @constructor
 */
function when(promiseOrValue, onFulfilled, onRejected, onProgress) {
    // Get a trusted promise for the input promiseOrValue, and then
    // register promise handlers
    return resolve(promiseOrValue).then(onFulfilled, onRejected, onProgress);
}

/**
 * Returns promiseOrValue if promiseOrValue is a {@link Promise}, a new Promise if
 * promiseOrValue is a foreign promise, or a new, already-fulfilled {@link Promise}
 * whose value is promiseOrValue if promiseOrValue is an immediate value.
 *
 * @param {*} promiseOrValue
 * @returns Guaranteed to return a trusted Promise.  If promiseOrValue is a when.js {@link Promise}
 *   returns promiseOrValue, otherwise, returns a new, already-resolved, when.js {@link Promise}
 *   whose resolution value is:
 *   * the resolution value of promiseOrValue if it's a foreign promise, or
 *   * promiseOrValue if it's a value
 */
function resolve(promiseOrValue) {
    var promise, deferred;

    if(promiseOrValue instanceof Promise) {
        // It's a when.js promise, so we trust it
        promise = promiseOrValue;

    } else {
        // It's not a when.js promise. See if it's a foreign promise or a value.
        if(isPromise(promiseOrValue)) {
            // It's a thenable, but we don't know where it came from, so don't trust
            // its implementation entirely.  Introduce a trusted middleman when.js promise
            deferred = defer();

            // IMPORTANT: This is the only place when.js should ever call .then() on an
            // untrusted promise. Don't expose the return value to the untrusted promise
            promiseOrValue.then(
                function(value)  { deferred.resolve(value); },
                function(reason) { deferred.reject(reason); },
                function(update) { deferred.progress(update); }
            );

            promise = deferred.promise;

        } else {
            // It's a value, not a promise.  Create a resolved promise for it.
            promise = fulfilled(promiseOrValue);
        }
    }

    return promise;
}

/**
 * Returns a rejected promise for the supplied promiseOrValue.  The returned
 * promise will be rejected with:
 * - promiseOrValue, if it is a value, or
 * - if promiseOrValue is a promise
 *   - promiseOrValue's value after it is fulfilled
 *   - promiseOrValue's reason after it is rejected
 * @param {*} promiseOrValue the rejected value of the returned {@link Promise}
 * @returns {Promise} rejected {@link Promise}
 */
function reject(promiseOrValue) {
    return when(promiseOrValue, rejected);
}

/**
 * Trusted Promise constructor.  A Promise created from this constructor is
 * a trusted when.js promise.  Any other duck-typed promise is considered
 * untrusted.
 * @constructor
 * @name Promise
 */
function Promise(then) {
    this.then = then;
}

Promise.prototype = {
    /**
     * Register a callback that will be called when a promise is
     * fulfilled or rejected.  Optionally also register a progress handler.
     * Shortcut for .then(onFulfilledOrRejected, onFulfilledOrRejected, onProgress)
     * @param {function?} [onFulfilledOrRejected]
     * @param {function?} [onProgress]
     * @returns {Promise}
     */
    always: function(onFulfilledOrRejected, onProgress) {
        return this.then(onFulfilledOrRejected, onFulfilledOrRejected, onProgress);
    },

    /**
     * Register a rejection handler.  Shortcut for .then(undefined, onRejected)
     * @param {function?} onRejected
     * @returns {Promise}
     */
    otherwise: function(onRejected) {
        return this.then(undef, onRejected);
    },

    /**
     * Shortcut for .then(function() { return value; })
     * @param  {*} value
     * @returns {Promise} a promise that:
     *  - is fulfilled if value is not a promise, or
     *  - if value is a promise, will fulfill with its value, or reject
     *    with its reason.
     */
    yield: function(value) {
        return this.then(function() {
            return value;
        });
    },

    /**
     * Assumes that this promise will fulfill with an array, and arranges
     * for the onFulfilled to be called with the array as its argument list
     * i.e. onFulfilled.spread(undefined, array).
     * @param {function} onFulfilled function to receive spread arguments
     * @returns {Promise}
     */
    spread: function(onFulfilled) {
        return this.then(function(array) {
            // array may contain promises, so resolve its contents.
            return all(array, function(array) {
                return onFulfilled.apply(undef, array);
            });
        });
    }
};

/**
 * Create an already-resolved promise for the supplied value
 * @private
 *
 * @param {*} value
 * @returns {Promise} fulfilled promise
 */
function fulfilled(value) {
    var p = new Promise(function(onFulfilled) {
        // TODO: Promises/A+ check typeof onFulfilled
        try {
            return resolve(onFulfilled ? onFulfilled(value) : value);
        } catch(e) {
            return rejected(e);
        }
    });

    return p;
}

/**
 * Create an already-rejected {@link Promise} with the supplied
 * rejection reason.
 * @private
 *
 * @param {*} reason
 * @returns {Promise} rejected promise
 */
function rejected(reason) {
    var p = new Promise(function(_, onRejected) {
        // TODO: Promises/A+ check typeof onRejected
        try {
            return onRejected ? resolve(onRejected(reason)) : rejected(reason);
        } catch(e) {
            return rejected(e);
        }
    });

    return p;
}

/**
 * Creates a new, Deferred with fully isolated resolver and promise parts,
 * either or both of which may be given out safely to consumers.
 * The Deferred itself has the full API: resolve, reject, progress, and
 * then. The resolver has resolve, reject, and progress.  The promise
 * only has then.
 *
 * @returns {Deferred}
 */
function defer() {
    var deferred, promise, handlers, progressHandlers,
        _then, _progress, _resolve;

    /**
     * The promise for the new deferred
     * @type {Promise}
     */
    promise = new Promise(then);

    /**
     * The full Deferred object, with {@link Promise} and {@link Resolver} parts
     * @class Deferred
     * @name Deferred
     */
    deferred = {
        then:     then, // DEPRECATED: use deferred.promise.then
        resolve:  promiseResolve,
        reject:   promiseReject,
        // TODO: Consider renaming progress() to notify()
        progress: promiseProgress,

        promise:  promise,

        resolver: {
            resolve:  promiseResolve,
            reject:   promiseReject,
            progress: promiseProgress
        }
    };

    handlers = [];
    progressHandlers = [];

    /**
     * Pre-resolution then() that adds the supplied callback, errback, and progback
     * functions to the registered listeners
     * @private
     *
     * @param {function?} [onFulfilled] resolution handler
     * @param {function?} [onRejected] rejection handler
     * @param {function?} [onProgress] progress handler
     */
    _then = function(onFulfilled, onRejected, onProgress) {
        // TODO: Promises/A+ check typeof onFulfilled, onRejected, onProgress
        var deferred, progressHandler;

        deferred = defer();

        progressHandler = typeof onProgress === 'function'
            ? function(update) {
                try {
                    // Allow progress handler to transform progress event
                    deferred.progress(onProgress(update));
                } catch(e) {
                    // Use caught value as progress
                    deferred.progress(e);
                }
            }
            : function(update) { deferred.progress(update); };

        handlers.push(function(promise) {
            promise.then(onFulfilled, onRejected)
                .then(deferred.resolve, deferred.reject, progressHandler);
        });

        progressHandlers.push(progressHandler);

        return deferred.promise;
    };

    /**
     * Issue a progress event, notifying all progress listeners
     * @private
     * @param {*} update progress event payload to pass to all listeners
     */
    _progress = function(update) {
        processQueue(progressHandlers, update);
        return update;
    };

    /**
     * Transition from pre-resolution state to post-resolution state, notifying
     * all listeners of the resolution or rejection
     * @private
     * @param {*} value the value of this deferred
     */
    _resolve = function(value) {
        value = resolve(value);

        // Replace _then with one that directly notifies with the result.
        _then = value.then;
        // Replace _resolve so that this Deferred can only be resolved once
        _resolve = resolve;
        // Make _progress a noop, to disallow progress for the resolved promise.
        _progress = noop;

        // Notify handlers
        processQueue(handlers, value);

        // Free progressHandlers array since we'll never issue progress events
        progressHandlers = handlers = undef;

        return value;
    };

    return deferred;

    /**
     * Wrapper to allow _then to be replaced safely
     * @param {function?} [onFulfilled] resolution handler
     * @param {function?} [onRejected] rejection handler
     * @param {function?} [onProgress] progress handler
     * @returns {Promise} new promise
     */
    function then(onFulfilled, onRejected, onProgress) {
        // TODO: Promises/A+ check typeof onFulfilled, onRejected, onProgress
        return _then(onFulfilled, onRejected, onProgress);
    }

    /**
     * Wrapper to allow _resolve to be replaced
     */
    function promiseResolve(val) {
        return _resolve(val);
    }

    /**
     * Wrapper to allow _reject to be replaced
     */
    function promiseReject(err) {
        return _resolve(rejected(err));
    }

    /**
     * Wrapper to allow _progress to be replaced
     */
    function promiseProgress(update) {
        return _progress(update);
    }
}

/**
 * Determines if promiseOrValue is a promise or not.  Uses the feature
 * test from http://wiki.commonjs.org/wiki/Promises/A to determine if
 * promiseOrValue is a promise.
 *
 * @param {*} promiseOrValue anything
 * @returns {boolean} true if promiseOrValue is a {@link Promise}
 */
function isPromise(promiseOrValue) {
    return promiseOrValue && typeof promiseOrValue.then === 'function';
}

/**
 * Initiates a competitive race, returning a promise that will resolve when
 * howMany of the supplied promisesOrValues have resolved, or will reject when
 * it becomes impossible for howMany to resolve, for example, when
 * (promisesOrValues.length - howMany) + 1 input promises reject.
 *
 * @param {Array} promisesOrValues array of anything, may contain a mix
 *      of promises and values
 * @param howMany {number} number of promisesOrValues to resolve
 * @param {function?} [onFulfilled] resolution handler
 * @param {function?} [onRejected] rejection handler
 * @param {function?} [onProgress] progress handler
 * @returns {Promise} promise that will resolve to an array of howMany values that
 * resolved first, or will reject with an array of (promisesOrValues.length - howMany) + 1
 * rejection reasons.
 */
function some(promisesOrValues, howMany, onFulfilled, onRejected, onProgress) {

    checkCallbacks(2, arguments);

    return when(promisesOrValues, function(promisesOrValues) {

        var toResolve, toReject, values, reasons, deferred, fulfillOne, rejectOne, progress, len, i;

        len = promisesOrValues.length >>> 0;

        toResolve = Math.max(0, Math.min(howMany, len));
        values = [];

        toReject = (len - toResolve) + 1;
        reasons = [];

        deferred = defer();

        // No items in the input, resolve immediately
        if (!toResolve) {
            deferred.resolve(values);

        } else {
            progress = deferred.progress;

            rejectOne = function(reason) {
                reasons.push(reason);
                if(!--toReject) {
                    fulfillOne = rejectOne = noop;
                    deferred.reject(reasons);
                }
            };

            fulfillOne = function(val) {
                // This orders the values based on promise resolution order
                // Another strategy would be to use the original position of
                // the corresponding promise.
                values.push(val);

                if (!--toResolve) {
                    fulfillOne = rejectOne = noop;
                    deferred.resolve(values);
                }
            };

            for(i = 0; i < len; ++i) {
                if(i in promisesOrValues) {
                    when(promisesOrValues[i], fulfiller, rejecter, progress);
                }
            }
        }

        return deferred.then(onFulfilled, onRejected, onProgress);

        function rejecter(reason) {
            rejectOne(reason);
        }

        function fulfiller(val) {
            fulfillOne(val);
        }

    });
}

/**
 * Initiates a competitive race, returning a promise that will resolve when
 * any one of the supplied promisesOrValues has resolved or will reject when
 * *all* promisesOrValues have rejected.
 *
 * @param {Array|Promise} promisesOrValues array of anything, may contain a mix
 *      of {@link Promise}s and values
 * @param {function?} [onFulfilled] resolution handler
 * @param {function?} [onRejected] rejection handler
 * @param {function?} [onProgress] progress handler
 * @returns {Promise} promise that will resolve to the value that resolved first, or
 * will reject with an array of all rejected inputs.
 */
function any(promisesOrValues, onFulfilled, onRejected, onProgress) {

    function unwrapSingleResult(val) {
        return onFulfilled ? onFulfilled(val[0]) : val[0];
    }

    return some(promisesOrValues, 1, unwrapSingleResult, onRejected, onProgress);
}

/**
 * Return a promise that will resolve only once all the supplied promisesOrValues
 * have resolved. The resolution value of the returned promise will be an array
 * containing the resolution values of each of the promisesOrValues.
 * @memberOf when
 *
 * @param {Array|Promise} promisesOrValues array of anything, may contain a mix
 *      of {@link Promise}s and values
 * @param {function?} [onFulfilled] resolution handler
 * @param {function?} [onRejected] rejection handler
 * @param {function?} [onProgress] progress handler
 * @returns {Promise}
 */
function all(promisesOrValues, onFulfilled, onRejected, onProgress) {
    checkCallbacks(1, arguments);
    return map(promisesOrValues, identity).then(onFulfilled, onRejected, onProgress);
}

/**
 * Joins multiple promises into a single returned promise.
 * @returns {Promise} a promise that will fulfill when *all* the input promises
 * have fulfilled, or will reject when *any one* of the input promises rejects.
 */
function join(/* ...promises */) {
    return map(arguments, identity);
}

/**
 * Traditional map function, similar to `Array.prototype.map()`, but allows
 * input to contain {@link Promise}s and/or values, and mapFunc may return
 * either a value or a {@link Promise}
 *
 * @param {Array|Promise} promise array of anything, may contain a mix
 *      of {@link Promise}s and values
 * @param {function} mapFunc mapping function mapFunc(value) which may return
 *      either a {@link Promise} or value
 * @returns {Promise} a {@link Promise} that will resolve to an array containing
 *      the mapped output values.
 */
function map(promise, mapFunc) {
    return when(promise, function(array) {
        var results, len, toResolve, resolve, i, d;

        // Since we know the resulting length, we can preallocate the results
        // array to avoid array expansions.
        toResolve = len = array.length >>> 0;
        results = [];
        d = defer();

        if(!toResolve) {
            d.resolve(results);
        } else {

            resolve = function resolveOne(item, i) {
                when(item, mapFunc).then(function(mapped) {
                    results[i] = mapped;

                    if(!--toResolve) {
                        d.resolve(results);
                    }
                }, d.reject);
            };

            // Since mapFunc may be async, get all invocations of it into flight
            for(i = 0; i < len; i++) {
                if(i in array) {
                    resolve(array[i], i);
                } else {
                    --toResolve;
                }
            }

        }

        return d.promise;

    });
}

/**
 * Traditional reduce function, similar to `Array.prototype.reduce()`, but
 * input may contain promises and/or values, and reduceFunc
 * may return either a value or a promise, *and* initialValue may
 * be a promise for the starting value.
 *
 * @param {Array|Promise} promise array or promise for an array of anything,
 *      may contain a mix of promises and values.
 * @param {function} reduceFunc reduce function reduce(currentValue, nextValue, index, total),
 *      where total is the total number of items being reduced, and will be the same
 *      in each call to reduceFunc.
 * @returns {Promise} that will resolve to the final reduced value
 */
function reduce(promise, reduceFunc /*, initialValue */) {
    var args = slice.call(arguments, 1);

    return when(promise, function(array) {
        var total;

        total = array.length;

        // Wrap the supplied reduceFunc with one that handles promises and then
        // delegates to the supplied.
        args[0] = function (current, val, i) {
            return when(current, function (c) {
                return when(val, function (value) {
                    return reduceFunc(c, value, i, total);
                });
            });
        };

        return reduceArray.apply(array, args);
    });
}

/**
 * Ensure that resolution of promiseOrValue will trigger resolver with the
 * value or reason of promiseOrValue, or instead with resolveValue if it is provided.
 *
 * @param promiseOrValue
 * @param {Object} resolver
 * @param {function} resolver.resolve
 * @param {function} resolver.reject
 * @param {*} [resolveValue]
 * @returns {Promise}
 */
function chain(promiseOrValue, resolver, resolveValue) {
    var useResolveValue = arguments.length > 2;

    return when(promiseOrValue,
        function(val) {
            val = useResolveValue ? resolveValue : val;
            resolver.resolve(val);
            return val;
        },
        function(reason) {
            resolver.reject(reason);
            return rejected(reason);
        },
        resolver.progress
    );
}

//
// Utility functions
//

/**
 * Apply all functions in queue to value
 * @param {Array} queue array of functions to execute
 * @param {*} value argument passed to each function
 */
function processQueue(queue, value) {
    var handler, i = 0;

    while (handler = queue[i++]) {
        handler(value);
    }
}

/**
 * Helper that checks arrayOfCallbacks to ensure that each element is either
 * a function, or null or undefined.
 * @private
 * @param {number} start index at which to start checking items in arrayOfCallbacks
 * @param {Array} arrayOfCallbacks array to check
 * @throws {Error} if any element of arrayOfCallbacks is something other than
 * a functions, null, or undefined.
 */
function checkCallbacks(start, arrayOfCallbacks) {
    // TODO: Promises/A+ update type checking and docs
    var arg, i = arrayOfCallbacks.length;

    while(i > start) {
        arg = arrayOfCallbacks[--i];

        if (arg != null && typeof arg != 'function') {
            throw new Error('arg '+i+' must be a function');
        }
    }
}

/**
 * No-Op function used in method replacement
 * @private
 */
function noop() {}

slice = [].slice;

// ES5 reduce implementation if native not available
// See: http://es5.github.com/#x15.4.4.21 as there are many
// specifics and edge cases.
reduceArray = [].reduce ||
    function(reduceFunc /*, initialValue */) {
        /*jshint maxcomplexity: 7*/

        // ES5 dictates that reduce.length === 1

        // This implementation deviates from ES5 spec in the following ways:
        // 1. It does not check if reduceFunc is a Callable

        var arr, args, reduced, len, i;

        i = 0;
        // This generates a jshint warning, despite being valid
        // "Missing 'new' prefix when invoking a constructor."
        // See https://github.com/jshint/jshint/issues/392
        arr = Object(this);
        len = arr.length >>> 0;
        args = arguments;

        // If no initialValue, use first item of array (we know length !== 0 here)
        // and adjust i to start at second item
        if(args.length <= 1) {
            // Skip to the first real element in the array
            for(;;) {
                if(i in arr) {
                    reduced = arr[i++];
                    break;
                }

                // If we reached the end of the array without finding any real
                // elements, it's a TypeError
                if(++i >= len) {
                    throw new TypeError();
                }
            }
        } else {
            // If initialValue provided, use it
            reduced = args[1];
        }

        // Do the actual reduce
        for(;i < len; ++i) {
            // Skip holes
            if(i in arr) {
                reduced = reduceFunc(reduced, arr[i], i, arr);
            }
        }

        return reduced;
    };

function identity(x) {
    return x;
}

var _plugins = {};
var _loadingList = [];
var _loadingSystemList = [];
var _isLoaded = false;
var _data;

/**
 * 插件管理器
 * <br/><br/>
 * 主要用于JavaScript项目中，对于不同功能的区分，以防止牵连以及变量污染。
 * 插件管理器应该在界面加载时创建，在加载完成后进行插件加载。
 * @alias PluginManager
 * @constructor
 * @param {Object} options 参数
 * @param {Object} options.data
 *
 * @example
 *
 * // 创建插件管理器的过程
 * var pm = twtools.PluginManager();
 *
 * //插件创建过程
 * (function (manager, $, undefined) {
 *
 *     // 此插件相对路径的获取方法
 *     var baseUrl;
 *     ! function () {
 *         var scriptList = document.scripts,
 *             thisPath = scriptList[scriptList.length - 1].src;
 *         baseUrl = thisPath.substring(0, thisPath.lastIndexOf('/') + 1);
 *     }();
 *
 *     function testPlugin(data) {
 *         this._data = data;
 *     }
 *
 *     testPlugin.prototype = {
 *         init:function(){
 *             return true;
 *         },
 *         firstFun: function(){
 *
 *         }
 *     }
 *
 *     // 在一个自启动的方法中，添加这个
 *     manager.addPlugin(testPlugin, '测试插件')
 *
 * }(pm, jQuery));
 *
 * // 加载插件所有插件
 * pm.LoadPlugins();
 *
 * //获取插件
 * var plugin = pm.Plugins["testPlugin"];
 * plugin.firstFun();
 * 
 * 在html中使用需要注意一个问题，需要先初始化完之后再加载插件的js
 * 
 * <head>
 *  <script src="./js/twtools.js">
 * </head>
 * <body>
 *  <script>
 *       var PluginManager = new twtools.PluginManager();
 *  </script>
 *  <!-- 插件 -->
 *  <script src="./Plugins/TSInfoBox/TSInfoBox.js"></script>
 * </body>
 */
function PluginManager(options) {
    options = defaultValue(options, {});
    this._data = options.data;
}



defineProperty(PluginManager.prototype, {
    data: {
        get: function () {
            return _data;
        }
    },
    /**
     * 获取已经加载的插件集合
     * 是按照对象的方式存在的
     * @memberof PluginManager.prototype
     * @type {*}
     * @readonly
     *
     */
    Plugins: {
        get: function () {
            return _plugins;
        }
    },
    /**
     * 是否已经初始化完成
     * @memberof PluginManager.prototype
     * @type {Boolean}
     * @readonly
     */
    isLoad: {
        get: function () {
            return _isLoaded;
        }
    }
});

/**
 * 添加一个插件，插入到指定的地方，如果index为undefined，则插入到最后
 * @param {Function} e 插件方法
 * @param {String} desc 插件描述
 * @param {int} index 优先级，0为最高，如果为undefined，则插入到最后
 * @returns {Boolean} 是否成功插入
 */
PluginManager.prototype.addPlugin = function (e, desc, index) {
    if (e == undefined || typeof e !== "function") {
        console.error(`【PluginManager】 参数为空 或者 类型不是Function e:${e}`);
        return false;
    }
    e.PluginDescription = desc;
    e.prototype.PluginDescription = desc;
    if (!e.PluginName)
        e.PluginName = e.name;
    e.prototype.PluginName = e.name;
    if (index == undefined) {
        _loadingList.push(e);
    } else {
        _loadingList.splice(index, 0, e);
    }
    return true;
};

/**
 * 添加一个系统插件，插入到指定的地方，如果index为undefined，则插入到最后。
 * 系统插件是在最前面加载的插件，并且会直接绑定到 window 对象上
 * @param {Function} e 插件方法
 * @param {String} desc 插件描述
 * @param {int} index 优先级，0为最高，如果为undefined，则插入到最后
 * @returns {Boolean} 是否成功插入
 */
PluginManager.prototype.addSystemPlugin = function (e, desc, index) {
    if (e == undefined || typeof e !== "function") {
        console.error(`【PluginManager】 参数为空 或者 类型不是Function e:${e}`);
        return false;
    }
    e.PluginDescription = desc;
    e.prototype.PluginDescription = desc;
    if (!e.PluginName)
        e.PluginName = e.name;
    e.prototype.PluginName = e.name;
    if (index == undefined) {
        _loadingSystemList.push(e);
    } else {
        _loadingSystemList.splice(index, 0, e);
    }
    return true;
};

/**
 * 开始加载插件
 */
PluginManager.prototype.LoadPlugins = function () {
    if (_isLoaded) {
        console.error(`【PluginManager】已经加载过插件，不能重复加载`);
        return;
    }
    // 添加系统插件
    _loadPlugins(_loadingSystemList, window, this._data, '【PluginManager】【系统】');

    // 添加业务插件
    _loadPlugins(_loadingList, _plugins, this._data, '【PluginManager】');
    _isLoaded = true;
};

/**
 * @private
 */
function _loadPlugins(pluginList, root, viewer, consoleHead) {
    let count = 0;
    // 添加系统插件
    for (let i = 0, length = pluginList.length; i < length; i++) {
        const e = pluginList[i];
        if (root[e.PluginName]) {
            let have = root[e.PluginName];
            console.error(`${consoleHead}要添加的插件 ${e.PluginName} ${e.PluginDescription == undefined ? "" : "(" + e.PluginDescription + ")"} 与已经存在的插件 ${have.PluginName} ${have.PluginDescription == undefined ? "" : "(" + have.PluginDescription + ")"} 冲突！`);
            continue;
        }
        root[e.PluginName] = new e(viewer);
        if (!root[e.PluginName].init()) {
            console.error(`${consoleHead}插件 ${e.PluginName} ${e.PluginDescription == undefined ? "" : "(" + e.PluginDescription + ")"} 初始化失败！ `);
        }
        count++;
        console.info(`${consoleHead}添加插件【${count}】 ${e.PluginName} ${e.PluginDescription == undefined ? "" : "(" + e.PluginDescription + ")"}`);
    }
    console.info(`${consoleHead}一共添加 ${count} 个插件`);
}

var VERSION = '0.0.1';

export { Check, DeveloperError, Event, ObjectHelper as Object, PluginManager, Property, TSEvent, Utils, VERSION, clone, defaultValue, defineProperty as defineProperties, defined, destroyObject as destoryObject, freezeObject$1 as freezeObject, get$1 as get, guid, HTML as html, prettyBytes, toKebabCase, when };
