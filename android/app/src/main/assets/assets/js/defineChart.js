Allpay.define(function() {
    return function(chartId, chartConfig, seriesDate) {
        //折线图自定义配置
        var chartWidth = chartConfig.chartWidth || 400, //折线图宽度
            chartHeight = chartConfig.chartHeight || 550, //折线图高度
            xAxisUnitsNum = chartConfig.xAxisUnitsNum || 5, //Y轴标注间隔数字
            yAxisUnitsNum = chartConfig.yAxisUnitsNum || 4, //X轴标注间隔数字
            xAxisText = chartConfig.xAxisText || 's', //X轴标注文字
            yAxisText = chartConfig.yAxisText || '档位', //Y轴标注文字
            arcX = arcY = chartConfig.smallArcSize || 30, //控制圆点的大小
            fillColor = chartConfig.fillColor || '#fff', //控制圆点的大小
            yAxisFontSize = chartConfig.yAxisFontSize || 20, //Y轴字体大小
            callback = chartConfig.callback || function(gear) { return gear; }, //回传数据
            arcRadius = arcX / 2, //控制圆点的半径
            topSpace = 5, //背景线间隔
            yAxisLineSpan = 35, //Y轴与背景线的距离
            smartWindArc = chartConfig.smartWindArc || 45; //智能风倾斜角度
        xAxisMax = chartConfig.xAxisMax || 40; //X轴最大值
        xAxisMin = chartConfig.xAxisMin || 0; //X轴最大值
        smartWindArc = smartWindArc * (2 * Math.PI / 360);
        var getMaxYAxisData = function(seriesDate) {
            var max = Math.max.apply(null, seriesDate);
            return max;
        };
        var yAxisMax = chartConfig.yAxisMax || getMaxYAxisData(seriesDate); //获取Y轴最大值
        var xAxisPos = chartHeight * 0.9; //X轴标注坐标位置
        var xAxisSpace; //X轴标注间隔像素
        var xMinPos; //X轴标注最小值x值
        var xMaxPos; //X轴标注最大值x值

        var leftPos, rightPos;

        if (chartId == "defineWind") {
            xAxisSpace = (chartWidth - yAxisLineSpan) / ((xAxisMax - xAxisMin) / xAxisUnitsNum + 1.5);
        } else if (chartId == "smartWind") {
            xAxisSpace = (chartWidth - yAxisLineSpan) / ((xAxisMax - xAxisMin) / xAxisUnitsNum + 1.5);
        }
        var yAxisSpace = xAxisPos / (yAxisMax / yAxisUnitsNum + 1) - topSpace; //Y轴标注间隔像素
        var draw = SVG(chartId).size(chartWidth, chartHeight);
        var xAxisDataGrp = draw.group();
        var b = 0,
            c = 0,
            f = 0,
            bgLine;
        //画背景线
        var drawBgLine = function(yAxis, yAxisSpace, bgLineId, colorV, opacityV) {
            var text = draw.text(function(add) {
                add.tspan(yAxis).fill(fillColor).dy(yAxisSpace);
            });
            text.font({ size: yAxisFontSize }).x(12);;
            bgLine = draw.line(yAxisLineSpan, yAxisSpace - topSpace, '100%', yAxisSpace - topSpace).fill(colorV).stroke({ width: 1, color: colorV, opacity: opacityV });
            bgLine.attr("id", bgLineId);
        };
        var plotChart = function() {
            //添加y轴数据
            var j = 0,
                k = 0;
            for (i = yAxisMax; i >= 0; i = i - yAxisUnitsNum) {
                var a = i;
                b += yAxisSpace + topSpace;
                j++;
                if (i - yAxisUnitsNum >= 0) {
                    drawBgLine(a, b, "bgLine" + j, '#6bddf7', 0.6);
                } else {
                    drawBgLine(a, b, "bgLine" + j, '#fff', 1);
                }

            }
            //添加x轴数据 
            for (j = xAxisMin; j <= xAxisMax; j = j + xAxisUnitsNum) {
                c += xAxisSpace;
                if (j == xAxisMin) {
                    leftPos = c;
                } else if (j == xAxisMax) {
                    rightPos = c;
                }
                xAxisDataGrp.add(draw.text("" + j).x(c).leading(2).attr("id", "x" + k).font({ size: yAxisFontSize }));
                xAxisDataGrp.fill(fillColor).y(xAxisPos);
                k++;
            }
            //添加y轴标注文字
            var yText = draw.text(function(add) {
                add.tspan(yAxisText).fill(fillColor).dy(yAxisSpace / 2);
            });
            yText.font({ size: yAxisFontSize });
            //添加x轴标注文字
            xAxisDataGrp.add(draw.text(xAxisText).x(chartWidth - xAxisSpace / 2).leading(2).attr("id", "xText"));
        };
        plotChart();
        //画数据点
        var xCou = (xAxisMax - xAxisMin) / xAxisUnitsNum;
        xMinPos = document.getElementById("x0").getAttribute("x");
        xMaxPos = document.getElementById("x" + xCou).getAttribute("x");
        var xText = document.getElementById("xText");
        var xTextPos = xText.getAttribute("x");
        var q = document.getElementById("bgLine1"); //取最大限制
        var w = document.getElementById("bgLine" + ~~(yAxisMax / yAxisUnitsNum + 1)); //取最小限制
        var aera = w.getAttribute("y1") - q.getAttribute("y1");
        //---------------自定义风画图开始------------------------------
        var drawDefineWind = function() {
            var polygon, linePos = new Array(); //存储数据位置
            var drawPlot = function() {
                var point;
                for (k = 0; k < seriesDate.length; k++) {
                    f += xAxisSpace;
                    var yPosition = (1 - seriesDate[k] / yAxisMax) * aera + yAxisSpace - topSpace - arcRadius;
                    point = draw.rect(arcX, arcY).fill(fillColor).radius(arcRadius).x(f).y(yPosition).stroke({ width: 7, color: fillColor, opacity: 0.4 });;

                    point.attr({ 'class': 'rect', 'id': k });
                    var pointPos = [f + arcRadius, yPosition + arcRadius];
                    linePos.push(pointPos);
                }
                polygon = draw.polyline(linePos).fill('none').stroke({ width: 3, color: fillColor });
                return linePos;
            };
            //添加拖动事件
            var dragPoint = function() {
                var gear, gearArr, dx, dy, lineTop, rectTop, textTop, currYPos, currXPos, thisIndex, newPos = [];
                var rect = document.querySelectorAll(".rect");
                var touchStart = function(ev) {
                    thisIndex = this.getAttribute("id");
                    currXPos = linePos[thisIndex][0];
                    currYPos = linePos[thisIndex][1];
                    lineTop = draw.line(currXPos, w.getAttribute("y1"), currXPos, q.getAttribute("y1") - 5).fill(fillColor).stroke({ width: 2, opacity: 0.6, color: fillColor }).attr({ "stroke-dasharray": "3" });
                    rectTop = draw.rect(3 * arcX, arcY).radius(1.1 * arcRadius).x(currXPos - 1.5 * arcX).y(q.getAttribute("y1") - 1.25 * arcY).fill(fillColor).stroke({ width: 2, color: fillColor });
                    gear = Math.ceil((1 - (linePos[thisIndex][1] - (yAxisSpace)) / aera) * yAxisMax); //档位
                    textTop = draw.text(function(add) {
                        add.tspan(gear).fill('#097cab').dx(arcX).y(q.getAttribute("y1") - arcY / 2);
                    });
                    if ((gear + "").length > 1) {
                        textTop.font({
                            size: 20
                        }).x(currXPos - 1.5 * arcX);
                    } else {
                        textTop.font({
                            size: 20
                        }).x(currXPos - 1.2 * arcX);
                    }
                    ev.preventDefault();
                };
                var drag = function(ev) {
                    dx = dx || 0;
                    dy = dy || 0;
                    var offx = dx + ev.detail.x;
                    var offy = dy + ev.detail.y;
                    if ((currYPos + offy + arcRadius) > w.getAttribute("y1") || (currYPos + offy + arcRadius) < q.getAttribute("y1")) {
                        return false;
                    } else {
                        linePos[thisIndex] = [currXPos, currYPos + offy + arcRadius];

                        //第一点和最后一点联动
                        if (thisIndex == 0) {
                            linePos[seriesDate.length - 1] = [linePos[seriesDate.length - 1][0], linePos[0][1]];
                            document.getElementById(seriesDate.length - 1).instance.y(linePos[0][1] - arcRadius);
                        } else if (thisIndex == seriesDate.length - 1) {
                            linePos[0] = [linePos[0][0], linePos[seriesDate.length - 1][1]];
                            document.getElementById("0").instance.y(linePos[seriesDate.length - 1][1] - arcRadius);
                        }
                        this.instance.y(currYPos + offy);
                        polygon.plot(linePos); //更新折线位
                        //坐标点转换为档位
                        gear = Math.ceil((1 - (linePos[thisIndex][1] - (yAxisSpace)) / aera) * yAxisMax);
                        textTop.text(function(add) {
                            add.tspan(gear).fill('#097cab').dx(arcX).y(q.getAttribute("y1") - arcY / 2);
                        });
                        if ((gear + "").length > 1) {
                            textTop.font({
                                size: 20
                            }).x(currXPos - 1.5 * arcX);
                        } else {
                            textTop.font({
                                size: 20
                            }).x(currXPos - 1.2 * arcX);
                        }
                    }
                };
                var touchEnd = function(ev) {
                    lineTop.remove();
                    rectTop.remove();
                    textTop.remove();
                    ev.preventDefault();
                };
                [].forEach.call(rect, function(el) {
                    el.addEventListener('touchstart', touchStart, false);
                    el.addEventListener('drag', drag, false);
                    el.addEventListener('touchend', touchEnd, false);
                });
                // touch.on(rect, 'dragend', function(ev) {
                //     lineTop.hide();
                //     dx += ev.x;
                //     if ((currYPos + dy + arcRadius) > w.getAttribute("y1")) {
                //         dy = w.getAttribute("y1") - currYPos;
                //     } else if ((currYPos + dy + arcRadius) < q.getAttribute("y1")) {
                //         dy = currYPos - q.getAttribute("y1");
                //     } else {
                //         dy += ev.y;
                //     }
                //     //返回档位数组
                //     gearArr = new Array();
                //     for (var i = 0; i < linePos.length; i++) {
                //         gearArr.push(Math.ceil((1 - (linePos[i][1] - (yAxisSpace)) / aera) * yAxisMax));
                //     }
                //     callback(gearArr);
                // });
            };
            drawPlot();
            dragPoint();
        };
        //---------------智能风画图开始------------------------------
        var drawSmartWind = function() {

            var xPosition = xAxisSpace * xAxisUnitsNum * (seriesDate[1] / xAxisMax);
            var yPosition = (1 - seriesDate[0] / yAxisMax) * aera + yAxisSpace - topSpace - arcRadius;

            var lineStartX = w.getAttribute("x1");
            var lineStartY = yPosition + arcRadius + Math.tan(smartWindArc) * (xPosition + arcRadius - lineStartX);

            var lineEndY = q.getAttribute("y1");
            var lineEndX = (yPosition + arcRadius - lineEndY) / Math.tan(smartWindArc) + xPosition + arcRadius;

            var drawLine = draw.line(lineStartX, lineStartY, lineEndX, lineEndY).fill(fillColor).stroke({ width: 2, color: fillColor }).attr({ "id": "smartRLine" });
            var linePos = []; //存储数据位置
            var point;
            var drawPlot = function() {
                point = draw.rect(arcX, arcY).fill(fillColor).radius(arcRadius).x(xPosition).y(yPosition).stroke({ width: 7, color: fillColor, opacity: 0.4 });
                point.attr({ 'class': 'rect', 'id': 'smartPoint' });
                linePos[0] = xPosition + arcRadius;
                linePos[1] = yPosition + arcRadius;
                return linePos;
            };
            //添加拖动事件
            var dragPoint = function() {
                var gear, gearArr, dx, dy, lineTop, rectTop, textTop, currYPos, currXPos, thisIndex, newPos = [];
                var rect = document.querySelectorAll("#smartPoint");
                var limitX2 = parseInt(w.getAttribute("x1")) + (parseInt(w.getAttribute("y1")) - parseInt(q.getAttribute("y1"))) / Math.tan(smartWindArc);
                var touchStart = function(ev) {
                    currXPos = linePos[0];
                    currYPos = linePos[1];
                    lineTop = draw.line(currXPos, w.getAttribute("y1"), currXPos, q.getAttribute("y1") - 5).fill(fillColor).stroke({ width: 2, color: fillColor }).attr({ "stroke-dasharray": "3" });
                    rectTop = draw.rect(3 * arcX, arcY).radius(1.1 * arcRadius).x(currXPos - 1.5 * arcX).y(q.getAttribute("y1") - 1.25 * arcY).fill(fillColor).stroke({ width: 2, color: fillColor });
                    gear = Math.ceil((1 - (linePos[1] - (yAxisSpace)) / aera) * yAxisMax);
                    textTop = draw.text(function(add) {
                        add.tspan(gear).fill('#097cab').dx(arcX).y(q.getAttribute("y1") - arcY / 2);
                    });
                    if ((gear + "").length > 1) {
                        textTop.font({
                            size: 20
                        }).x(currXPos - 1.5 * arcX);
                    } else {
                        textTop.font({
                            size: 20
                        }).x(currXPos - 1.2 * arcX);
                    }
                    ev.preventDefault();
                };
                var drag = function(ev) {
                    dx = dx || 0;
                    dy = dy || 0;
                    var offx = dx + ev.detail.x;
                    var offy = dy + ev.detail.y;
                    var limitX = ((currXPos + offx + arcRadius) < w.getAttribute("x1") || (currXPos + offx + arcRadius) > chartWidth);
                    var limitY = ((currYPos + offy + arcRadius) > w.getAttribute("y1") || (currYPos + offy + arcRadius) < q.getAttribute("y1"));
                    var limitX_2 = (currXPos + offx) > leftPos && (currXPos + offx) < rightPos;
                    if (!limitX_2) {
                        return false;
                    }
                    if (limitX || limitY) {
                        return false;
                    } else {
                        linePos = [currXPos + offx + arcRadius, currYPos + offy + arcRadius];
                        xPosition = linePos[0];
                        yPosition = linePos[1];
                        lineEndX = (yPosition - lineEndY) / Math.tan(smartWindArc) + xPosition;
                        this.instance.y(currYPos + offy);
                        this.instance.x(currXPos + offx);
                        rectTop.x(currXPos - arcX + offx);
                        lineTop.plot(currXPos + offx + arcRadius, w.getAttribute("y1"), currXPos + offx + arcRadius, q.getAttribute("y1") - 5);
                        if (drawLine.attr("x2") < limitX2) {
                            lineStartX = w.getAttribute("x1");
                            lineStartY = yPosition + Math.tan(smartWindArc) * (xPosition - lineStartX);
                            if (lineStartY > w.getAttribute("y1")) {
                                lineStartY = w.getAttribute("y1");
                            }
                        } else {
                            lineStartY = w.getAttribute("y1");
                            lineStartX = (yPosition - lineStartY) * Math.tan(smartWindArc) + xPosition;
                        }
                        drawLine.plot(lineStartX, lineStartY, lineEndX, lineEndY); //更新直线位
                        //坐标点转换为档位
                        gear = Math.ceil((1 - (linePos[1] - (yAxisSpace)) / aera) * yAxisMax);
                        textTop.remove();
                        textTop = draw.text(function(add) {
                            add.tspan(gear).fill('#097cab').dx(arcX).y(q.getAttribute("y1") - arcY / 2);
                        });
                        if ((gear + "").length > 1) {
                            textTop.font({
                                size: 20
                            }).x(currXPos - arcX + offx);
                        } else {
                            textTop.font({
                                size: 20
                            }).x(currXPos - 0.8 * arcX + offx);
                        }
                    }
                };
                var touchEnd = function(ev) {
                    lineTop.remove();
                    rectTop.remove();
                    textTop.remove();
                    ev.preventDefault();
                };
                [].forEach.call(rect, function(el) {
                    el.addEventListener('touchstart', touchStart, false);
                    el.addEventListener('drag', drag, false);
                    el.addEventListener('touchend', touchEnd, false);
                });
                // rect.addEventListener('dragend', function(ev) {
                //     lineTop.hide();
                //     if ((currXPos + dx + arcRadius) < w.getAttribute("x1")) {
                //         dx = currXPos - w.getAttribute("x1");
                //     } else if ((currXPos + dx + arcRadius) > chartWidth) {
                //         dx = chartWidth - currXPos;
                //     } else {
                //         dx += ev.x;
                //     }
                //     if ((currYPos + dy + arcRadius) > w.getAttribute("y1")) {
                //         dy = w.getAttribute("y1") - currYPos;
                //     } else if ((currYPos + dy + arcRadius) < q.getAttribute("y1")) {
                //         dy = currYPos - q.getAttribute("y1");
                //     } else {
                //         dy += ev.y;
                //     }
                //     //返回档位数组
                //     gearArr = new Array();
                //     gearArr[0] = Math.ceil((1 - (linePos[1] - (yAxisSpace)) / aera) * yAxisMax);
                //     gearArr[1] = 15 + Math.ceil(((linePos[0] - xMinPos - 12) / (xMaxPos - xMinPos)) * (xAxisMax - xAxisMin));
                //     callback(gearArr);
                // }, false);
            };
            drawPlot();
            dragPoint();
        }
        if (chartId == "defineWind") {
            drawDefineWind();
        } else if (chartId == "smartWind") {
            drawSmartWind();
        }

    }
});