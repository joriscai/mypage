/**
 * Created by joriscai on 2016/11/26.
 */
var addEvent = function (element, type, handler) {
    if (element.addEventListener) {
        element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + type, handler);
    } else {
        element["on" + type] = handler;
    }
}

module.exports = addEvent;