window.onload = init
function init() {
    const map = new ol.Map({
        view: new ol.View({
            // center : [0,0],
            center: ol.proj.fromLonLat([79.53, 17.98]),
            zoom: 10,
            maxZoom: 30,
            minZoom: 5
            // rotation: 0
        }),

        target: "js-map"
    })
    // Adding Base layers
    //OSMStandard
    const OSMstandard = new ol.layer.Tile({
        source: new ol.source.OSM,
        zIndex: 0,
        visible: true,
        title: 'OSMStandard'
    })

    const OSMHumanitarian = new ol.layer.Tile({
        source: new ol.source.OSM({
            url: "https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        }),
        zIndex: 1,
        visible: false,
        title: 'OSMHumanitarian'
    })

    //Bing Map
    const BingMaps = new ol.layer.Tile({
        source: new ol.source.BingMaps({
            key: 'Aj2q2HbDSvpoTdaJU-vycKSzFPrZD0DDA8VF92Jxa_uiruXn4YZ1083utw_24fCH',
            imagerySet: 'AerialWithLabels'
        }),
        zIndex: 2,
        visible: false,
        title: 'BingMaps'
    })

    //Stamen Terrain from api key
    const StadiaMaps_Terrain = new ol.layer.Tile({
        source: new ol.source.StadiaMaps({
            layer: 'stamen_terrain',
            apiKey: 'a2761d1a-f3c2-4a1c-8bb2-6961cdcd6361'
        }),
        zIndex: 3,
        visible: false,
        title: 'StadiaMapsTerrain'
    })

    // Stamen Watercolor from URL
    const StadiaMaps_Watercolor = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg"
        }),
        zIndex: 4,
        visible: false,
        title: 'StadiaMapsWatercolor'
    })

    const baseLayerGroup = new ol.layer.Group({
        layers: [OSMstandard, OSMHumanitarian, BingMaps, StadiaMaps_Terrain, StadiaMaps_Watercolor],
    })

    map.addLayer(baseLayerGroup);

    //Layer Switching logic

    const baseLayerElements = document.querySelectorAll('.sidebar>input[type=radio]')

    for (let baseLayerElement of baseLayerElements) {
        baseLayerElement.addEventListener('change', function () {
            let baseLayerElementValue = this.value;
            baseLayerGroup.getLayers().forEach(function (element, index, array) {
                let baseLayerName = element.get('title');
                element.setVisible(baseLayerName === baseLayerElementValue);
                element.get('visible');
            })
        })
    }


    //Adding Vector Layers
    //GeojsonBuildings
    const vectorGJSON1 = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: './data/BuildingBlocks.geojson',
            format: new ol.format.GeoJSON()
        }),
        visible: true,
        title: 'vectorGJSON1'
    })
    map.addLayer(vectorGJSON1);

    //GeojsonRoads

    const vectorGJSON2 = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: './data/Roads.geojson',
            format: new ol.format.GeoJSON()
        }),
        visible: true,
        title: 'vectorGJSON2'
    })
    map.addLayer(vectorGJSON2);

    //GeojsonJunctions

    const vectorGJSON3 = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: './data/Junctions.geojson',
            format: new ol.format.GeoJSON()
        }),
        visible: true,
        title: 'vectorGJSON3'
    })
    map.addLayer(vectorGJSON3);


    const vectorLayerGroup = new ol.layer.Group({
        layers: [vectorGJSON1, vectorGJSON2, vectorGJSON3]
    });

    map.addLayer(vectorLayerGroup);
    // Vector layer switch logic
    const vectorLayerElements = document.querySelectorAll('.sidebar > input[type=checkbox]');
    for (let vectorLayerElement of vectorLayerElements) {
        vectorLayerElement.addEventListener('change', function () {
            let vectorLayerElementValue = this.value;
            vectorLayerGroup.getLayers().forEach(function (layer) {
                let vectorLayerName = layer.get('title');
                if (vectorLayerName === vectorLayerElementValue) {
                    layer.setVisible(vectorLayerElement.checked); // Set visibility based on checkbox state
                }
            });
        });
    }


    // Attribute data display 
    const overlayContainerElement = document.querySelector('.overlayy-container')
    const overlayLayer = new ol.Overlay({
        element: overlayContainerElement
    })
    map.addOverlay(overlayLayer);
    const overlayFeatureName = document.getElementById('feature-name');
    const overlayFeatureInfo = document.getElementById('feature-info');

    // Attribute Information
    map.on('click', function (e) {
        overlayLayer.setPosition(undefined);
        map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
            let clickedCoordinate = e.coordinate;
            let clickedFeatureName = feature.get('streams');
            let clickedFeatureInfo = feature.get('FeatureName');
            if (clickedFeatureName && clickedFeatureInfo != undefined) {
                overlayLayer.setPosition(clickedCoordinate);
                overlayFeatureName.innerHTML = clickedFeatureName;
                overlayFeatureInfo.innerHTML = clickedFeatureInfo;
            }
        })
    })

}
