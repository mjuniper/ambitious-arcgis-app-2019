import esriLoader from 'esri-loader';

// create a new map view at an element
export function newMap(element, mapOptions) {
  // lazy load the map modules and CSS
  return esriLoader.loadModules(
    ['esri/Map', 'esri/views/MapView'],
    // NOTE: keep this current w/ the latest version of the JSAPI
    { css: 'https://js.arcgis.com/4.10/esri/css/main.css' }
  )
  .then(([Map, MapView]) => {
    if (!element) {
      // component or app was likely destroyed
      return;
    }
    // Create the Map
    const map = new Map(mapOptions);
    // show the map at the element
    let view = new MapView({
      map,
      container: element,
      zoom: 2
    });
    // prevent zooming with the mouse-wheel
    view.when(() => {
      view.on("mouse-wheel", function(evt){
        evt.stopPropagation();
      });
    });
    // return closure scoped functions for working with the map
    return {
      destroy: function () {
        if (view) {
          view.container = null;
          view = null;
        }
      }
    };
  });
}

export function itemToGraphicJson (item, symbol, popupTemplate) {
  const geometry = coordsToExtent(item.extent);
  return { geometry, symbol, attributes: item, popupTemplate };
}

// expect [[-53.2316, -79.8433], [180, 79.8433]] or []
function coordsToExtent (coords) {
  if (coords && coords.length === 2) {
    return {
      type: 'extent',
      xmin: coords[0][0],
      ymin: coords[0][1],
      xmax: coords[1][0],
      ymax: coords[1][1],
      spatialReference:{
        wkid:4326
      }
    };
  }
}
