'use strict'
import {UrbanMap} from "./moduls/UrbanMap.js";
import {AdressGetter} from "./moduls/adressGetter.js" ;


/*****************MAIN CODE  **************************************/

window.addEventListener('DOMContentLoaded', ()=>{

	const MAPCONTAINER = document.getElementById("mapContainer");    
	MAPCONTAINER.style.visibility = "hidden";
	const zoomDegree = 15 ;
	
	const newAdressButton = document.getElementById("newAdressButton") ;
	newAdressButton.style.display = "none";

	var spotMap;

	var adressField = document.getElementById("adress");
	var postcodeField = document.getElementById("postcode");

	const form = document.forms[0];

	/******************************************************************************** */

	const finalise = () => {
		let tilelayerMenu = spotMap.selectMapMenu;
		tilelayerMenu.setAttribute("autofocus", "");
		tilelayerMenu.style.width ="80%";
		tilelayerMenu.style.margin="15px auto";
		tilelayerMenu.style.display ="flex";
		tilelayerMenu.style.textAlign="center";
		insertBeforeElem(tilelayerMenu, MAPCONTAINER);

		adressField.setAttribute("disabled", "");
		postcodeField.setAttribute("disabled", "");
		newAdressButton.style.display = "block";
		MAPCONTAINER.style.visibility = "visible";

	}

	const setMap = (manualInput) => {
		
		if(!MAPCONTAINER){return}

		let savedCoords = loadDataFromDomStorage("savedCoords", "session");
		let savedAdresses = loadDataFromDomStorage("savedAdresses", "session");

		if(savedCoords && savedAdresses && !manualInput){
			adressField.value = savedAdresses[0].adress ;
			postcodeField.value = savedAdresses[0].postcode ;

			spotMap = new UrbanMap(MAPCONTAINER, savedCoords[0].lat, savedCoords[0].long, zoomDegree);
			finalise();
		}else{
			let adressToUse = adressField.value ? adressField.value : null ;
			let postcodeToUse = postcodeField.value ? postcodeField.value : null;
			
			if(!adressToUse || !postcodeToUse){
				return;
			}
			
			if(postcodeField.value.length !== 5){
				return ;
			}

			let place = new AdressGetter();
			place.getCoordsFromAdress(adressToUse, postcodeToUse)
			.catch((error)=>{
				console.error(error);
				console.warn("Impossible de récupérer les coordonnées de l'emplacement à partir de son adresse.");
			})
			.then((coords) => {
				spotMap = new UrbanMap(MAPCONTAINER, coords.lat, coords.long, zoomDegree);
				removeDataFromDomStorage("savedCoords", "session");
				removeDataFromDomStorage("savedAdresses", "session");
				spotMap.saveCoordsToDOMStorage();
				spotMap.saveAdressToDOMStorage(adressField.value, postcodeField.value);
				finalise();
			})
			.catch((error)=>{
				console.error(error);
				console.warn("Impossible d'afficher la carte avec les coordonnées fournies.");
			});
		}	
	}

	(() => {
		setMap(false);
	})();

	const checkFormData = () => {		
		if(adressField.value.length > 0 && postcodeField.value.length === 5){	
			
			let postCodePattern = /[0-9]{5}/;
			if(postCodePattern.test(postcodeField.value)){
				setMap(true);
			}
		}
	}

	adressField.addEventListener("blur", ()=>{
		checkFormData();
	});

	postcodeField.addEventListener("keyup", ()=>{
		postcodeField.value = postcodeField.value.trim();
		if(postcodeField.value.length > 5){
			postcodeField.value	= postcodeField.value.substr(0, 5);
		}
			checkFormData();
	});
	
	form.addEventListener("submit", (e)=>{
		e.preventDefault();
		removeDataFromDomStorage("savedCoords", "session");
		removeDataFromDomStorage("savedAdresses", "session");
		location.reload(true);
	}) 


});
    
