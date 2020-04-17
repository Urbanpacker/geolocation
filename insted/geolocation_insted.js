'use strict';


/****Bibliothèques à intégrer dans le head du document HTML ***/
/* 
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.3/dist/leaflet.css">
	<script src="https://unpkg.com/leaflet@1.0.3/dist/leaflet.js"></script>
*/


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
const zoomDegree = 13.5 ;

var maps = [];
var markers = [] ;

window.addEventListener('DOMContentLoaded', ()=>{


	class SingleLocation{
		constructor(adress, postCode){
			this.adress = adress;
			this.postCode = postCode;
			this.lat ;
			this.long ;

			/************** METHODS ***********/

			this.getCoordsFromAdress = () => {

				if(!this.postCode || !this.adress){return}
				
				var postCode = this.postCode;
				var inputAdress = this.adress.replace(/ /g, "+");
				
				var url = "https://api-adresse.data.gouv.fr/search/?q="+inputAdress+"&postcode="+postCode;

				if(window.fetch){ // if the navigator supports the relatively recent fetch API
					fetch(url)
					.then((response)=>{
						return response.json();
					})
					.then((data)=>{
						this.long = data.features[0].geometry.coordinates[0];
					    this.lat = data.features[0].geometry.coordinates[1]
					})
					.catch((error)=>{
						console.log(error);
					});
				} else{ // if the navigator does not support fetch API, then it uses traditionnal XHR method
					var request = new XMLHttpRequest();
					request.open('GET', adress, true);
					request.onload = () => {
						if (this.status >= 200 && this.status < 400){
					    	let data = JSON.parse(this.response);
					    	this.lg = data.features[0].geometry.coordinates[0];
					    	this.lat = data.features[0].geometry.coordinates[1];
						} else {
					    	console.log('The target server has been reached, but it returned an error');
					  	}
					};
					request.onerror = () => {
					  	console.log('There was a connection error of some sort');
					};
					request.send();
				}
			}
		}			
	}


	class UrbanMap {
		constructor(container, lat, long, zoomDegree = 15){
			this.mapContainer = container ;
			this.leafletMap;
			this.zoomDegree = zoomDegree;
			this.zoomPoint = [
				lat,
				long
			];
			this.coords = {
				lat : lat,
				long : long
			};

			this.setOSMMap = () => {
				// Check that a container has been set
				if(!this.mapContainer){
					console.log("Pas de conteneur défini pour la carte")
					return;
				}
				// Checks that no map has already been set in the container
				if(this.mapContainer.hasChildNodes()){
					let el = this.mapContainer.childNodes ;
					for(let i = 0, c = el.length; i < c; ++i){
						if(el[i].nodeType ===  Node.ELEMENT_NODE){
							console.error("Une carte a déjà été créée dans ce conteneur");
							return;
						}
					}
				}
					// Initializes a OSM Map with options
					this.leafletMap = L.map(this.mapContainer.id).setView(this.zoomPoint, this.zoomDegree);
					this.mapContainer.classList.add("map");
					// Loads the OSM tileLayer (map background) */
					L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
						maxzoom:19,
						attribution:'(c)<a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
					}).addTo(this.leafletMap);
			}

			this.setMarker = (lat = this.coords.lat, long = this.coords.long)=>{
				L.marker([lat,long]).addTo(this.leafletMap);
			}
		}
	}

/****************** MAIN CODE ****************************/
	
	const DOMMapcontainer = document.getElementById(mapContainerId);
	const mapTrigger = document.getElementById("mapTrigger");
	const places = [];
	var myMap ;

	if(DOMMapcontainer && mapTrigger){
		mapTrigger.addEventListener('click', e => {
			e.preventDefault();
			let adress = document.forms[0].elements["adress"].value ;
			let postcode = document.forms[0].elements["postcode"].value ;
			
			if(!adress || !postcode){return}

			places[places.length] = new SingleLocation(adress, postcode);

			places[places.length-1].getCoordsFromAdress();

			window.setTimeout(()=>{
				if(myMap ===  undefined){
					let lat = places[places.length-1].lat ;
					let long = places[places.length-1].long;
					myMap = new UrbanMap(DOMMapcontainer, lat, long, zoomDegree);
					myMap.setOSMMap();
					myMap.setMarker();
				} else {
					myMap.setMarker(places[places.length-1].lat, places[places.length-1].long);
				}
				console.log(places);
			}, 2500);
		});

	}
});
