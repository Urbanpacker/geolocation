class AdressGetter{
	getCoordsFromAdress = (adress, postCode) => {
		return new Promise((successCallback, failureCallback) => {
			if(!postCode || !adress){return}
			adress = adress.replace(/ /g, "+");
			var url = "https://api-adresse.data.gouv.fr/search/?q="+adress+"&postcode="+postCode;
			if(window.fetch){ // if the navigator supports the relatively recent fetch API
				fetch(url)
				.then((response)=>{
					return response.json();
				})
				.then((data)=>{
					let long = data.features[0].geometry.coordinates[0];
					let lat = data.features[0].geometry.coordinates[1];
					successCallback({adress, postCode, long, lat});
				})
				.catch((error)=>{
					failureCallback(error);
				});
			} else{ // if the navigator does not support fetch API, then it uses traditionnal XHR method
				var request = new XMLHttpRequest();
				request.open('GET', url, true);
				request.onload = function() {
					if (this.status >= 200 && this.status < 400){
						let data = JSON.parse(this.response);
						let long = data.features[0].geometry.coordinates[0];
						let lat = data.features[0].geometry.coordinates[1];
						successCallback({adress, postCode, long, lat});
					} else {
						console.log('The target server has been reached, but it returned an error');
						failureCallback();
					}
				};
				request.onerror = (error) => {
					console.log('There was a connection error of some sort');
					failureCallback(error);
				};
				request.send();
			}
		});
	}
}

export {AdressGetter};

