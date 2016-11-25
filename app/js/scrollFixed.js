// nav layout
var nav = document.getElementsByTagName('nav')[0];
var navPos = document.getElementsByTagName('header')[0].offsetHeight
            - nav.offsetHeight;
var clsName = 'navFixed';
// 判断是否有该类选择器
function hasClass(obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

document.addEventListener('scroll', function () {
    var scrollH = this.body.scrollTop;
    if (scrollH > navPos) {
        var oClass = nav.className;
        var blank = (oClass != '') ? ' ' : '';
        if (!hasClass(nav, clsName)) {
            nav.className = oClass + blank + clsName;
        }
    }else if (scrollH < navPos) {
        var oClass = nav.className;
        if (hasClass(nav, clsName)) {
            var reg = new RegExp('(\\s|^)' + clsName + '(\\s|$)');
            nav.className = nav.className.replace(reg, '');
        }
    }
});
