//map.js implementation for heatmap, and legend components

mapboxgl.accessToken = 'pk.eyJ1IjoibXlsZXNmbGFjayIsImEiOiJja3p4dDA0cmYwNHV1Mm5vMXo2M2pkNnFoIn0.aCiH-AzTD6Bt0njw2JItdg';
if (!mapboxgl.supported()) {
alert('Your browser does not support Mapbox GL');
} 
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    // Different Map options
    // style: 'mapbox://styles/mapbox/satellite-streets-v11',
    // style: 'mapbox://styles/mapbox/outdoors-v11',
    // style: 'mapbox://styles/mapbox/light-v10',
    // style: 'mapbox://styles/mapbox/dark-v10',
    // style: 'mapbox://styles/mapbox/satellite-v9',
    // style: 'mapbox://styles/mapbox/satellite-streets-v11',
    // style: 'mapbox://styles/mapbox/navigation-day-v1',
    // mapbox://styles/mapbox/navigation-night-v1
    center: [-120, 51],
    zoom: 5,
    bearing: 27,
    pitch: 45
});
 /**
        * Assign a unique id to each store. You'll use this `id`
        * later to associate each point on the map with a listing
        * in the sidebar.
        */
    //    maybe change
 function loadJSONFile(callback) {   

    var xmlobj = new XMLHttpRequest();

    xmlobj.overrideMimeType("application/json");

    xmlobj.open('GET', 'news.geojson', true); // Provide complete path to your json file here. Change true to false for synchronous loading.

    xmlobj.onreadystatechange = function () {
          if (xmlobj.readyState == 4 && xmlobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xmlobj.responseText);
          }
    };

    xmlobj.send(null);  
 }
 loadJSONFile(function(response){
    const newsStories = JSON.parse(response);
    //    const stores = require('./news.geojson');
        newsStories.features.forEach((store, i) => {
            store.properties.id = i;
        });

        /**
        * Wait until the map loads to make changes to the map.
        */
        map.on('load', () => {

            /**
            * This is where your '.addLayer()' used to be, instead
            * add only the source without styling a layer
            */
            map.addSource('places', {
                'type': 'geojson',
                'data': './news.geojson'
            });

            /**
            * Add all the things to the page:
            * - The location listings on the side of the page
            * - The markers onto the map
            */
            buildLocationList(newsStories);
            addMarkers();
map.addLayer(
{
'id': 'earthquakes-heat',
'type': 'heatmap',
'source': 'places',
'maxzoom': 9,
'paint': {
// Increase the heatmap weight based on frequency and property magnitude
'heatmap-weight': [
'interpolate',
['linear'],
['get', 'mag'],
0,
0,
6,
1
],
// Increase the heatmap color weight weight by zoom level
// heatmap-intensity is a multiplier on top of heatmap-weight
'heatmap-intensity': [
'interpolate',
['linear'],
['zoom'],
0,
1,
9,
3
],
// Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
// Begin color ramp at 0-stop with a 0-transparancy color
// to create a blur-like effect.
        'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0,
            'rgba(236,222,239,0)',
            0.2,
            'rgb(208,209,230)',
            0.4,
            'rgb(166,189,219)',
            0.6,
            'rgb(103,169,207)',
            0.8,
            'rgb(28,144,153)'
        ],
// Adjust the heatmap radius by zoom level
'heatmap-radius': [
'interpolate',
['linear'],
['zoom'],
0,
2,
9,
20
],
// Transition from heatmap to circle layer by zoom level
'heatmap-opacity': [
'interpolate',
['linear'],
['zoom'],
7,
1,
9,
0
]
}
},
'waterway-label'
);
 
map.addLayer(
{
'id': 'earthquakes-point',
'type': 'circle',
'source': 'places',
'minzoom': 7,
'paint': {
// Size circle radius by earthquake magnitude and zoom level
'circle-radius': [
'interpolate',
['linear'],
['zoom'],
7,
['interpolate', ['linear'], ['get', 'mag'], 1, 1, 6, 4],
16,
['interpolate', ['linear'], ['get', 'mag'], 1, 5, 6, 50]
],
// Color circle by earthquake magnitude
'circle-color': [
'interpolate',
['linear'],
['get', 'mag'],
1,
'rgba(33,102,172,0)',
2,
'rgb(103,169,207)',
3,
'rgb(209,229,240)',
4,
'rgb(253,219,199)',
5,
'rgb(239,138,98)',
6,
'rgb(178,24,43)'
],
'circle-stroke-color': 'white',
'circle-stroke-width': 1,
// Transition from heatmap to circle layer by zoom level
'circle-opacity': [
'interpolate',
['linear'],
['zoom'],
7,
0,
8,
1
]
}
},
'waterway-label'
);
        });
        function addMarkers() {
            /* For each feature in the GeoJSON object above: */
            for (const marker of newsStories.features) {
                /* Create a div element for the marker. */
                const el = document.createElement('div');
                /* Assign a unique `id` to the marker. */
                el.id = `marker-${marker.properties.id}`;
                /* Assign the `marker` class to each marker for styling. */
                el.className = 'marker';

                /**
                * Create a marker using the div element
                * defined above and add it to the map.
                **/
                new mapboxgl.Marker(el, { offset: [0, -23] })
                    .setLngLat(marker.geometry.coordinates)
                    .addTo(map);

                /**
                * Listen to the element and when it is clicked, do three things:
                * 1. Fly to the point
                * 2. Close all other popups and display popup for clicked store
                * 3. Highlight listing in sidebar (and remove highlight for all other listings)
                **/
                el.addEventListener('click', (e) => {
                    /* Fly to the point */
                    flyToStore(marker);
                    /* Close all other popups and display popup for clicked store */
                    createPopUp(marker);
                    /* Highlight listing in sidebar */
                    const activeItem = document.getElementsByClassName('active');
                    e.stopPropagation();
                    if (activeItem[0]) {
                        activeItem[0].classList.remove('active');
                    }
                    const listing = document.getElementById(
                        `news-${marker.properties.id}`
                    );
                    listing.classList.add('active');
                });
            }
        }

        /**
        * Add a listing for each store to the sidebar.
        **/
        function buildLocationList(newsStories) {
            for (const storie of newsStories.features) {
                /* Add a new listing section to the sidebar. */
                const listings = document.getElementById('news');
                const listing = listings.appendChild(document.createElement('div'));
                /* Assign a unique `id` to the listing. */
                listing.id = `news-${storie.properties.id}`;
                /* Assign the `item` class to each listing for styling. */
                listing.className = 'item';

                /* Add the link to the individual listing created above. */
                const link = listing.appendChild(document.createElement('a'));
                link.href = '#';
                link.className = 'title';
                link.id = `link-${storie.properties.id}`;
                link.innerHTML = `${storie.properties.title + ` Date: ` + storie.properties.date}`;

                /* Add details to the individual listing. */
                const details = listing.appendChild(document.createElement('div'));
                details.innerHTML = `${storie.properties.description}`;
                // if (storie.properties.phone) {
                //     details.innerHTML += ` &middot; ${storie.properties.phoneFormatted}`;
                // }

                /**
                * Listen to the element and when it is clicked, do four things:
                * 1. Update the `currentFeature` to the store associated with the clicked link
                * 2. Fly to the point
                * 3. Close all other popups and display popup for clicked store
                * 4. Highlight listing in sidebar (and remove highlight for all other listings)
                **/
                link.addEventListener('click', function () {
                    for (const feature of newsStories.features) {
                        if (this.id === `link-${feature.properties.id}`) {
                            flyToStore(feature);
                            createPopUp(feature);
                        }
                    }
                    const activeItem = document.getElementsByClassName('active');
                    if (activeItem[0]) {
                        activeItem[0].classList.remove('active');
                    }
                    this.parentNode.classList.add('active');
                });
            }
        }

        /**
        * Use Mapbox GL JS's `flyTo` to move the camera smoothly
        * a given center point.
        **/
        function flyToStore(currentFeature) {
            map.flyTo({
                center: currentFeature.geometry.coordinates,
                zoom: 12
            });
        }

        /**
        * Create a Mapbox GL JS `Popup`.
        **/
        function createPopUp(currentFeature) {
            const popUps = document.getElementsByClassName('mapboxgl-popup');
            // const links = currentFeature.properties.link;
            // switch(currentFeature.properties.publisher){
            //     case "YT":
            //         console.log("YT");
            //         link
            //         break;
            //     case "NewsArticle":
            //         console.log("NewsArticle");
            //         break;
            //     case "Twitter":
            //         console.log("Twitter");
            //         break;
            // }
            if (popUps[0]) popUps[0].remove();
            const popup = new mapboxgl.Popup({ closeOnClick: false })
                .setLngLat(currentFeature.geometry.coordinates)
                .setHTML(
                    `<h3 class="hover"><a href="` + currentFeature.properties.link + `">` + currentFeature.properties.title+ `</a></h3><h4><iframe name=` + currentFeature.properties.publisher + ` src="` + currentFeature.properties.link + `" width="250" height="250" frameborder="0" scrolling="auto" class="frame-area"></iframe><h4/>`
                )
                .addTo(map);
        }
    });

