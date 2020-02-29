'use strict';

window.addEventListener('DOMContentLoaded', ()=>{

	class SingleLocation{
		constructor(data){
			this.adress = data.adress;
			this.postCode = data.postCode;
			this.lat = data.lat ;
			this.lg = data.lg ;
			
			/************** METHODS ***********/

			this.getCoordsFromAdress = () => {

				if(!this.postCode || !this.adress){
					return}

				var postCode = this.postCode;
				var inputAdress = this.adress.replace(/ /g, "+");
				
				var url = "https://api-adresse.data.gouv.fr/search/?q="+inputAdress+"&postcode="+postCode;

				if(window.fetch){ // if the navigator supports the relatively recent fetch API
					fetch(url)
					.then((response)=>{
						return response.json();
					})
					.then((data)=>{
						this.lg = data.features[0].geometry.coordinates[0],
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
					    	this.coords.push({
					    		lg : data.features[0].geometry.coordinates[0],
					    		lat : data.features[0].geometry.coordinates[1]
					    	});
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
		constructor(mapContainer, mapTrigger){
			this.mapContainer = document.getElementById(mapContainer) ;
			this.mapTrigger = document.getElementById(mapTrigger);
			this.minGeolocAccuracy;
			this.zoomPoint = [];
			this.coords = {};
			this.leafletMap;
		
			/************** METHODS ***********/

			this.checkCoordsFormat = () => {
				if(!Array.isArray(this.coords) || (this.coords.length <1)){
					console.log("Les coordonnées doivent être sous forme de tableau d'objets de la forme : [{lat : value, lg : value}, {}...]");
					return false
				} else {
					console.log("Format de cordonnées ok");

					return true;
				}
			}

			this.setMinGeolocAccuracy = (minGeolocAccuracy)=>{
				this.minGeolocAccuracy = minGeolocAccuracy ;
			} 

			this.setCoordsAndZoomPoint = (coords) => {
				if(coords){

					this.coords.lat = coords.lat ;
					this.coords.lg = coords.lg ;
					if(!this.zoomPoint){
						if(this.coords.lat && this.coords.lg){
							this.zoomPoint = [this.coords.lat, this.coords.lg];
						} else {
							this.zoomPoint = null;
						}
					}
				}
			}

			this.setOSMMap = () => {
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
							return false;
						}
					}
				}

				if(!this.checkCoordsFormat){
					console.log('mauvaises coordonnées');
					return
				};

				// If no zoomPoint has been defined, by default the map will zoom on the first spot of the input list
				if(!Array.isArray(this.zoomPoint) || this.zoomPoint.length === 0){
					this.zoomPoint = [];
					this.zoomPoint[0] = this.coords.lat; 
					this.zoomPoint[1] = this.coords.lg; 
				}

				console.log(this);
				// Initializes a OSM Map with options
				this.leafletMap = L.map(this.mapContainer.id).setView(this.zoomPoint, 15);
					this.mapContainer.classList.add("map");
				// Loads the OSM tileLayer (map background) */
				L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
					maxzoom:19,
					attribution:'(c)<a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
				}).addTo(this.leafletMap);
				
			}

			// Add a marker to each spot onto the map
			this.setMarkers = (coords) => {
				if(!coords || !Array.isArray(coords)){
					console.log("Mauvaises coordonnées");
					return
				}
				coords.forEach((el, i, arr)=>{
					if(el.lat && el.lg){
						L.marker([el.lat,el.lg]).addTo(this.leafletMap);
					}
				});
			}
		}
	}
/*
	var coords = [];

	for(let i = 0, c = persons.length ; i < c ; ++i){
		coords[i] = new SingleLocation(persons[i]);
		coords[i].getCoordsFromAdress();			
	}

	var maptest = new UrbanMap('mapContainer', 'mapTrigger');

	maptest.mapTrigger.addEventListener('click', e => {
		maptest.setCoords(coords);
		setTimeout(() => {
			maptest.setOSMMap(coords);
		}, 500);
	});
	
*/

/*****************************************************



		/********** Functions to get the visitor's current position *********/

		// If the user clicks on the page before answer to the ageolocation authorisation prompt, the cursor change to normal appeareance
/*
if(navigator.geolocation){
		} else {
		test("pas de fonction de geolocalisation dans le navigateur");
		return false;
}


		noUserAnswer : function (){
			urban.body.style.cursor = "initial";
		},

		getCurrentPosition : function(){
			removeDataFromDomStorage('memberPosition', 'session');
			urban.body.addEventListener('click', urban.noUserAnswer, {once : true, capture : true});
			urban.body.style.cursor = "progress";
			if(navigator.geolocation){
				navigator.geolocation.getCurrentPosition(urban.successGeo, urban.failGeo, {enableHighAccuracy:false, maximumAge:Infinity, timeout: 5000});
				return true;
				
			} else{
				let errorMessage = "Le navigateur ne prend pas en charge l'API de geolocalisation";
				urban.geolocErrorMessage(errorMessage);
				return false;
			}
		},

		successGeo : function(position){
			if(!getMemberPosition(position)){
				urban.body.classList.remove('loading');
				let errorMessage = 'La position n\'a pas pu être identifiée. Veuillez rafraîchir la page et réessayer.';
				urban.geolocErrorMessage(errorMessage);
				return false;
			}
			if(!showOSMMap()){
				let errorMessage = 'La carte n\'a pas pu s\'afficher. Veuillez rafraîchir la page et réessayer.';
				urban.geolocErrorMessage(errorMessage);
				return false;
			}
			urban.geolocationSuccess = true ;
			urban.setGeoDataIntoForm();
			urban.body.classList.remove('loading');
		},

		// In case of geolocation failure, writes the error message in place of the expected map
		failGeo : function(error){
			let errorMessage ="";
			switch(error.code){
				case error.UNKNOWN_ERROR :
					errorMessage ="une erreur inconnue s'est produite.";
					break;
				case error.PERMISSION_DENIED :
					errorMessage ="la permission de récupérer la position n'a pas été accordée.\nVeuillez rafraîchir la page et réeessayer.";
					break;
				case error.POSITION_UNAVAILABLE :
					errorMessage ="La position n'a pas pu être déterminée.";
					break;
				case error.TIMEOUT :
					errorMessage ="Le délai maximal d'attente défini pour récupérer la position est dépassé.";
					break;
				default :
					errorMessage = error.message;
			}
			errorMessage = 'Un problème est survenu lors de la géolocalisation : '+errorMessage;
			urban.geolocErrorMessage(errorMessage);
			urban.geolocationSuccess = false ;
			urban.body.style.cursor = "initial";
		},
/*
		getMemberPosition : function(currentPosition){
			if(!currentPosition){
				return false;
			}

			let coordsAccuracyReliable = currentPosition.coords.accuracy < urban.minGeolocAccuracy ? true : false;
			if(coordsAccuracyReliable){
				let memberPosition = [currentPosition.coords.latitude, currentPosition.coords.longitude] ;
				saveDataToDomStorage('memberPosition', memberPosition, 'session');
				return true;
			} else {
				let errorMessage = 'Désolé, la précision de la géolocalisation n\'est pas suffisante (inférieure à 30 mètres) pour indiquer votre position de manière fiable. \n Veuillez rafraîchir la page et réeessayer ultérieurement.';
				urban.geolocErrorMessage(errorMessage);
				return false ;
			}
		},
		geolocErrorMessage : function(errorMessage){
			if(document.getElementById('errorGeolocMessage')){
				return;
			}
			let errorGeolocMessage = document.createElement('p');
			errorGeolocMessage.id = 'errorGeolocMessage';
			errorGeolocMessage.style.margin = "1rem auto";
			errorGeolocMessage.classList.add('error');
			errorGeolocMessage.textContent = errorMessage;
			urban.mapContainer.append(errorGeolocMessage);
		},

*/

		/****************MAP DISPLAYER***********/

		/* Display an OSM map with the current position if the geolocation succeeds and if the accuracy is important enough */
/*		showCurrentPosition : function(){
			urban.getCurrentPosition();
			urban.mapTrigger.style.dislay = "none";
			// Remove any existing geolocation fail notice
			let errorGeolocMessage = document.getElementById('errorGeolocMessage');
			if(errorGeolocMessage){
				errorGeolocMessage.parentNode.removeChild(errorGeolocMessage);
			}
			if(document.querySelector('form #latitude') && document.querySelector('form #latitude')){
				setGeoDataIntoForm();
			}
		},
*/

		/***** COORDINATES FORM FILLER ********/
/*
		setGeoDataIntoForm : function(){
			var useCurrentPositionButton;
			let memberPosition ;
			let timeOutGeolocation = 60 ;
			let timeCounter = 0 ;
			
			// While the navigator getPosition() function is searching for the current position, the creation and display of a "Add the coordinates to the form" waits for the setting of the coordinates
			var intervalId = window.setInterval((function(){
				if(urban.geolocationSuccess === false){
					urban.mapTrigger.style = "display:inline-block";
				}
				
				if(useCurrentPositionButton === undefined && urban.geolocationSuccess === true){
					useCurrentPositionButton = document.createElement('button');
					useCurrentPositionButton.id = 'addCurrentPositionToForm';
					useCurrentPositionButton.textContent = 'Ajouter les coordonnées trouvées au formulaire';
					useCurrentPositionButton.setAttribute('type','button');
					useCurrentPositionButton.classList.add('optionButton');
					let form = document.querySelector('form');
					if(form && !document.getElementById('addCurrentPositionToForm')){
						form.append(useCurrentPositionButton);
					}
				}
				memberPosition = loadDataFromDomStorage('memberPosition', 'session') || [] ;
			
				if((useCurrentPositionButton !== undefined && memberPosition.length > 0)){
					useCurrentPositionButton.addEventListener('click', function(){
						document.getElementById('latitude').value = memberPosition[0];
						document.getElementById('longitude').value = memberPosition[1];
					});
				}
			
				if(memberPosition.length > 0 || urban.geolocationSuccess === false){
					window.clearInterval(intervalId);
					return;
				}
			}), 1000);
		}
	};
*/


	/****************** MAIN CODE ****************************/
	
	const mapContainer = document.getElementById("mapContainer");
	const mapTrigger = document.getElementById("mapTrigger");


	if(mapContainer && mapTrigger){
		//urban.mapTrigger.addEventListener('click',urban.showCurrentPosition);

		mapTrigger.addEventListener('click', e => {
			e.preventDefault();
			// urban.showOSMMapBis();
			let adress = document.forms[0].elements["adress"].value ;
			let postcode = document.forms[0].elements["postcode"].value ;
			
			if(!adress || !postcode){return false;}

			const emplacement = new SingleLocation({"adress" : adress, "postCode" : postcode});

			emplacement.getCoordsFromAdress();
			// While the datagouv.adresses API is searching for the coordinates from the adress...

			var numberOfAttempt = 0 ;
			var maxAttempts = 10 ;
			var intervalId = window.setInterval(()=>{
				if(emplacement.lat && emplacement.lg){
					window.clearInterval(intervalId);
					console.log("Coordonnées récupérées");
					console.log("La lat est "+emplacement.lat);
					console.log("La long est "+emplacement.lg);
					console.log("L'adresse est "+emplacement.adress);
					console.log("Le code postal est "+emplacement.postCode);
				}
				else if(numberOfAttempt > maxAttempts){
					window.clearInterval(intervalId);
					console.log("impossible de récupérer les coordonnées, veuillez réessayer plus tard");
				}
				++numberOfAttempt;
			}, 100);		
		
		
			setTimeout(()=>{
				const myMap = new UrbanMap("mapContainer", "mapTrigger");
				console.log(emplacement);
				//var bla = {emplacement.lat, emplacement.lg}
				myMap.setCoordsAndZoomPoint(emplacement);
				myMap.setOSMMap();
				myMap.setMarkers([myMap.coords]);
				console.log(myMap);
			}, 500);
			
		});


	}
//				let coords = [{long : 4.8325000, lat : 45.7577000}];

	

});



			var persons = [
		{
			adress : "16 place Bellecour",
			postCode : "69002"
		},
		{
			adress : "10 place Vauboin",
			postCode : "69160"
		},
		{
			adress : "50 rue de la République",
			postCode : "69002"
		},
		{
			adress : "14 cours Charlemagne",
			postCode : "69002"
		}
	];