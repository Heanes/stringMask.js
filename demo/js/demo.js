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

    let $stringMaskDemo = $('.string-mask-demo'),
        $demoResultInfo = $('.demo-result-info'),
        $stringMaskConfigForm = $('.string-mask-config-form'),
        $demoConfigConfirmBtn = $('.demo-config-confirm-btn');
    //$stringMaskDemo.stringMask();
    $demoConfigConfirmBtn.on('click', function () {
        let formDataObj = $stringMaskConfigForm.serializeObject();
        $stringMaskDemo.text(formDataObj.stringMaskText);
        let formConfig = {
            start:   formDataObj.stringMaskStart,   // 起始位置
            length:  formDataObj.stringMaskLength,  // 替换长度
            fromEnd: formDataObj.stringMaskFromEnd, // 从头部向尾部计数
            afterMasked: function () {
                $demoResultInfo.text('已经脱敏处理');
            },
            afterRecover: function () {
                $demoResultInfo.text('已经恢复原状');
            }
        };
        //console.table(formConfig);
        $stringMaskDemo.stringMask().stringMask('refreshOption', formConfig);
        return false;
    });
});