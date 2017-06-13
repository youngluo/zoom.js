var windowWidth = function windowWidth() {
    return document.documentElement.clientWidth;
};
var windowHeight = function windowHeight() {
    return document.documentElement.clientHeight;
};

var elemOffset = function elemOffset(elem) {
    var rect = elem.getBoundingClientRect();
    var docElem = document.documentElement;
    var win = window;
    return {
        top: rect.top + win.pageYOffset - docElem.clientTop,
        left: rect.left + win.pageXOffset - docElem.clientLeft
    };
};

var once = function once(elem, type, handler) {
    var fn = function fn(e) {
        e.target.removeEventListener(type, fn);
        handler();
    };
    elem.addEventListener(type, fn);
};

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ZoomImage = function () {
    function ZoomImage(img, offset) {
        _classCallCheck(this, ZoomImage);

        this.img = img;
        this.preservedTransform = img.style.transform;
        this.wrap = null;
        this.overlay = null;
        this.offset = offset;
    }

    _createClass(ZoomImage, [{
        key: "forceRepaint",
        value: function forceRepaint() {
            var _ = this.img.offsetWidth;
            return;
        }
    }, {
        key: "zoom",
        value: function zoom() {
            this.wrap = document.createElement("div");
            this.wrap.classList.add("zoom-img-wrap");
            this.img.parentNode.insertBefore(this.wrap, this.img);
            this.wrap.appendChild(this.img);

            this.img.classList.add("zoom-img");
            this.img.setAttribute("data-action", "zoom-out");

            this.overlay = document.createElement("div");
            this.overlay.classList.add("zoom-overlay");
            document.body.appendChild(this.overlay);

            this.forceRepaint();
            var scale = this.calculateScale();

            this.forceRepaint();
            this.animate(scale);

            document.body.classList.add("zoom-overlay-open");
        }
    }, {
        key: "calculateScale",
        value: function calculateScale() {
            var viewportWidth = windowWidth() - this.offset;
            var viewportHeight = windowHeight() - this.offset;

            var imageAspectRatio = this.img.width / this.img.height;
            var viewportAspectRatio = viewportWidth / viewportHeight;

            if (imageAspectRatio < viewportAspectRatio) {
                return viewportHeight / this.img.height;
            } else {
                return viewportWidth / this.img.width;
            }
        }
    }, {
        key: "animate",
        value: function animate(scale) {
            var imageOffset = elemOffset(this.img);
            var scrollTop = window.pageYOffset;

            var viewportX = windowWidth() / 2;
            var viewportY = scrollTop + windowHeight() / 2;

            var imageCenterX = imageOffset.left + this.img.width / 2;
            var imageCenterY = imageOffset.top + this.img.height / 2;

            var tx = viewportX - imageCenterX;
            var ty = viewportY - imageCenterY;
            var tz = 0;

            var imgTr = "scale(" + scale + ")";
            var wrapTr = "translate3d(" + tx + "px, " + ty + "px, " + tz + "px)";

            this.img.style.transform = imgTr;
            this.wrap.style.transform = wrapTr;
        }
    }, {
        key: "dispose",
        value: function dispose() {
            if (this.wrap == null || this.wrap.parentNode == null) {
                return;
            }
            this.img.classList.remove("zoom-img");
            this.img.setAttribute("data-action", "zoom");

            this.wrap.parentNode.insertBefore(this.img, this.wrap);
            this.wrap.parentNode.removeChild(this.wrap);

            document.body.removeChild(this.overlay);
            document.body.classList.remove("zoom-overlay-transitioning");
        }
    }, {
        key: "close",
        value: function close() {
            var _this = this;

            document.body.classList.add("zoom-overlay-transitioning");
            this.img.style.transform = this.preservedTransform;
            if (this.img.style.length === 0) {
                this.img.removeAttribute("style");
            }
            this.wrap.style.transform = "none";

            once(this.img, "transitionend", function () {
                _this.dispose();
                // XXX(nishanths): remove class should happen after dispose. Otherwise,
                // a new click event could fire and create a duplicate ZoomImage for
                // the same <img> element.
                document.body.classList.remove("zoom-overlay-open");
            });
        }
    }]);

    return ZoomImage;
}();

var current = null;
var offset = 80;
var initialScrollPos = -1;
var initialTouchPos = -1;

var setup = function setup(elem) {
    elem.addEventListener("click", prepareZoom);
};

var prepareZoom = function prepareZoom(e) {
    if (document.body.classList.contains("zoom-overlay-open")) {
        return;
    }

    if (e.metaKey || e.ctrlKey) {
        window.open(e.target.getAttribute("data-original") || e.target.src, "_blank");
        return;
    }

    if (e.target.width >= windowWidth() - offset) {
        return;
    }

    closeCurrent(true);

    current = new ZoomImage(e.target, offset);
    current.zoom();

    addCloseListeners();
};

var closeCurrent = function closeCurrent(force) {
    if (current == null) {
        return;
    }
    if (force) {
        current.dispose();
    } else {
        current.close();
    }
    removeCloseListeners();
    current = null;
};

var addCloseListeners = function addCloseListeners() {
    document.addEventListener("scroll", handleScroll);
    document.addEventListener("keyup", handleKeyup);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("click", handleClick, true);
};

var removeCloseListeners = function removeCloseListeners() {
    document.removeEventListener("scroll", handleScroll);
    document.removeEventListener("keyup", handleKeyup);
    document.removeEventListener("touchstart", handleTouchStart);
    document.removeEventListener("click", handleClick, true);
};

var handleScroll = function handleScroll() {
    if (initialScrollPos == -1) {
        initialScrollPos = window.pageYOffset;
    }

    var deltaY = Math.abs(initialScrollPos - window.pageYOffset);
    if (deltaY >= 40) {
        closeCurrent();
    }
};

var handleKeyup = function handleKeyup(e) {
    if (e.keyCode == 27) {
        closeCurrent();
    }
};

var handleTouchStart = function handleTouchStart(e) {
    var t = e.touches[0];
    if (t == null) {
        return;
    }

    initialTouchPos = t.pageY;
    e.target.addEventListener("touchmove", handleTouchMove);
};

var handleTouchMove = function handleTouchMove(e) {
    var t = e.touches[0];
    if (t == null) {
        return;
    }

    if (Math.abs(t.pageY - initialTouchPos) > 10) {
        closeCurrent();
        e.target.removeEventListener("touchmove", handleTouchMove);
    }
};

var handleClick = function handleClick() {
    closeCurrent();
};

var zoom = Object.create(null);
zoom.setup = setup;

export default zoom;
