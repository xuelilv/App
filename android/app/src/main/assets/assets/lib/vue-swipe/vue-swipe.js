! function(t, e) { "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.VueSwipe = e() : t.VueSwipe = e() }(this, function() {
    return function(t) {
        function e(i) { if (n[i]) return n[i].exports; var a = n[i] = { exports: {}, id: i, loaded: !1 }; return t[i].call(a.exports, a, a.exports, e), a.loaded = !0, a.exports }
        var n = {};
        return e.m = t, e.c = n, e.p = "", e(0)
    }([function(t, e, n) {
        "use strict";

        function i(t) { return t && t.__esModule ? t : { default: t } }
        Object.defineProperty(e, "__esModule", { value: !0 }), e.SwipeItem = e.Swipe = void 0;
        var a = n(7),
            s = i(a),
            r = n(6),
            o = i(r);
        e.Swipe = s.default, e.SwipeItem = o.default
    }, function(t, e) {
        "use strict";
        Object.defineProperty(e, "__esModule", { value: !0 }), e.default = { name: "mt-swipe-item", mounted: function() { this.$parent && this.$parent.swipeItemCreated(this) }, destroyed: function() { this.$parent && this.$parent.swipeItemDestroyed(this) } }
    }, function(t, e, n) {
        "use strict";
        Object.defineProperty(e, "__esModule", { value: !0 });
        var i = n(4),
            a = n(3);
        e.default = {
            name: "mt-swipe",
            created: function() { this.dragState = {} },
            data: function() { return { ready: !1, dragging: !1, userScrolling: !1, animating: !1, index: 0, pages: [], timer: null, reInitTimer: null, noDrag: !1 } },
            props: { speed: { type: Number, default: 300 }, defaultIndex: { type: Number, default: 0 }, disabled: { type: Boolean, default: !1 }, auto: { type: Number, default: 3e3 }, continuous: { type: Boolean, default: !0 }, showIndicators: { type: Boolean, default: !0 }, noDragWhenSingle: { type: Boolean, default: !0 }, prevent: { type: Boolean, default: !1 }, propagation: { type: Boolean, default: !1 } },
            methods: {
                swipeItemCreated: function() {
                    var t = this;
                    this.ready && (clearTimeout(this.reInitTimer), this.reInitTimer = setTimeout(function() { t.reInitPages() }, 100))
                },
                swipeItemDestroyed: function() {
                    var t = this;
                    this.ready && (clearTimeout(this.reInitTimer), this.reInitTimer = setTimeout(function() { t.reInitPages() }, 100))
                },
                translate: function(t, e, n, a) {
                    var s = this,
                        r = arguments;
                    if (n) {
                        this.animating = !0, t.style.webkitTransition = "-webkit-transform " + n + "ms ease-in-out", setTimeout(function() { t.style.webkitTransform = "translate3d(" + e + "px, 0, 0)" }, 50);
                        var o = !1,
                            d = function() { o || (o = !0, s.animating = !1, t.style.webkitTransition = "", t.style.webkitTransform = "", a && a.apply(s, r)) };
                        (0, i.once)(t, "webkitTransitionEnd", d), setTimeout(d, n + 100)
                    } else t.style.webkitTransition = "", t.style.webkitTransform = "translate3d(" + e + "px, 0, 0)"
                },
                reInitPages: function() {
                    var t = this,
                        e = this.$children;
                    this.noDrag = 1 === e.length && this.noDragWhenSingle;
                    var n = [];
                    this.index = this.defaultIndex, e.forEach(function(e, i) { n.push(e.$el), (0, a.removeClass)(e.$el, "is-active"), i === t.defaultIndex && (0, a.addClass)(e.$el, "is-active") }), this.pages = n
                },
                doAnimate: function(t, e) {
                    var n = this;
                    if (0 !== this.$children.length && (e || !(this.$children.length < 2))) {
                        var i, s, r, o, d, l = this.speed || 300,
                            u = this.index,
                            c = this.pages,
                            h = c.length;
                        e && "goto" !== t ? (i = e.prevPage, r = e.currentPage, s = e.nextPage, o = e.pageWidth, d = e.offsetLeft) : (e = e || {}, o = this.$el.clientWidth, r = c[u], "goto" === t ? (i = e.prevPage, s = e.nextPage) : (i = c[u - 1], s = c[u + 1]), this.continuous && c.length > 1 && (i || (i = c[c.length - 1]), s || (s = c[0])), i && (i.style.display = "block", this.translate(i, -o)), s && (s.style.display = "block", this.translate(s, o)));
                        var g, f = this.$children[u].$el;
                        "prev" === t ? (u > 0 && (g = u - 1), this.continuous && 0 === u && (g = h - 1)) : "next" === t ? (u < h - 1 && (g = u + 1), this.continuous && u === h - 1 && (g = 0)) : "goto" === t && e.newIndex > -1 && e.newIndex < h && (g = e.newIndex);
                        var p = function() {
                            if (void 0 !== g) {
                                var t = n.$children[g].$el;
                                (0, a.removeClass)(f, "is-active"), (0, a.addClass)(t, "is-active"), n.index = g, n.$emit("change", g, u)
                            }
                            i && (i.style.display = ""), s && (s.style.display = "")
                        };
                        setTimeout(function() { "next" === t ? (n.translate(r, -o, l, p), s && n.translate(s, 0, l)) : "prev" === t ? (n.translate(r, o, l, p), i && n.translate(i, 0, l)) : "goto" === t ? i ? (n.translate(r, o, l, p), n.translate(i, 0, l)) : s && (n.translate(r, -o, l, p), n.translate(s, 0, l)) : (n.translate(r, 0, l, p), "undefined" != typeof d ? (i && d > 0 && n.translate(i, o * -1, l), s && d < 0 && n.translate(s, o, l)) : (i && n.translate(i, o * -1, l), s && n.translate(s, o, l))) }, 10)
                    }
                },
                next: function() { this.doAnimate("next") },
                prev: function() { this.doAnimate("prev") },
                goto: function(t) { this.index !== t && (t < this.index ? this.doAnimate("goto", { newIndex: t, prevPage: this.pages[t] }) : this.doAnimate("goto", { newIndex: t, nextPage: this.pages[t] })) },
                doOnTouchStart: function(t) {
                    if (!this.noDrag && !this.disabled) {
                        var e = this.$el,
                            n = this.dragState,
                            i = t.changedTouches ? t.changedTouches[0] : t;
                        n.startTime = new Date, n.startLeft = i.pageX, n.startTop = i.pageY, n.startTopAbsolute = i.clientY, n.pageWidth = e.offsetWidth, n.pageHeight = e.offsetHeight;
                        var a = this.$children[this.index - 1],
                            s = this.$children[this.index],
                            r = this.$children[this.index + 1];
                        this.continuous && this.pages.length > 1 && (a || (a = this.$children[this.$children.length - 1]), r || (r = this.$children[0])), n.prevPage = a ? a.$el : null, n.dragPage = s ? s.$el : null, n.nextPage = r ? r.$el : null, n.prevPage && (n.prevPage.style.display = "block"), n.nextPage && (n.nextPage.style.display = "block")
                    }
                },
                doOnTouchMove: function(t) {
                    if (!this.noDrag && !this.disabled) {
                        var e = this.dragState,
                            n = t.changedTouches ? t.changedTouches[0] : t;
                        e.currentLeft = n.pageX, e.currentTop = n.pageY, e.currentTopAbsolute = n.clientY;
                        var i = e.currentLeft - e.startLeft,
                            a = e.currentTopAbsolute - e.startTopAbsolute,
                            s = Math.abs(i),
                            r = Math.abs(a);
                        if (s < 5 || s >= 5 && r >= 1.73 * s) return void(this.userScrolling = !0);
                        this.userScrolling = !1, t.preventDefault(), i = Math.min(Math.max(-e.pageWidth + 1, i), e.pageWidth - 1);
                        var o = i < 0 ? "next" : "prev";
                        e.prevPage && "prev" === o && this.translate(e.prevPage, i - e.pageWidth), this.translate(e.dragPage, i), e.nextPage && "next" === o && this.translate(e.nextPage, i + e.pageWidth)
                    }
                },
                doOnTouchEnd: function() {
                    if (!this.noDrag && !this.disabled) {
                        var t = this.dragState,
                            e = new Date - t.startTime,
                            n = null,
                            i = t.currentLeft - t.startLeft,
                            a = t.currentTop - t.startTop,
                            s = t.pageWidth,
                            r = this.index,
                            o = this.pages.length;
                        if (e < 300) {
                            var d = Math.abs(i) < 5 && Math.abs(a) < 5;
                            (isNaN(i) || isNaN(a)) && (d = !0), d && this.$children[this.index].$emit("tap")
                        }
                        e < 300 && void 0 === t.currentLeft || ((e < 300 || Math.abs(i) > s / 2) && (n = i < 0 ? "next" : "prev"), this.continuous || (0 === r && "prev" === n || r === o - 1 && "next" === n) && (n = null), this.$children.length < 2 && (n = null), this.doAnimate(n, { offsetLeft: i, pageWidth: t.pageWidth, prevPage: t.prevPage, currentPage: t.dragPage, nextPage: t.nextPage }), this.dragState = {})
                    }
                },
                dragStartEvent: function(t) { this.prevent && t.preventDefault(), this.animating || (this.dragging = !0, this.userScrolling = !1, this.doOnTouchStart(t)) },
                dragMoveEvent: function(t) { this.dragging && this.doOnTouchMove(t) },
                dragEndEvent: function(t) { return this.userScrolling ? (this.dragging = !1, void(this.dragState = {})) : void(this.dragging && (this.doOnTouchEnd(t), this.dragging = !1)) }
            },
            destroyed: function() { this.timer && (clearInterval(this.timer), this.timer = null), this.reInitTimer && (clearTimeout(this.reInitTimer), this.reInitTimer = null) },
            mounted: function() {
                var t = this;
                this.ready = !0, this.auto > 0 && (this.timer = setInterval(function() { t.dragging || t.animating || t.next() }, this.auto)), this.reInitPages();
                var e = this.$el;
                e.addEventListener("touchstart", function(e) { t.prevent && e.preventDefault(), t.propagation && e.stopPropagation(), t.animating || (t.dragging = !0, t.userScrolling = !1, t.doOnTouchStart(e)) }), e.addEventListener("touchmove", function(e) { t.dragging && t.doOnTouchMove(e) }), e.addEventListener("touchend", function(e) { return t.userScrolling ? (t.dragging = !1, void(t.dragState = {})) : void(t.dragging && (t.doOnTouchEnd(e), t.dragging = !1)) }), e.addEventListener("touchstart", this.dragStartEvent), e.addEventListener("touchmove", this.dragMoveEvent), e.addEventListener("touchend", this.dragEndEvent), e.addEventListener("mousedown", this.dragStartEvent), e.addEventListener("mousemove", this.dragMoveEvent), e.addEventListener("mouseup", this.dragEndEvent)
            }
        }
    }, function(t, e) {
        "use strict";
        var n = function(t) { return (t || "").replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, "") },
            i = function(t, e) { if (!t || !e) return !1; if (e.indexOf(" ") != -1) throw new Error("className should not contain space."); return t.classList ? t.classList.contains(e) : (" " + t.className + " ").indexOf(" " + e + " ") > -1 },
            a = function(t, e) {
                if (t) {
                    for (var n = t.className, a = (e || "").split(" "), s = 0, r = a.length; s < r; s++) {
                        var o = a[s];
                        o && (t.classList ? t.classList.add(o) : i(t, o) || (n += " " + o))
                    }
                    t.classList || (t.className = n)
                }
            },
            s = function(t, e) {
                if (t && e) {
                    for (var a = e.split(" "), s = " " + t.className + " ", r = 0, o = a.length; r < o; r++) {
                        var d = a[r];
                        d && (t.classList ? t.classList.remove(d) : i(t, d) && (s = s.replace(" " + d + " ", " ")))
                    }
                    t.classList || (t.className = n(s))
                }
            };
        t.exports = { hasClass: i, addClass: a, removeClass: s }
    }, function(t, e) {
        "use strict";
        var n = function() { return document.addEventListener ? function(t, e, n) { t && e && n && t.addEventListener(e, n, !1) } : function(t, e, n) { t && e && n && t.attachEvent("on" + e, n) } }(),
            i = function() { return document.removeEventListener ? function(t, e, n) { t && e && t.removeEventListener(e, n, !1) } : function(t, e, n) { t && e && t.detachEvent("on" + e, n) } }(),
            a = function(t, e, a) {
                var s = function n() { a && a.apply(this, arguments), i(t, e, n) };
                n(t, e, s)
            };
        t.exports = { on: n, off: i, once: a }
    }, function(t, e) {}, function(t, e, n) {
        var i, a;
        i = n(1);
        var s = n(8);
        a = i = i || {}, "object" != typeof i.default && "function" != typeof i.default || (a = i = i.default), "function" == typeof a && (a = a.options), a.render = s.render, a.staticRenderFns = s.staticRenderFns, t.exports = i
    }, function(t, e, n) {
        var i, a;
        n(5), i = n(2);
        var s = n(9);
        a = i = i || {}, "object" != typeof i.default && "function" != typeof i.default || (a = i = i.default), "function" == typeof a && (a = a.options), a.render = s.render, a.staticRenderFns = s.staticRenderFns, t.exports = i
    }, function(t, e) {
        t.exports = {
            render: function() {
                var t = this,
                    e = t.$createElement,
                    n = t._self._c || e;
                return n("div", { staticClass: "mint-swipe-item" }, [t._t("default")], 2)
            },
            staticRenderFns: []
        }
    }, function(t, e) {
        t.exports = {
            render: function() {
                var t = this,
                    e = t.$createElement,
                    n = t._self._c || e;
                return n("div", { staticClass: "mint-swipe" }, [n("div", { ref: "wrap", staticClass: "mint-swipe-items-wrap" }, [t._t("default")], 2), t._v(" "), n("div", { directives: [{ name: "show", rawName: "v-show", value: t.showIndicators, expression: "showIndicators" }], staticClass: "mint-swipe-indicators" }, t._l(t.pages, function(e, i) { return n("div", { key: i, staticClass: "mint-swipe-indicator", class: { "is-active": i === t.index } }) }))])
            },
            staticRenderFns: []
        }
    }])
});