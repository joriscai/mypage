/**
 * Created by joriscai on 2016/11/25.
 */
var addEvent = require('./EventListener');

// nav layout
var nav = document.getElementsByTagName('nav')[0];
var header = document.getElementsByTagName('header')[0];
var navPos = header.offsetHeight
            - nav.offsetHeight;
var clsName = 'navFixed';
// 判断是否有该类选择器
function hasClass(obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

addEvent(window, 'scroll', function () {
    // 解决scrollTop兼容问题
    var scrollTop = window.pageYOffset  //用于FF
        || document.documentElement.scrollTop
        || document.body.scrollTop
        || 0;

    var scrollH = scrollTop;

    if (scrollH > navPos) {
        var oClass = nav.className;
        var blank = (oClass != '') ? ' ' : '';
        if (!hasClass(nav, clsName)) {
            header.style.marginBottom = nav.offsetHeight + 'px';
            nav.className = oClass + blank + clsName;
        }
    }else if (scrollH < navPos) {
        var oClass = nav.className;
        if (hasClass(nav, clsName)) {
            var reg = new RegExp('(\\s|^)' + clsName + '(\\s|$)');
            nav.className = nav.className.replace(reg, '');
            header.style.marginBottom = null
        }
    }
});
