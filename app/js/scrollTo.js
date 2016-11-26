/**
 * Created by Administrator on 2016/11/26.
 */
var addEvent = require('./EventListener');

(function () {
    function getElementByAttr(tag,attr,value) {
        var aElements = document.getElementsByTagName(tag);
        var aEle = [];
        for (var i = 0; i < aElements.length; i++) {
            if (value == null) {
                if (aElements[i].getAttribute(attr) !== null) {
                    aEle.push(aElements[i]);
                }
            }else {
                if (aElements[i].getAttribute(attr) == value) {
                    aEle.push(aElements[i]);
                }
            }
        }
        return aEle;
    }

    var scroll = getElementByAttr('*', 'scroll');
    if (typeof scroll === 'object') {
        for (var i = 0; i < scroll.length; i++) {
            addEvent(scroll[i], 'click', function (e) {
                var that = null;
                // 解决IE8 this指针指向window.event(不是触发的元素)问题
                // 解决IE8 无法preventDefault()方法禁止默认行为
                try {
                    e.preventDefault();
                    that = this;
                } catch (e) {
                    window.event.returnValue = false;
                    that = window.event.srcElement;
                }

                var name = that.getAttribute('scroll');
                var target = document.getElementById(name)
                var pos = target.offsetTop - target.style.padding;
                var nav = document.getElementsByTagName('nav')[0].offsetHeight;

                smoothScroll(pos, nav)
            })
        }
    }

    var time = null;
    var timeNum = 20;
    var smoothScroll = function (target, height) {
        clearInterval(time);
        var scrollTop = window.pageYOffset  //用于FF
        || document.documentElement.scrollTop
        || document.body.scrollTop
        || 0;

        if (scrollTop < target) {
            time = setInterval(function () {
                if (scrollTop > target - height) {
                    clearInterval(time);
                }
                scrollTop += 30;
                window.scrollTo(0, scrollTop);
            }, timeNum);
        }else if (scrollTop > target) {
            time = setInterval(function () {
                if (scrollTop < target) {
                    clearInterval(time);
                }
                scrollTop -= 30;
                window.scrollTo(0, scrollTop);
            }, timeNum);
        }
    }

})();
