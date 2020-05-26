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
			/*	neighbourhood : "https://tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png",
				landscape : "http://tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png",
				transport : "http://tile2.opencyclemap.org/transport/{z}/{x}/{y}.png",
				spinalMap : "https://tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png",
				outdoors : "http://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png",
			*/
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
		}
		setOSMMap = (tileLayer = this.mapTileLayers.default) => {
			// Checks that a container has been set
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
			L.tileLayer(tileLayer,{
				maxzoom:19,
				attribution:'(c)<a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
			}).addTo(this.leafletMap);
		}

		addPosition(position){
			this.positions.push(...position) ;
		}

		setMarker = (lat = this.coords.lat, long = this.coords.long)=>{
			L.marker([lat,long]).addTo(this.leafletMap);
		}
		setSeveralMarkers = (positions) =>{
			for(let i = 0, c = positions.length ; i<c ; i++){
				L.marker([positions[i].lat,positions[i].long]).addTo(this.leafletMap);
			}	
		}
	}

	export {UrbanMap};