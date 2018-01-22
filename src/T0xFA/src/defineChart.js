export class DefineChart {

    constructor(chartId, chartConfig, seriesDate) {
        var _this = this;
        this.chartEl = document.getElementById(chartId);
        this.chartWidth = chartConfig.chartWidth || 235; //折线图宽度
        this.chartHeight = chartConfig.chartHeight || 160; //折线图高度
        this.xAxisUnitsNum = chartConfig.xAxisUnitsNum || 3; //Y轴标注间隔数字
        this.yAxisUnitsNum = chartConfig.yAxisUnitsNum || 1; //X轴标注间隔数字
        this.xAxisText = chartConfig.xAxisText || 's'; //X轴标注文字
        this.yAxisText = chartConfig.yAxisText || '档位'; //Y轴标注文字
        this.yAxisFontSize = chartConfig.yAxisFontSize || 20; //Y轴字体大小
        this.callback = chartConfig.callback || function(gear) {
            return gear; }; //回传数据
        this.topSpace = 5; //背景线间隔
        this.yAxisLineSpan = 25; //Y轴与背景线的距离
        this.xAxisMax = chartConfig.xAxisMax || 12; //X轴最大值
        this.xAxisMin = chartConfig.xAxisMin || 0; //X轴最小值
        this.opacityGride = chartConfig.opacityGride;//是否显示背景线
        this.yAxisMax = chartConfig.yAxisMax || this.getMaxYAxisData(seriesDate); //获取Y轴最大值
        this.xAxisPos = this.chartHeight * 0.85; //X轴标注坐标位置

        this.draw = SVG(chartId).size(this.chartWidth, this.chartHeight);
        this.xAxisDataGrp = this.draw.group();
        this.polygon = null;

        this.plotChart();
        this.drawPlot(seriesDate).drawChart();
        this.tapChart();
    }

    getMaxYAxisData(seriesDate) {
        var max = Math.max.apply(null, seriesDate);
        return max;
    }

    //X轴标注间隔像素
    getxAxisSpace() {
        return (this.chartWidth - this.yAxisLineSpan - this.yAxisFontSize) / Math.ceil((this.xAxisMax - this.xAxisMin) / this.xAxisUnitsNum);
    }

    //Y轴标注间隔像素
    getyAxisSpace() {
        return this.xAxisPos / Math.ceil(this.yAxisMax / this.yAxisUnitsNum);
    }

    drawBgLine(yAxis, yAxisSpace, bgLineId, colorV, opacityV) {
        var self = this;
        var text = this.draw.text(function(add) {
            add.tspan(yAxis).dy(yAxisSpace+self.yAxisFontSize/2);
        });
        var XMargin = yAxis > 9 ? 5 : 12;
        var opacityY = yAxis >= 0 ? 1 : 0;
        text.font({ size: this.yAxisFontSize }).style({'opacity':opacityY}).fill('#55C0FE').x(XMargin);

        var bgLine = this.draw.line(this.yAxisLineSpan, yAxisSpace, '100%', yAxisSpace).fill(colorV).stroke({ width: 1, color: colorV, opacity: opacityV });
        bgLine.attr("id", bgLineId);
    }

    plotChart() {
        var _this = this;
    	var leftPos,rightPos;
        //添加y轴数据
        var b=0, c = this.yAxisLineSpan, f = this.yAxisLineSpan;
        var j = 0,
            k = 0;
        var startY = 0,endY = 0;
        for (var i = this.yAxisMax; i >= 0; i = i - this.yAxisUnitsNum) {
            var a = i;
            b += this.getyAxisSpace();
            j++;
            if (i - this.yAxisUnitsNum >= 0) {
                if(j == 1) startY = b;
                this.drawBgLine(a, b, "bgLine" + j, '#6bddf7', this.opacityGride);
            } else {
                endY = b;
                this.drawBgLine(a, b, "bgLine" + j, '#fff', 1);
            }

        }
        //添加x轴数据 
        for (var j = this.xAxisMin; j <= this.xAxisMax; j = j + this.xAxisUnitsNum) {
            
            c += this.getxAxisSpace();
            if (j == this.xAxisMin) {
                leftPos = c;
            } else if (j == this.xAxisMax) {
                rightPos = c;
            }

            var opacityV = (j%2 == 0 && j !== 0) ? 1 : 0;
            this.xAxisDataGrp.add(this.draw.text("" + j).x(c-this.getxAxisSpace()).leading(2).style({'opacity':opacityV}).attr({"id":"x" + k}).font({ size: this.yAxisFontSize }));
            this.xAxisDataGrp.fill('#55C0FE').y(this.xAxisPos+5);
            k++;
        }

        //画Y轴
        var bgLine = this.draw.line(this.yAxisLineSpan,startY-10,this.yAxisLineSpan,endY).fill("#fff").stroke({ width: 1, color: "#fff", opacity: 1 });
        bgLine.attr("id", "yAxis");
    }

    drawPlot(seriesDate){
        var point = null ,f = this.yAxisLineSpan ,xPos,_this = this;
        var linePos = [];//存储数据位置
        var aera = this.xAxisPos;     
        for(var k=0;k<seriesDate.length;k++){
            f += this.getxAxisSpace();
            var yPosition=(1-seriesDate[k]/this.yAxisMax)*aera + this.getyAxisSpace();
            xPos = (k == seriesDate.length - 1 ) ? this.chartWidth :  (f-this.getxAxisSpace()+this.yAxisFontSize/2);
            var pointPos=[xPos,yPosition];
            linePos.push(pointPos);
        }

        return {
            'drawChart':function(){
                _this.polygon=_this.draw.polyline(linePos).fill('none').stroke({width:2,color:'#fff'});
            },
            'updateChart':function(){
                _this.polygon.plot(linePos);  
            }
        };
    }

    tapChart(){
        var _this = this;
        var x0 = document.getElementById("x0");
        var xPos = x0.getAttribute("x");
        var handle = function(e){
            var time = (e.changedTouches[0].clientX - 20 - parseInt(xPos))/_this.getxAxisSpace()+1;
            _this.callback(Math.floor(time));
            e.preventDefault();
        };

        var mc = new Hammer(this.chartEl);
        mc.on('tap',function(evt){
            handle(evt.srcEvent);
        });
    }

}
