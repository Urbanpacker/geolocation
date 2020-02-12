'use strict';


/*************************************************************************************************/
/* ****************************************** DATA ****************************************** */
/*************************************************************************************************/

var postCodePattern = /[0-9]{5}/;
var coordsPattern = /[0-9]{1,3}.?[0-9]*/;
var emailPattern = /[a-z0-9\.\-\_]+@[a-z0-9\.-\_]+\.[a-z]+/i;

/*************************************************************************************************/
/* ***************************************** FUNCTIONS ***************************************** */
/*************************************************************************************************/

/**************** DATA INTEGRITY CONTROLLER ***********************/

// Triggers the checkInputFormat and checkCurrentRequiredField function when inputs blur 
		
function checkDataOnBlur(){
	var pattern ;
	this.value = this.value.trim();
	
	if(this.hasAttribute('required')){
		checkCurrentRequiredField(this);
	}
	
	if(this.id === 'email'){
		pattern = emailPattern ;
	} else if(this.id === 'postCode'){
		pattern = postCodePattern;
	} else if (this.id === 'longitude' || this.id === 'latitude') {
		if(~this.value.indexOf(',')){
			this.value = this.value.replace(',', '.') ;
		}
		pattern = coordsPattern ;	
	} else{
		return;
	}
		checkInputFormat(this, this.value, pattern);
}


/* Checks that a required field are not empty */
function checkCurrentRequiredField(inputField){
	if(inputField.value ==""){
		inputField.value = '';
		inputField.placeholder = "Ce champ est obligatoire";
		inputField.classList.add('invalid');
		inputField.classList.remove('valid');
	} else{
		inputField.classList.remove('invalid');
		inputField.classList.add('valid');
	}

}


/* Checks that the structure of an input content fits with a specific pattern */

function checkInputFormat(domElement, inputContent, inputPattern){
	var typeOfInput = domElement.id;
	var fieldNotice = document.getElementById('invalid'+ucFirst(typeOfInput)+'Item') ;
	if(!fieldNotice){
		fieldNotice = document.createElement('p');
		fieldNotice.id = 'invalid'+ucFirst(typeOfInput)+'Item' ;
		fieldNotice.classList.add("error");
		fieldNotice.innerHTML = 'Le contenu du champ <em>'+typeOfInput+'</em> est invalide.' ;
	}
	if(inputContent && !(inputPattern.test(inputContent))){
		fieldNotice.style.display = 'block' ;
		domElement.classList.remove('valid');
		domElement.classList.add('invalid');
		insertAfter(fieldNotice, domElement);
	} else{
		if(inputContent){
			domElement.classList.add('valid');
			domElement.classList.remove('invalid');
		} else {
			domElement.classList.remove('valid');
		}
		fieldNotice.style.display = 'none';
	}
}


/* Checks that all the required fields are filled in before submit */
function checkNoErrorBeforeSubmit(e){
	let test = document.getElementsByClassName('invalid');
	
	if(test.length > 0){
		let s = (test.length > 1) ? 's' : '';
		alert('Il y a '+ test.length +' erreur'+s+' dans le formulaire. \nVeuillez vérifier la validité des données saisies.');	
		e.preventDefault();
	}
	
}       

/* Check text area length and display a countdown as long as it is filled */

function textAreaLengthCount(){
	
	if(this.value.length > 240){
		this.value = this.value.substr(0,240); 
	}
	
	var remainingChars = 240 - this.value.length ; 
	
	var fieldNotice = document.getElementById('length'+ucFirst(this.id)+'Notice') ;
	if(!fieldNotice){
		fieldNotice = document.createElement('p');
		fieldNotice.id = 'length'+ucFirst(this.id)+'Notice' ;
		fieldNotice.classList.add("notice");
		
	}
	if(this.value){
		fieldNotice.style.display = 'block' ;
		insertAfter(fieldNotice, this);
		fieldNotice.innerHTML = 'Il vous reste <em>'+remainingChars + '</em> caractères maximum à saisir.';
	} else{
		fieldNotice.style.display = 'none';
	}
}


/*************************************************************************************************/
/* ************************************** MAIN CODE *************************************** */
/*************************************************************************************************/

window.addEventListener('DOMContentLoaded', (function(){
	
	var fields = document.querySelectorAll('input, textarea, select');
	var submitForm = document.querySelector("button[type='submit']");
	var resetForm = document.querySelector("button[type='reset']");

	
// Listeners on focus / blur events to check filling of required fields and  data format
	if(fields.length>0){
		for(let i = 0, c = fields.length ; i < c ; ++i){
			fields[i].addEventListener('focus', function(){
			// Remove JS border of the input when focused to set back the :focused border already defined in the CSS
				this.style.border='';
			});
			// Triggers controls of integrity of input data when blur
			fields[i].addEventListener('blur', checkDataOnBlur);
		}
	}

// Reload the form if reset button is clicked	
	if(resetForm){
		resetForm.addEventListener('click', function(){
			document.location.reload();
		});
	}
	
	
// Checks before submitting the form
	if(submitForm){
		submitForm.addEventListener('click', checkNoErrorBeforeSubmit);
	}
	
	var textareas = document.getElementsByTagName('textarea');
	
	if(textareas.length>0){
		for(let i = 0, c = textareas.length ; i < c ; ++i){
			// Triggers controls of integrity of input data when blur
			textareas[i].addEventListener('keyup', textAreaLengthCount);
		}
	}
	
}));
