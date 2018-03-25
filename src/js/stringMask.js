/**
 * @doc 字符串脱敏
 * @author Heanes
 * @time 2018-03-14 18:58:54 周三
 */

;(function($, window, document, undefined) {
    "use strict";
    var pluginName = 'stringMask';
    var _default = {};
    _default.setting = {
        start: 3,                   // 起始位置
        length: 4,                  // 替换长度
        fromEnd: false,             // 从头部向尾部计数
        maskSymbol: '*',            // 替换字符
        clickToToggle: true,        // 点击切换
        $clickElement: undefined,   // 点击切换的触发元素
        onClick: undefined,         // 点击事件
        beforeMasked: undefined,    // 替换之前
        afterMasked: undefined,     // 当替换之后
        beforeRecover: undefined,   // 还原之前
        afterRecover: undefined,    // 当还原之后
        strMaskMethod: undefined    // 自定义替换算法，返回被脱敏后的数据,function(stringOrigin, options)
    };

    var StringMask = function (element, options) {
        // noinspection JSUnusedGlobalSymbols
        if(this.status){
            this.refreshOption(options);
            return this;
        }
        this._name = pluginName;
        this.version = 'v1.0.0';
        this._defaults = _default;

        this.$element = $(element);
        this.$el_ = this.$element.clone(true);  // 保留一份原始dom

        this.status = {isInited: false};

        this.options = $.extend(true, {}, this._defaults.setting, options);
        this.handleToStandardOption(this.options);

        this.options.$clickElement = this.options.$clickElement || this.$element;

        this.init();
        return {
            // Options (public access)
            options: this.options,

            // Initialize / destroy methods
            init:   $.proxy(this.init, this),
            remove: $.proxy(this.remove, this),

            // Method
            setMasked: $.proxy(this.setMasked, this),
            setRecover: $.proxy(this.setRecover, this),
            refreshOption: $.proxy(this.refreshOption, this),

            // prepare use
            test: $.proxy(this.test, this)
        };
    };

    // noinspection JSUnusedLocalSymbols
    StringMask.prototype = {
        init: function () {

            this.data = {
                stringOrigin: this.getOriginText(this.$element),
                stringMasked: '',
                maskStatus: false
            };

            this.render();
            this.status.isInited = true;
            return this;
        },
        destroy: function () {
            this.$element.html(this.$el_.html());
            this.status.isInited = false;
            return this;
        },
        render: function () {
            var options = this.options;

            this.bindChangeEvent(options);
            this.bindMouseEvent(options);

            var stringMasked = '';
            if(typeof options.strMaskMethod === 'function'){
                stringMasked = options.strMaskMethod(this.data.stringOrigin, options);
            }else{
                stringMasked = stringMask(this.data.stringOrigin, options.start, options.length, options.maskSymbol, options.fromEnd);
            }
            options.$clickElement.trigger('beforeChange');
            this.setTextToElement(stringMasked);

            this.data.stringMasked = stringMasked;
            this.data.maskStatus = true;

            options.$clickElement.trigger('afterChange');

            return this;
        },
        handleToStandardOption: function (option) {
            option.start = parseInt(option.start);
            option.length = parseInt(option.length);
            option.fromEnd = (option.fromEnd + '') === 'true';
            option.clickToToggle = (option.clickToToggle + '') === 'true';
            return this;
        },
        getOriginText: function ($element) {
            if(!$element){
                return '';
            }
            return $element.text() || '';
        },
        setTextToElement: function (str, $element) {
            $element = $element || this.$element;
            $element.empty().append(str);
            return this;
        },

        refreshOption: function (options) {
            this.options = $.extend(true, {}, this.options, options);
            this.handleToStandardOption(this.options);

            this.destroy();
            this.init();
        },

        // ------------------------------ event bind ------------------------------
        bindMouseEvent: function (options) {

            this.onClick(options);

            return this;
        },

        // ------------------------------ 改变事件 ------------------------------
        bindChangeEvent: function (options) {

            this.beforeMasked(options);
            this.afterMasked(options);
            this.beforeRecover(options);
            this.afterRecover(options);

            this.beforeChange(options);

            this.afterChange(options);

            return this;
        },

        // ------------------------------ click事件 ------------------------------
        stringMaskElementClickFunc: function (event) {
            event.data.$clickElement.trigger('stringMask.click');
        },
        onClick: function (options) {
            if(!options.clickToToggle){
                options.$clickElement.off('click', this.stringMaskElementClickFunc);
                return false;
            }
            // 为了支持'refreshOption'，重置click事件，必须这样专门定义一个全局方法，来解绑之前绑定的方法，且不影响该元素原来绑定的click事件处理
            options.$clickElement
                .off('click', this.stringMaskElementClickFunc)
                .on('click', options, this.stringMaskElementClickFunc);

            var _that = this;

            options.$clickElement.off('stringMask.click').on('stringMask.click', function () {
                $(this).trigger('beforeChange');

                var strNew = _that.data.maskStatus ? _that.data.stringOrigin : _that.data.stringMasked;
                _that.setTextToElement(strNew);
                _that.data.maskStatus = !_that.data.maskStatus;

                $(this).trigger('afterChange');
            });

            return this;
        },

        // ------------------------------ change 事件 ------------------------------
        beforeChange: function (options) {
            var _that = this;
            options.$clickElement.off('beforeChange').on('beforeChange', function () {
                // 脱敏之前的事件
                if(!_that.data.maskStatus){
                    $(this).trigger('beforeMasked');
                }
                // 还原之前的事件
                if(_that.data.maskStatus){
                    $(this).trigger('beforeRecover');
                }
            });
        },
        afterChange: function (options) {
            var _that = this;
            options.$clickElement.off('afterChange').on('afterChange', function () {
                // 脱敏之后的事件
                if(_that.data.maskStatus){
                    $(this).trigger('afterMasked');
                }
                // 还原之后的事件
                if(!_that.data.maskStatus){
                    $(this).trigger('afterRecover');
                }
            });
        },

        // ------------------------------ 脱敏-还原事件 ------------------------------
        beforeMasked: function (options) {
            var _that = this;
            options.$clickElement.off('beforeMasked').on('beforeMasked', function () {
                // 脱敏之前的事件
                if(!_that.data.maskStatus){
                    //console.log('string mask before:' + _that.data.stringOrigin);
                    if(typeof options.beforeMasked === 'function'){
                        options.beforeMasked(options);
                    }
                }
            });
        },
        afterMasked: function (options) {
            var _that = this;
            options.$clickElement.off('afterMasked').on('afterMasked', function () {
                // 脱敏之后的事件
                if(_that.data.maskStatus){
                    //console.log('string mask finish:' + _that.data.stringOrigin + '->' + _that.data.stringMasked);
                    if(typeof options.afterMasked === 'function'){
                        options.afterMasked(options);
                    }
                }
            });
        },
        beforeRecover: function (options) {
            var _that = this;
            options.$clickElement.off('beforeRecover').on('beforeRecover', function () {
                // 还原之前的事件
                if(_that.data.maskStatus){
                    //console.log('string recover before:' + _that.data.stringMasked);
                    if(typeof options.beforeRecover === 'function'){
                        options.beforeRecover(options);
                    }
                }
            });
        },
        afterRecover: function (options) {
            var _that = this;
            options.$clickElement.off('afterRecover').on('afterRecover', function () {
                // 还原之后的事件
                if(!_that.data.maskStatus){
                    //console.log('string recover finish:' + _that.data.stringMasked + '->' + _that.data.stringOrigin);
                    if(typeof options.afterRecover === 'function'){
                        options.afterRecover(options);
                    }
                }
            });
        },

        // ------------------------------ method ------------------------------
        setMasked: function (options) {
            this.setTextToElement(this.data.stringMasked);
            this.data.maskStatus = true;
        },
        setRecover: function (options) {
            this.setTextToElement(this.data.stringOrigin);
            this.data.maskStatus = false;
        }
    };

    /**
     * @doc 字符串脱敏函数
     * @author fanggang
     * @time 2018-03-14 18:57:07 周三
     */
    function stringMask(text, start, length, maskSymbol, fromEnd) {
        start = start === undefined ? 4 : start;
        length = length === undefined  ? 4 : length;
        maskSymbol = maskSymbol === undefined  ? '*' : maskSymbol;
        fromEnd = fromEnd || false;

        if(null === text || undefined === text || text.length === 0){
            return '';
        }

        start = start < 0 ? 0 : start;
        length = length < 0 ? 0 : length;
        if(text.length <= start){
            return text;
        }
        if(text.length <= length){
            return strRepeat(maskSymbol, text.length);
        }
        if(text.length <= (start + length)){
            length = text.length - start;
        }
        var textNew = '', strMasked = '';
        // 如果从尾部截取
        if(fromEnd){
            textNew = text.substr(text.length - start - length, length);
            strMasked = text.substr(0, text.length - start - length) + strRepeat(maskSymbol, textNew.length) + text.substr(text.length - start, start);
        }else{
            textNew = text.substr(start, length);
            strMasked = text.substr(0, start) + strRepeat(maskSymbol, textNew.length) + text.substr(start + length, text.length - start - length);
        }
        return strMasked;
    }

    /**
     * @doc 字符串复制
     * @author fanggang
     * @time 2018-03-14 18:52:15 周三
     */
    function strRepeat(target, n) {
        return (new Array(n + 1)).join(target);
    }

    function logError(message) {
        if(window.console){
            window.console.error(message);
        }
    }

    $.fn[pluginName] = function (options, args) {
        var result;
        this.each(function () {
            var $this = $(this);
            var _this = $.data(this, pluginName);
            if (typeof options === 'string') {
                if (!_this) {
                    logError('Not initialized, can not call method : ' + options);
                }
                else if (!$.isFunction(_this[options]) || options.charAt(0) === '_') {
                    logError('No such method : ' + options);
                }
                else {
                    if (options === 'destroy') {
                        $this.removeData(pluginName);
                    }
                    if (!(args instanceof Array)) {
                        args = [ args ];
                    }
                    result = _this[options].apply(_this, args);
                }
            }
            else if (typeof options === 'boolean') {
                result = _this;
            }
            else {
                $.data(this, pluginName, new StringMask(this, $.extend(true, {}, options)));
            }
        });
        return result || this;
    };

})(jQuery, window, document);