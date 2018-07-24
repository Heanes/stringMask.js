# StringMask.js
Replace some secret information with specified mask symbol, to protect private data.
用指定的脱敏字符替换某些私密信息进行脱敏处理，来保护隐私数据。
## 简介

## 特点
1. 可以指定替换开始的位置、替换的长度、替换的字符;
2. 可以定义替换前替换后的自定义事件处理;
3. 支持销毁插件;

## Demo
demo样式见: [stringMask.js demo](http://cdn.heanes.com/js/stringMask.js/1.0/demo/ "stringMask.js demo")
<center>
<img src="https://github.com/Heanes/stringMask.js/blob/master/doc/static/image/stringMask.js_screenshot.png?raw=true" width="50%" height="50%" alt="demo截图" />
demo截图
</center>

## Usage 使用说明
stringMask.js调用很简单，只需普通jQuery插件使用的步骤即可:
### 第一步：引入js脚本

```
// jQuery库依赖
<script type="text/javascript" src="js/jquery.min.js"></script>

// stringMask.js
<script type="text/javascript" src="js/stringMask.js"></script>
```
### 第二步：调用stringMask

```
// 默认配置
$('#someStr').stringMask();

// 自定义配置
$('#someStr').stringMask({
    start:         3,           // 起始位置
    length:        4,           // 替换长度
    fromEnd:       false,       // 从头部向尾部计数
    maskSymbol:    '*',         // 替换字符
    clickToToggle: true,        // 点击切换
    $clickElement: undefined,   // 点击切换的触发元素
    onClick:       undefined,   // 点击事件
    beforeMasked:  undefined,   // 替换之前
    afterMasked:   undefined,   // 当替换之后
    beforeRecover: undefined,   // 还原之前
    afterRecover:  undefined,   // 当还原之后
    strMaskMethod: undefined    // 自定义替换算法，返回被脱敏后的数据,function(stringOrigin, options)
});
```
## License
* 本项目的所有代码按照 [MIT License](https://github.com/racaljk/hosts/blob/master/LICENSE) 发布
![img-source-from-https://github.com/docker/dockercraft](https://github.com/docker/dockercraft/raw/master/docs/img/contribute.png?raw=true)
