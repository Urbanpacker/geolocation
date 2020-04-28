	class SingleLocation{
		constructor(adress, postCode){
			this.adress = adress;
			this.postCode = postCode;
			this.lat ;
			this.long ;
		}	
		getCoordsFromAdress = () => {
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