    class UrbanMap {
		constructor(container, lat, long, zoomDegree = 15){
			this.mapTileLayers = {
				default : "http://tile.openstreetmap.org/{z}/{x}/{y}.png",
				richer : "http://a.tile.openstreetmap.fr/osmfr/{z}/{x}/	{y}.png",
				cycloMap : "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
				hikeBike : "https://tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png",
				waterColor : "http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg",
				humanitarian : "http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
				toner : "http://tile.stamen.com/toner-lite/{z}/{x}/{y}.png",
			/* WARNING : only the tilelayer above are free of use and do not need an API key to run correctly */
			/*You will need to register to use the following ones */
				neighbourhood : "https://tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png",
				landscape : "http://tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png",
				transport : "http://tile2.opencyclemap.org/transport/{z}/{x}/{y}.png",
				spinalMap : "https://tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png",
				outdoors : "http://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png",
			}
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
			this.positions = [this.coords] ;
			this.selectMapMenu ;

			/* Add the stored spot coordinates to the currently handled object UrbanMap */
			let addingCoords = loadDataFromDomStorage("savedCoords", "session");
			if(addingCoords){
				this.addPosition(addingCoords);
			}

			/* Gets the user's preferred tilelayer from the client DOM Storage */
			this.setTileLayer();
			/* Create an OSM Map with the preferred tilelayer*/
			this.setOSMMap(this.mapTileLayer);
			this.setMarker();
		}

		setOSMMap = (tileLayer = this.mapTileLayers.default) => {
			/* Checks that a container has been set*/
			if(!this.mapContainer){
				console.log("Pas de conteneur défini pour la carte")
				return;
			}
			/* Checks that no map has already been set in the container */
			if(this.mapContainer.classList.contains("leaflet-container")){
				console.error("Une carte a déjà été créée dans ce conteneur");
				return;
			}
			
			/* Initializes a OSM Map with options */
			this.leafletMap = L.map(this.mapContainer.id).setView(this.zoomPoint, this.zoomDegree);
			this.mapContainer.classList.add("map");
			/* Loads the OSM tileLayer (map background) */
			L.tileLayer(tileLayer,{
				maxzoom:19,
				attribution:'(c)<a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
			}).addTo(this.leafletMap);
		}

		addPosition(position){
			this.positions.push(...position) ;
		}

		/*Set markers onto the displayed OSM Map */
		setMarker = (lat = this.coords.lat, long = this.coords.long)=>{
				/*Triggers the "several markers setting" method if there are saved positions */		
				if(this.positions.length > 1){
					this.setSeveralMarkers(this.positions);
				} else {
					L.marker([lat,long]).addTo(this.leafletMap);
			}
		}

		setSeveralMarkers = (positions) =>{
			for(let i = 0, c = positions.length ; i<c ; i++){
				L.marker([positions[i].lat,positions[i].long]).addTo(this.leafletMap);
			}	
		}

		saveCoordsToDOMStorage = () => {
			let savedCoords = loadDataFromDomStorage("savedCoords", "session");
			removeDataFromDomStorage("savedCoords", "session");
			let coordsPresentInStorage = false;
			/*If the DOM storage is empty, we create a new array with the currentspot position as a first element */
			if(savedCoords === null){
				savedCoords = [];
				savedCoords.push({lat : this.coords.lat, long : this.coords.long});
			} else{
			/* We check that the current spot position has not been saved in the DOM storage yet */
				for(let i = 0, c = savedCoords.length ; i < c ; i++){
					if(((savedCoords[i].lat === this.coords.lat) && (savedCoords[i].long === this.coords.long))){
						coordsPresentInStorage = true ;		
					}
				}
			/* If the current position has not been stored, we put it into the storage */
				if(!coordsPresentInStorage){
					savedCoords.push({lat : this.coords.lat, long : this.coords.long})
				}
			}
			saveDataToDomStorage("savedCoords", savedCoords, "session");
		}

		saveAdressToDOMStorage = (adress, postcode) => {
			let savedAdresses = loadDataFromDomStorage("savedAdresses", "session");
			removeDataFromDomStorage("savedAdresses", "session");
			let adressPresentInStorage = false;
			/*If the DOM storage is empty, we create a new array with the current adress as a first element */
			if(savedAdresses === null){
				savedAdresses = [];
				savedAdresses.push({adress : adress, postcode : postcode});
			} else{
			/* We check that the current adress has not been saved in the DOM storage yet */
				for(let i = 0, c = savedAdresses.length ; i < c ; i++){
					if(((savedAdresses[i].adress === adress) && (savedAdresses[i].postcode === postcode))){
						adressPresentInStorage = true ;		
					}
				}
			/* If the current position has not been stored, we put it into the storage */
				if(!adressPresentInStorage){
					savedAdresses.push({adress : adress, postcode : postcode})
				}
			}
			saveDataToDomStorage("savedAdresses", savedAdresses, "session");
		}

		setTileLayer = () => {
			/* Put every tilelayer of a the created UrbanMap into an array in order to use of it later easily */
			var tileLayers = [] ;
			for(let prop in this.mapTileLayers){
				tileLayers.push(this.mapTileLayers[prop]);
			}

			/* Load the user chosen tilelayer and set it */
			let preferedMap = loadDataFromDomStorage("preferedMapTileLayer", "local") || 0;
			this.mapTileLayer = tileLayers[preferedMap];
			
			/****Scrolling menu to choose a map tilelayer */
			let selectMapMenu = document.createElement("select");
			let optNumber = 0 ;
			for(let prop in this.mapTileLayers){
				let opt = document.createElement("option");
				opt.value = optNumber;
				opt.innerText = ucFirst(prop);
				if(optNumber === preferedMap){
					opt.setAttribute("selected", "");
				}
				selectMapMenu.appendChild(opt);
				++optNumber;
			}
			this.selectMapMenu = selectMapMenu;

			/* Event listener watching the change of map tilelayer by the user. On change, replace the preferred tile layer in the local DOM Storage */
			selectMapMenu.onchange = (e) => {
				let preferedMapTileLayer = 0;
				for (let i =0, c = tileLayers.length ; i< c ; i++){
					if(i === e.target.selectedIndex){
						preferedMapTileLayer = i;
					}
				}
				removeDataFromDomStorage("preferedMapTileLayer", "local");
				saveDataToDomStorage("preferedMapTileLayer", preferedMapTileLayer, "local");
				location.reload(true);
			};
		}
	}

	export {UrbanMap};