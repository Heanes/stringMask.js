/**
 * @doc demo
 * @author Heanes
 * @time 2018-03-21 12:07:22 周三
 */
$(function () {
    "use strict";

    /**
     * @doc 根据form数据获取对象数据
     * @returns {{}}
     * @author Heanes
     * @time 2018-03-24 23:12:53 周六
     */
    jQuery.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        jQuery.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    var $stringMaskDemo = $('.string-mask-demo'),
        $demoResultInfo = $('.demo-result-info'),
        $stringMaskConfigForm = $('.string-mask-config-form'),
        $demoConfigConfirmBtn = $('.demo-config-confirm-btn'),
        $demoConfigResultWrap = $('.demo-config-result-wrap'),
        $demoConfigResult = $('.demo-config-result');

    var preConfig = {
        afterMasked:  function () {
            $demoResultInfo.removeClass('recover').addClass('masked').text('已经脱敏处理');
        },
        afterRecover: function () {
            $demoResultInfo.removeClass('masked').addClass('recover').text('已经恢复原状');
        }
    };
    $demoConfigConfirmBtn.on('click', function () {
        var formDataObj = $stringMaskConfigForm.serializeObject();
        $stringMaskDemo.text(formDataObj.text);
        var formConfig = {
            start:         formDataObj.start,           // 起始位置
            maskSymbol:    formDataObj.maskSymbol,      // 起始位置
            length:        formDataObj.length,          // 替换长度
            fromEnd:       formDataObj.fromEnd,         // 从头部向尾部计数
            clickToToggle: formDataObj.clickToToggle,   // 点击切换
        };
        var config = $.extend(true, {}, preConfig, formConfig);
        $demoConfigResult.empty().text(renderObject(formConfig));
        $demoConfigResultWrap.show();
        $stringMaskDemo.stringMask(config);
        return false;
    });

    function renderObject(obj) {
        var objStr = '{\n';
        for (var key in obj) {
            objStr += '    ' + key + ': ' + obj[key] + '\n';
        }
        objStr += '}';
        return objStr;
    }
});