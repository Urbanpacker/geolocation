'use strict';

/*************** DATA ***************/
//Set the time allocated to the navigator to get the current position
const gettingCoordsMaxDelay = 5000 ;
//Set the minimal accuracy of the process of geolocation authorized to accept the data thzt provides
const minGeolocAccuracy = 50 ;

//Gloabl variable used to share the current coordinates between the several functions of the scripts
var currentCoords =  null;

/*************** FUNCTIONS ***************/

function getCurrentPosition(){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(successGeo, failGeo, {enableHighAccuracy:false, maximumAge:Infinity, timeout: gettingCoordsMaxDelay});
	} else {
		let errorMessage = "Votre navigateur ne supporte pas la fonction geolocalisation.";
		console.warn(errorMessage);
	}
}

//Callback in case of success of the geolocation
function successGeo ({coords}){
	let coordsAccuracyReliable = coords.accuracy <= minGeolocAccuracy ? true : false;
	if(coordsAccuracyReliable){
		currentCoords = coords ;
	} else{
		let errorMessage = "La précision de la géolocalisation n\'est pas suffisante (inférieure à "+ minGeolocAccuracy + " mètres) pour indiquer votre position de manière fiable. \n Veuillez rafraîchir la page et réeessayer ultérieurement.";
		console.warn(errorMessage);
	}
}

// In case of geolocation failure, writes error message
function failGeo(error){
	let errorMessage = "";
	switch(error.code){
		case error.UNKNOWN_ERROR :
			errorMessage += "Une erreur inconnue s'est produite.";
			break;
		case error.PERMISSION_DENIED :
			errorMessage += "La permission de récupérer la position n'a pas été accordée.\nVeuillez rafraîchir la page et réeessayer.";
			break;
		case error.POSITION_UNAVAILABLE :
			errorMessage += "La position n'a pas pu être déterminée.";
			break;
		case error.TIMEOUT :
			errorMessage += "Le délai maximal d'attente défini pour récupérer la position est dépassé.";
			break;
		default :
			errorMessage += error.message;
	}
	console.error(errorMessage);
}
	
//Set the current position in the session DOMstorage, replace the former one if any
function setNewPositionIntoStorage(coords){
	let formerMemberPosition = loadDataFromDomStorage('memberPosition', 'session');
	if(formerMemberPosition !== undefined){
		if(formerMemberPosition === coords){
			return;
		}
		removeDataFromDomStorage('memberPosition', 'session');
	}
	saveDataToDomStorage('memberPosition', coords, 'session');
}

/**************MAIN CODE **************/

window.addEventListener('DOMContentLoaded', ()=>{
	getCurrentPosition();
	//Wait 
	window.setTimeout(()=> {
		if(currentCoords){
			console.log("Coordonnées courantes récupérées");
			console.log("La lat est "+currentCoords.latitude);
			console.log("La long est "+currentCoords.longitude);
			console.log("La précision de la mesure (en mètres) est "+currentCoords.accuracy);
			setNewPositionIntoStorage(currentCoords);		
		}
	},gettingCoordsMaxDelay+100);
});
