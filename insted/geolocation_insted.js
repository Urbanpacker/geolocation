'use strict';

/****** Bloc conteneur de la map à intégrer dans le HTML *** /
/* 
	<div style="height:500px; width:80%; border : 5px black groove; margin:auto" id="mapContainer">
	</div>
*/

// Indiquer ici l'ID du bloc html qui devra contenir la map
const mapContainerId = "mapContainer" ;

const lat = 45.759087 ;
const long = 4.841762 ;

// Possibiité de changer le zoom de la map ci-dessous
const zoomDegree = 15 ;

window.addEventListener('DOMContentLoaded', ()=>{
	class UrbanMap {
		constructor(container, lat, long){
			this.mapContainer = container ;
			this.leafletMap;
			this.zoomPoint = [
				lat,
				long
			];
			this.coords = {
				lat : lat,
				long : long
			};

			this.setOSMMap = () => {
				// Initializes a OSM Map with options
					this.leafletMap = L.map(this.mapContainer.id).setView(this.zoomPoint, zoomDegree);
					this.mapContainer.classList.add("map");
				// Loads the OSM tileLayer (map background) */
				L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
					maxzoom:19,
					attribution:'(c)<a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
				}).addTo(this.leafletMap);
			}
		}
	}

	class Marker{
		constructor(coords, currentMap){
			this.coords = coords;
			this.Lmap = currentMap ;
			// Add a marker to a spot onto the map
			this.setMarkers = () => {
				L.marker([this.coords.lat,this.coords.long]).addTo(this.Lmap.leafletMap);
			}
		}
	}

/****************** MAIN CODE ****************************/
	const DOMMapcontainer = document.getElementById(mapContainerId);
	const myMap = new UrbanMap(DOMMapcontainer, lat, long);
	myMap.setOSMMap();
	const marker = new Marker(myMap.coords, myMap);
	marker.setMarkers();
	
});