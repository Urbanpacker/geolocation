'use strict' ;
	const mapContainerId = "mapContainer" ;
	const mapTriggerId = "mapTrigger";
	const zoomDegree = 15 ;

	const places = [];
	var myMap ;

    window.addEventListener('DOMContentLoaded', ()=>{
        const DOMCONTAINER = document.getElementById(mapContainerId);
        const MAPTRIGGER = document.getElementById(mapTriggerId);
    
        if(DOMCONTAINER && MAPTRIGGER){
            MAPTRIGGER.addEventListener('click', e => {
                e.preventDefault();
                let adress = document.forms[0].elements["adress"].value ;
                let postcode = document.forms[0].elements["postcode"].value ;
                        
                if(!adress || !postcode){return}
                    // Add a new object "SingleLocation" to the array places[]
                places[places.length] = new SingleLocation(adress, postcode);
                
                // Gets GPS coordinates from the postal adress set in the last SingleLocation object that has been created
                places[places.length-1].getCoordsFromAdress();
                    // Minuteur laissant le temps à l'API SingleLocation.getCoordsFromAdress() de récupérer les coordonnées GPS
                window.setTimeout(()=>{
                    if(myMap ===  undefined){
                        let lat = places[places.length-1].lat ;
                        let long = places[places.length-1].long;
                        myMap = new UrbanMap(DOMCONTAINER, lat, long, zoomDegree);
                        myMap.setOSMMap();
                        myMap.setMarker();
                    } else {
                        myMap.setMarker(places[places.length-1].lat, places[places.length-1].long);
                    }
                }, 2500);
            });
        }
    });
