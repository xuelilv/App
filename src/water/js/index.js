define(['text!../html/control.html', 'text!../html/markings.html'], function(tpl, markings) {
    var ws = undefined,
        work = undefined;
    var controlEl = "",
        did = "",
        inter = null,
        data = null;
    var loc = window.localStorage;
    var TEMPANDTEXT = {
        "0": "常温",
        "40": "可冲牛奶",
        "60": "可冲蜂蜜",
        "90": "可冲咖啡",
        "99": "可冲茶"
    };
    var level = function(v) {
        if (v > 100) {
            return '差';
        } else if (60 < v && v <= 100) {
            return '中';
        } else if (30 < v && v <= 60) {
            return '良';
        } else {
            return '优';
        }
    };
    var __extends = this.__extends || function(d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p)) d[p] = b[p];

        function __() {
            this.constructor = d;
        }
        __.prototype = b.prototype;
        d.prototype = new __();
    };
    var Per = (function(_$) {
        function Per(id, endToStart) {
            this.elHeight = parseFloat(_$("#" + id).css('height'));
            this.bodyWidth = document.body.clientWidth;
            this.id = id;
            this.endToStart = endToStart;
            this.arcR = .75 * this.bodyWidth / 2;
            if (this.arcR < (endToStart / 2)) {
                this.arcR = endToStart / 2 + 1;
            }
            this.angle = Per.radianToAngle(Math.acos(endToStart / 2 / this.arcR));
            this.vertical = Math.sqrt(this.arcR * this.arcR - (endToStart / 2) * (endToStart / 2));
            this.dec = {
                x: this.bodyWidth / 2,
                y: this.elHeight * .95 - this.vertical
            };
        }
        Per.getAirPoint = function(arcX, arcY, arcR, angle) {
            return {
                x: arcX + Math.sin(2 * Math.PI / 360 * angle) * arcR,
                y: arcY + Math.cos(2 * Math.PI / 360 * angle) * arcR
            };
        };
        Per.radianToAngle = function(radian) {
            return radian * 360 / (2 * Math.PI);
        };
        Per.prototype.getPos = function(angle) {
            return Per.getAirPoint(this.dec.x, this.dec.y, this.arcR, angle);
        };
        Per.prototype.getPerimeter = function(angle, arcR) {
            return (angle * Math.PI * arcR) / 180;
        };
        return Per;
    })(Zepto);
    var ControlPer = (function(_super, _$) {
        __extends(ControlPer, _super);

        function ControlPer(id, endToStart, dataSet) {
            console.log(dataSet.tdsVal);
            _super.call(this, id, endToStart);
            this.innerCir = document.getElementById("innerCir");
            this.innerArcTotPer = this.getPerimeter(240, this.arcR);
            this.per = this.innerArcTotPer / 100;
            this.init = 0;
            this.dataArr = [0];
            this.isLock = false;
            var obj = this.getPos(180),
                objStart = this.getPos(300),
                objEnd = this.getPos(60),
                x = obj.x,
                y = obj.y,
                width = this.arcR * 2 - 10,
                dip = width / 234.638,
                template = _.template(markings);
            var data = {
                width: this.bodyWidth,
                height: this.elHeight,
                cx: this.dec.x,
                cy: this.dec.y,
                r: this.arcR,
                translateX: -(243.5 * dip - x),
                translateY: -(139 * dip - y - 10),
                scaleX: width / 234.638,
                scaleY: width / 234.638,
                infoX: this.dec.x,
                infoY: this.dec.y - 50,
                infoTxt: dataSet.infoTxt,
                tempX: this.dec.x - 10,
                tempY: this.dec.y + 20,
                tempVal: dataSet.tempVal,
                signalX: this.dec.x + 60,
                signalY: this.dec.y - 20,
                tdsX: this.dec.x,
                tdsY: this.dec.y + 60,
                tdsVal: dataSet.tdsVal,
                TDSIn: dataSet.TDSIn,
                level: dataSet.level,
                rectX: this.dec.x - 60,
                rectY: this.dec.y + 70,
                startX: objStart.x,
                startY: objStart.y,
                endX: objEnd.x,
                endY: objEnd.y,
                perimeter: this.innerArcTotPer
            };
            _$("#" + id).html(template(data));
            this.setEvent();
        }
        ControlPer.prototype.animation = function(percent) {
            if (this.isLock) {
                return false;
            }
            this.dataArr.push(percent);
            var len = this.dataArr.length;
            if (len > 2) {
                this.dataArr.shift();
            }
            var _this = this;
            var tot = this.per * percent;
            var animation = function() {
                if (_this.dataArr[1] < _this.dataArr[0]) {
                    _this.init -= _this.per;
                } else if (_this.dataArr[1] > _this.dataArr[0]) {
                    _this.init += _this.per;
                }
                this.innerCir.style.strokeDashoffset = _this.innerArcTotPer - _this.init;
            };
            requestAnimationFrame(function() {
                animation(_this.init);
                if (_this.dataArr[1] < _this.dataArr[0]) {
                    if (_this.init > tot) {
                        requestAnimationFrame(arguments.callee);
                        _this.isLock = true;
                    } else {
                        _this.isLock = false;
                    }
                } else if (_this.dataArr[1] > _this.dataArr[0]) {
                    if (_this.init < tot) {
                        requestAnimationFrame(arguments.callee);
                        _this.isLock = true;
                    } else {
                        _this.isLock = false;
                    }
                }
            });
        };
        ControlPer.prototype.setData = function(did, temp, per) {
            var _this = this;
            var _tempEl = document.getElementById("TempSet");
            if (did !== undefined && temp !== undefined) {
                // $.ajax({
                //     url: "api/purifictionWork",
                //     type: "POST",
                //     data: {
                //         clientId: App.getClientId(),
                //         purifierId: did,
                //         tempSet: temp
                //     },
                //     async: true,
                //     success: function(res) {
                //         if (res.responseCode == 200) {
                //             App.closeToast();
                //             _this.animation(per);
                //             _$("#txt_mark").text(TEMPANDTEXT[temp]);
                //             _tempEl.textContent = temp;
                //         } else {
                //             App.closeToast();
                //             App.showDia("alertDia animated bounceIn", "设备异常！");
                //             _$("#" + _tempEl.textContent + "Img").css("display", "block").siblings().css("display", "none");
                //         }
                //     }
                // });
            }
        };
        ControlPer.prototype.hightLightPoint = function(temp) {
            _$("#" + temp + "Img").css("display", "block").siblings().css("display", "none");
            _$(".mark").css("display", "block");
            _$("#" + temp + "R").css("display", "none");
        };
        ControlPer.prototype.setEvent = function() {
            var tempText = _$(".tempText");
            var _this = this;
            var fn = function(e) {
                var temp = _$(this).attr("data-temp");
                var per = _$(this).attr("data-per");
                _this.hightLightPoint(temp);
                App.showToast(0);
                _this.setData(did, temp, parseInt(per, 10));
                e.preventDefault();
            };
            if ($(".headWrap").hasClass("lock")) {
                tempText.off("tap");
            } else {
                tempText.on("tap", fn);
            }
        };
        return ControlPer;
    })(Per, Zepto);
    App.Models.Index = Backbone.Model.extend({
        id: 'index',
        url: App.BaseUrl + 'api/MyPurification'
    });
    data = new App.Models.Index;
    App.Views.Index = Backbone.View.extend({
        model: data,
        el: '#views',
        template: _.template(tpl),
        warnArr: [],
        fixInter: null,
        events: {
            "tap .deviceName": "nav",
            "tap #state": "navHealth"
        },
        initialize: function() {
            var _this = this;
            $("#DialogConfirm").hide();
            // data.fetch({
            //     success: function(m) {
            //         data = m;
            //         App.closeToast();
            //         _this.render();
            //     }
            // });
            App.closeToast();
            _this.render();
            this.setLoc();
        },
        setLoc: function() {
            // $.ajax({
            //     url: App.BaseUrl + 'api/getPurificationList',
            //     type: 'POST',
            //     data: { 'clientId': App.getClientId() },
            //     async: true,
            //     success: function(res) {
            //         if (res !== null) {
            //             console.log(res);
            //             if (res.responseCode == "200") {
            //                 loc.setItem("list", JSON.stringify(res));
            //             } else { //如果responseCode不是200则跳到绑定提醒页
            //                 // Backbone.history.navigate("noBind", {
            //                 //     trigger: true,
            //                 //     replace: false
            //                 // });
            //             }
            //         }
            //     }
            // });
        },
        render: function() {
            var json = { id: 1, isOnline: 'y', signal: 3, TDSIn: 200, TDSOut: 80, dayWater: 300, tempSet: 50, name: '测试' };
            App.selectedDevice = json;
            this.$el.html(this.template(json));
            controlEl = $("#control");
            did = controlEl.attr("data-did");
            this.txt1 = document.getElementById("txt1");
            this.Alert = $("#Alert");
            this.Chart = new ControlPer('waterChart', 0, {
                infoTxt: '当前水质TDS', //TEMPANDTEXT[json.tempSet],
                tempVal: json.isOnline == 'y' ? json.TDSIn : "--",
                tdsVal: json.isOnline == 'y' ? json.TDSOut : "--",
                TDSIn: json.isOnline == 'y' ? json.TDSIn : "--",
                level: json.isOnline == 'y' ? level(json.TDSOut) : "-"
            });
            this.Chart.hightLightPoint(json.tempSet);
            this.Chart.animation(json.tempSet || 0);
            this.setWebSocket();
            return this;
        },
        setWebSocket: function() {
            var _this = this;
            if (WebSocket) {
                // ws = new WebSocket('ws://rinland.xtremeprog.com:18040/wechat/send.ws/' + did);
                // ws.onopen = function() {
                //     console.log('open');
                //     ws.send(did);
                // };
                // ws.onmessage = function(e) {
                //     console.log('message', e.data);
                //     /*var pushData = JSON.parse(e.data),
                //         isChange = pushData.needChange;
                //     if(isChange == "y"){
                //         _this.setWarn(pushData);
                //     }else{
                //         if(inter !== null){
                //             clearInterval(inter);
                //             _this.Alert.hide();
                //         }
                //     }*/
                //     _this.setWarn(e.data);
                //     // ws.close();
                // };
                // ws.onclose = function() {
                //     console.log('close');
                // };
                // ws.onerror = function(evt) {
                //     console.log("error");
                // };
            } else {
                if (typeof(window.Worker) !== "undefined") {
                    if (typeof(work) == "undefined") {
                        work = new Worker("js/socketWork.js");
                        work.postMessage({ "url": App.BaseUrl, "clientId": App.getClientId() });
                        work.onmessage = function(event) {
                            console.log(event.data);
                        };
                    }
                } else {
                    this.fixInter = setInterval(function() {
                        $.ajax({
                            url: App.BaseUrl + "api/MyPurification",
                            type: "POST",
                            data: { 'clinetId:': App.getClientId },
                            async: true,
                            success: function(res) {
                                //postMessage(res);
                            }
                        });

                    }, 60000);
                }
            }
        },
        clearFixInter: function() {
            if (this.fixInter !== null) {
                clearInterval(this.fixInter);
            }
        },
        setWarn: function(data) {
            /*var arr = [];
            for (var i = 1; i <= 4; i++) {
                if (data.hasOwnProperty("filterSurplusWater" + i) && data["filterSurplusWater" + i] < 40) {
                    arr.push(i);
                }
            }
            var len = arr.length,
                str = "";
            if (data.hasOwnProperty("alarm4") && (data.alarm4 == "0")) {
                this.warnArr.push("水箱缺水！");
            }
            if (len > 0) {
                for (var k = 0; k < len; k++) {
                    str += arr[k] + "、"
                }
                this.warnArr.push("滤芯健康状态：" + str.substring(0, str.length - 1) + "号滤芯剩余净水量为10%，请及时更换");
            }*/
            if (data == "over") {
                return;
            }
            this.warnArr.push(data);
            if (this.warnArr.length > 0) {
                this.Alert.show();
                this.txt1.innerText = this.warnArr[1];
                this.animation();
            } else {
                this.Alert.hide();
            }
        },
        animation: function() {
            var _this = this;
            var alertEl = document.getElementById("txtAn"),
                offsetH = parseInt(alertEl.offsetHeight, 10),
                len = this.warnArr.length,
                cou = 0,
                i = 0;
            var fn = function() {
                cou += offsetH;
                _this.txt1.innerHTML = _this.warnArr[i++];
                if (i == 1) {
                    _this.Alert.addClass("waterWarn");
                } else {
                    _this.Alert.removeClass("waterWarn");
                }
                alertEl.style.webkitTransform = "translate(0,-" + cou + "px) translateZ(0)";
                alertEl.style.webkitTransitionDuration = "2000ms";
                alertEl.style.webkitTransitionTimingFunction = "cubic-bezier(0.1, 0.57, 0.1, 1)";
                _this.txt1.style.webkitTransform = "translate(0," + cou + "px) translateZ(0)";
            };

            function setInter() {
                inter = setInterval(function() {
                    fn();
                    if (cou > (len - 1) * offsetH) {
                        i = 0;
                        cou = 0;
                    }
                }, 3000);
            }
            setInter();
        },
        nav: function(e) {
            var locList = { result: [{ id: 1, name: '测试' }, { id: 2, name: '测试' }] };
            var nav = (locList.result.length > 1 ? "personal" : "detail");
            Backbone.history.navigate("/" + nav, {
                trigger: true,
                replace: false
            });
            this.Chart = null;
            this.clearFixInter();
            e.preventDefault();
        },
        navHealth: function(e) {
            var json = this.model.toJSON();
            if (json.isOnline == 'y') {
                Backbone.history.navigate("/health", {
                    trigger: true,
                    replace: false
                });
                this.Chart = null;
                this.clearFixInter();
                e.preventDefault();
            } else {
                App.showDia("alertDia animated bounceIn", "设备不在线！");
                return false;
            }
        },
        navWater: function(e) {
            Backbone.history.navigate("/history", {
                trigger: true,
                replace: false
            });
            this.Chart = null;
            this.clearFixInter();
            e.preventDefault();
        }
    });

    var controller = function() {
        var View = new App.Views.Index();
        controller.onRouteChange = function() {
            View.undelegateEvents();
        }
    };
    loc.setItem("clientId", App.getClientId());
    return {
        data: data,
        controller: controller
    };
});