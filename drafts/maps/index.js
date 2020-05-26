'use strict'

import {UrbanMap} from "./moduls/mapCreator.js";
import {UserLocation} from "./moduls/getUserLocation.js" ;
import {AdressGetter} from "./moduls/adressGetter.js" ;
import * as Form from "./moduls/form.js" ;

/*********** FUNCTIONS ****************/

window.addEventListener('DOMContentLoaded', ()=>{

	const MAPCONTAINER = document.getElementById("mapContainer");    
	const zoomDegree = 15 ;

/******************************************************************************** */

	function setMap(coords, zoomDegree){
		if(!MAPCONTAINER){return;}
		var myMap = new UrbanMap(MAPCONTAINER, coords.lat, coords.long, zoomDegree);
		
		/* Put every tilelayer of a the created UrbanMap into an array in order to use of it later easily */
		var tileLayers = [] ;
		for(let prop in myMap.mapTileLayers){
			tileLayers.push(myMap.mapTileLayers[prop]);
		}
		/* Load the user chosen tilelayer */
		let selectedMap = loadDataFromDomStorage("preferedMapTileLayer", "local") || 0;
		
		/****Scrolling menu to choose a map tilelayer */
		let selectMap = document.createElement("select");
		selectMap.style.maxWidth ="80%";
		selectMap.style.margin="15px 0px"
		let optNumber = 0 ;
		for(let prop in myMap.mapTileLayers){
			let opt = document.createElement("option");
			opt.value = optNumber;
			opt.innerText = ucFirst(prop);
			if(optNumber === selectedMap){
				opt.setAttribute("selected", "");
			}
			selectMap.appendChild(opt);
			++optNumber;
		}
		insertBeforeElem(selectMap, MAPCONTAINER);
	
		/* Event listener watching the change of map tilelayer by the user  */
		selectMap.onchange = (e) => {
			let preferedMapTileLayer = 0;
			for (let i =0, c = tileLayers.length ; i< c ; i++){
				if(i === e.target.selectedIndex){
					preferedMapTileLayer = i;
					break
				}
			}
			removeDataFromDomStorage("preferedMapTileLayer", "local");
			saveDataToDomStorage("preferedMapTileLayer", preferedMapTileLayer, "local");
			location.reload(true);
		};

		let saveCoords = document.createElement("button");
		saveCoords.innerText ="Sauver la position";
		saveCoords.style = "margin : 0 auto 15px ; color : black ; maxWidth :50%; display :block"
		insertBeforeElem(saveCoords, MAPCONTAINER);
		saveCoords.onclick = (e => {
			let savedCoords = loadDataFromDomStorage("savedCoords", "session");
			removeDataFromDomStorage("savedCoords", "session");
			let coordsPresentInStorage = false;
			
			/*If the DOM storage is empty, we create a new array with the currentspot position as a first element */
			if(savedCoords === null){
				savedCoords = [];
				savedCoords.push({lat : myMap.coords.lat, long : myMap.coords.long});
			} else{
			/* We check that the current spot position has not been saved in the DOM storage yet */
				for(let i = 0, c = savedCoords.length ; i < c ; i++){
					if(((savedCoords[i].lat === myMap.coords.lat) && (savedCoords[i].long === myMap.coords.long))){
						coordsPresentInStorage = true ;
						break		
					}
				}	
				if(!coordsPresentInStorage){
					savedCoords.push({lat : myMap.coords.lat, long : myMap.coords.long})
				}
			}
			saveDataToDomStorage("savedCoords", savedCoords, "session");
		});

		// Set an OSM Map with the tilelayer as a parameter, the default tilelayer is used in case of missing or irrelevant answer from the user 
		//myMap.setOSMMap(tileLayers[carte]);
		myMap.setOSMMap(tileLayers[selectedMap]);

		/* Add the stored spot coordinates to the currently handled object UrbanMap */
		let addingCoords = loadDataFromDomStorage("savedCoords", "session");
		if(addingCoords){
			myMap.addPosition(addingCoords);
		}
		
		/*Set markers onto the displayed OSM Map */
		if(myMap.positions.length > 1){
			myMap.setSeveralMarkers(myMap.positions);
		} else {
			myMap.setMarker();
		}

	}

/******************************************************************************** */

	/* SingleSpot Displayer dedicated function */
	(()=>{

		let adress;
		let postcode;
		let fields = document.querySelectorAll("li[data-type]");
		var coords = {
			lat : null,
			long : null
		};

		for (let value of fields){
			if(value.dataset.type == "latitude"){
				if((value.dataset.content !== "") && (value.dataset.content !== "Inconnue")){
					coords.lat = value.dataset.content ;
				}
			}
			if(value.dataset.type == "longitude"){
				if((value.dataset.content !== "") && (value.dataset.content !== "Inconnue")){
					coords.long = value.dataset.content ;
				}
			}
			if(value.dataset.type == "postcode"){
				postcode = value.dataset.content;
			}
			if(value.dataset.type == "adress"){
				adress = value.dataset.content;
			}
		}

		if(coords.long && coords.lat){
			setMap(coords);
		}else{
			let place = new AdressGetter();
			place.getCoordsFromAdress(adress, postcode)
			.then((result) => setMap(result, zoomDegree))
			.catch((error)=>{
				console.error(error);
				console.warn("Impossible de récupérer les coordonnées du spot à partir de son adresse.");
			});
		}
	})();

	/******** Récupération des informations de géolocalisation de l'internaute**************/
	let geolocateUser = false;
		if(geolocateUser){	
			var userLocation = new UserLocation() ; 
			userLocation.getCurrentPosition()
			.then((position) => userLocation.successGeo(position))
			.then((coords) => userLocation.setNewPositionIntoStorage(coords))
			.catch((error) => userLocation.failGeo(error));
		}	
	/***************************************************************************************/

});

/******************************************************************************** */
window.addEventListener('DOMContentLoaded', ()=>{
    /* SingleSpot Form-dedicated functions */
        
        let adressToUse = document.getElementById("adress");
        let postcodeToUse = document.getElementById("postcode");
        let longitude = document.getElementById("longitude");
        let latitude = document.getElementById("latitude");
            
        function getCoords(){
            if(!adressToUse.value || !postcodeToUse.value){
                return;
            }
            let place = new AdressGetter();
            place.getCoordsFromAdress(adressToUse.value, postcodeToUse.value)
            .then((result) => {
                longitude.value = result.long;
                latitude.value = result.lat;
            })
            .catch((error)=>{
                console.error(error);
                console.warn("Impossible de récupérer les coordonnées du spot à partir de son adresse.");
            });	
        }
    
        if(document.querySelector("form")){
            (()=>{
                getCoords();				
            })();
            adressToUse.addEventListener("blur", ()=>{
                getCoords();	
            });
            postcodeToUse.addEventListener("blur", ()=>{
                getCoords();
            });
        }
    });
    
