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
		}
		setOSMMap = () => {
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
			L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
				maxzoom:19,
				attribution:'(c)<a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
			}).addTo(this.leafletMap);
		}

		setMarker = (lat = this.coords.lat, long = this.coords.long)=>{
			L.marker([lat,long]).addTo(this.leafletMap);
		}
	}