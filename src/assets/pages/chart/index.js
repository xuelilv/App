Allpay.cssLoad('./assets/pages/chart/index.css');
Allpay.define(['../assets/pages/chart/index.html', '../assets/js/defineChart.js'], function(res, defineChart) {
    return function() {
        Allpay.Page({
            el: '#contain',
            template: res
        });
        var chartWidth = document.body.clientWidth - 10;
        var dChartConfig = {
            chartWidth: chartWidth,
            chartHeight: 400,
            xAxisUnitsNum: 5,
            xAxisMin: 0,
            xAxisMax: 30,
            xAxisText: 's',
            yAxisText: '档',
            yAxisUnitsNum: 4,
            yAxisMax: 30,
            smallArcSize: 25,
            fillColor: '#fff',
            yAxisFontSize: 15,
            callback: function(returnData) {
                console.log(returnData);
            }
        };
        var sChartConfig = {
            chartWidth: chartWidth,
            chartHeight: 400,
            xAxisUnitsNum: 5,
            xAxisMin: 15,
            xAxisMax: 40,
            yAxisUnitsNum: 4,
            yAxisMax: 30,
            xAxisText: '℃',
            yAxisText: '温度',
            smartWindArc: 45,
            smallArcSize: 25,
            fillColor: '#fff',
            yAxisFontSize: 15,
            callback: function(returnDate) {
                console.log(returnData);
            }
        };
        var dSeriesDate = [16, 11, 16, 21, 16, 11, 16];
        defineChart("defineWind", dChartConfig, dSeriesDate);
        defineChart("smartWind", sChartConfig, [20, 25]);

    }();
});