var ChartsAmcharts = function () {

    var initChartNetherlandsMap = function () {
        var map = AmCharts.makeChart("chart_netherlands", {
            "type": "map",
            "theme": "none",
            "colorSteps": 10,
            "dataProvider": {
                "mapURL": App.getGlobalPluginsPath() + "amcharts/ammap/maps/svg/netherlandsHigh.svg",
                "getAreasFromMap": true,
                "zoomLevel": 0.9,
                "areas": []
            },
            "areasSettings": {
                "autoZoom": true,
                "balloonText": "[[title]]: <strong>[[value]]</strong>"
            },
            "valueLegend": {
                "right": 10,
                "minValue": "little",
                "maxValue": "a lot!"
            },
            "zoomControl": {
                "minZoomLevel": 0.9
            },
            "titles": [{
                "text": "netherlands"
            }],
            "listeners": [{
                "event": "init",
                "method": updateHeatmap
            }]
        });


        function updateHeatmap(event) {
            var map = event.chart;
            if (map.dataGenerated)
                return;
            if (map.dataProvider.areas.length === 0) {
                setTimeout(updateHeatmap, 100);
                return;
            }
            for (var i = 0; i < map.dataProvider.areas.length; i++) {
                map.dataProvider.areas[i].value = Math.round(Math.random() * 10000);
            }
            map.dataGenerated = true;
            map.validateNow();
        }
    };

    return {
        //main function to initiate the module

        init: function () {

            initChartNetherlandsMap();
        }

    };

}();

jQuery(document).ready(function () {
    ChartsAmcharts.init();
});