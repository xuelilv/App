define(['text!../html/historyRecord.html', 'highChartFix', 'highchart', 'chartsConfig'], function(html, frame, highchart, chartsConfig) {
    var historyModel = Backbone.Model.extend({
        url: App.BaseUrl + "api/client/getDayWaterInfo"
    });

    var historyView = Backbone.View.extend({
        el: "#views",
        k: 3,
        time: 0,
        startX: 0,
        endX: 0,
        data: 0,
        h: 0,
        endTimeDay: '',
        initData: 0,
        endTime: [],
        template: _.template(html),
        events: {
            "click .record_btn": "history",
            "click .dates": "dates",
            "click .months": "months",
            'touchstart .chartDraw': "chartDrawStart",
            'touchend .chartDraw': "chartDrawEnd"
        },

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.model.fetch({
                success: function() {
                    App.closeToast();
                }
            });
        },

        render: function() {
            this.data = this.initData = this.model.toJSON();
            this.$el.html(this.template(this.model.toJSON()));
            $(".total_water li").css("lineHeight", ($(".total_water li").height() / 16) * 100 + 20 + "%")
            this.dataLine();
        },

        // 获取数据点
        getDayArray: function(type) {
            var data = {};
            var time = [];
            var list = [];
            var newTime = [];
            var firstDay = '';
            var endDay = '';

            type == 'day' ? data = this.data.dayData : data = this.data.monData;

            for (var item in data) {
                time.push(item);
            }

            time = time.sort();

            for (var i = 0; i < time.length; i++) {
                if (i == 0) {
                    firstDay = time[i];
                }
                endDay = time[i];
                list.push(data[time[i]]);
                newTime.push(time[i].substr(7, 2));
            }
            this.endTimeDay = endDay;
            this.showTime(type, endDay);
            return {
                'time': newTime,
                'list': list,
                'firstDay': firstDay.substr(1, 4) + "-" + firstDay.substr(5, 2) + "-" + firstDay.substr(7, 2),
                'endDay': endDay.substr(1, 4) + "-" + endDay.substr(5, 2) + "-" + endDay.substr(7, 2)
            }
        },

        //显示年月份
        showTime: function(type, date) {
            if (type == 'month') {
                $(".chockTime").html(date.substr(1, 4) + "年" + date.substr(5, 2) + "月")
            } else {
                var time = new Date();
                var yyy = time.getFullYear();
                var mm = time.getMonth() + 1;
                $(".chockTime").html(yyy + "年" + mm + "月")
            }
        },


        //显示月份数据
        chartDrawStart: function(e) {
            this.startX = e.changedTouches[0].clientX;
            e.preventDefault();
        },

        //左滑和右滑的事件
        chartDrawEnd: function(e) {
            this.endX = e.changedTouches[0].clientX;
            var distance = this.endX - this.startX;

            if (!$(".dates").hasClass("on") && Math.abs(distance) > 38) {
                if (distance > 0) {
                    this.k--;
                    this.k == 0 ? this.pre_data() : this.monthDraw();
                } else {
                    if (this.endTimeDay.replace(/d/g, '') == this.currTime() && this.k == 3) {
                        return;
                    }
                    this.k++;
                    this.k == 4 ? this.next_data() : this.monthDraw();
                }
            }
            e.preventDefault();
        },

        //在月的状态下，左滑
        pre_data: function() {
            var dayDataPre = this.getDayArray('month');
            var firstDay = dayDataPre.firstDay;
            var clientId = window.localStorage.getItem("clientId");

            if (this.k == 0) {
                var data = {
                    "clientId": clientId,
                    "day": firstDay
                };
                this.pre_data_ajax(data);
                this.k = 3;
            }
        },

        pre_data_ajax: function(data) {
            var _this = this;
            $.ajax({
                url: App.BaseUrl + "api/client/getMonData",
                async: true,
                type: "post",
                data: data,
                success: function(data) {
                    if (data.responseCode == 200) {
                        _this.data = data;
                        _this.monthDraw();
                    }
                }
            })
        },

        //在月的状态下，右滑
        next_data: function() {
            var endTime = this.endTimeDay;
            var clientId = window.localStorage.getItem("clientId");
            var year = parseInt(endTime.substr(1, 4))
            var month = parseInt(endTime.substr(5, 2)) - 1;
            var day = parseInt(endTime.substr(7, 2));

            if (month < 10) month = '0' + month;
            var newDay = new Date(year, month, (day + 29));

            if (this.k == 4) {
                var data = {
                    "clientId": clientId,
                    "day": this.todate(newDay)
                };
                this.pre_data_ajax(data);
                this.k = 1;
            }
        },

        currTime: function() {
            var date = new Date();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();
            var day = date.getDate();
            if (month < 10) month = '0' + month;
            var nowDate = year + '' + month + '' + day;
            return nowDate;
        },

        todate: function(num) {
            num = num + "";
            var date = "";
            var month = new Array();
            month["Jan"] = 1;
            month["Feb"] = 2;
            month["Mar"] = 3;
            month["Apr"] = 4;
            month["May"] = 5;
            month["Jun"] = 6;
            month["Jul"] = 7;
            month["Aug"] = 8;
            month["Sep"] = 9;
            month["Oct"] = 10;
            month["Nov"] = 11;
            month["Dec"] = 12;
            str = num.split(" ");
            date = str[3] + "-";
            if (month[str[1]] < 10) {
                month[str[1]] = '0' + month[str[1]];
            }
            date = date + month[str[1]] + "-" + str[2];
            return date;
        },

        //点击月的按钮时
        months: function(el) {
            if (!$(".months").hasClass("on")) {
                $(".dates").removeClass("on");
                $(".months").addClass("on");
                $(".DayMonth_title").text("每月净水量");
                this.monthDraw();
            }
        },

        // 绘制月的数据
        monthDraw: function() {
            var data = this.getDayArray('month');
            var list = data.list.slice((this.k - 1) * 10, this.k * 10);
            var time = data.time.slice((this.k - 1) * 10, this.k * 10);

            chartsConfig.init(time, list)
        },

        //显示日的数据
        dates: function() {
            if (!$(".dates").hasClass("on")) {
                $(".months").removeClass("on");
                $(".dates").addClass("on");
                $(".DayMonth_title").text("每日净水量");
                this.dataLine();
            }
        },

        //绘制日的数据
        dataLine: function() {
            var data = this.getDayArray('day');
            chartsConfig.init(data.time, data.list);
        }

    });

    var controller = function() {
        var Model = new historyModel();
        var View = new historyView({
            model: Model
        });

        controller.onRouteChange = function() {
            View.undelegateEvents();
        }
    };

    return {
        controller: controller
    }
});
