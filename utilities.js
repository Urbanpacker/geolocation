'use strict';  

/*************************************************************************************************/
/* *********************************** UTILITIES *********************************** */
/*************************************************************************************************/

function insertAfter(newElement, afterElement){
    var parent = afterElement.parentNode;
    
    if(parent.lastChild === afterElement){   
    // if the last element is the one after which we want to insert it, then we use appendChild()
        parent.appendChild(newElement);
    } else {
    // In the opposite case, we use insertBefore() onto the element following the afterElement  
        parent.insertBefore(newElement, afterElement.nextSibling)
    }
}


/*********************/

function lcFirst(str) {
  if (str.length > 0) {
    return str[0].toLowerCase() + str.substring(1);
  } else {
    return str;
  }
}

/*****************/

function ucFirst(str) {
  if (str.length > 0) {
    return str[0].toUpperCase() + str.substring(1);
  } else {
    return str;
  }
}

/*****************/


function getRandomInteger(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
    
}

/*****************/

function requestInteger(message, min, max)
{
    var integer;

    do
    {
        integer = parseInt(window.prompt(message));
    }
    while(isNaN(integer) == true || integer < min || integer > max);

    return integer;
}

// Equivalent de money_format() / number_format() en PHP
function formatMoneyAmount(amount)
{
    var formatter;

    formatter = new Intl.NumberFormat('fr',
    {
        currency              : 'eur',
        maximumFractionDigits : 2,
        minimumFractionDigits : 2,
        style                 : 'currency'
    });

    return formatter.format(amount);
}

/*****************/

function isNumber(value) {
    if(!isNaN(value)){
        return true;
    } else{
        return false;
    }
}

/*****************/

function loadDataFromDomStorage(name, typeOfStorage){
    var jsonData;
    if(typeOfStorage === 'local'){
        jsonData = window.localStorage.getItem(name);
    } else {
        jsonData = window.sessionStorage.getItem(name);
    }     
    return JSON.parse(jsonData);
}

/*****************/

function removeDataFromDomStorage(name, typeOfStorage){
    if(typeOfStorage === 'local'){
        window.localStorage.removeItem(name);
    } else {
        window.sessionStorage.removeItem(name);
    }     
}


		
/*****************/


function saveDataToDomStorage(name, data, typeOfStorage){
    var jsonData = JSON.stringify(data);
    if(typeOfStorage === 'local'){
        window.localStorage.setItem(name, jsonData);
    } else {
        window.sessionStorage.setItem(name, jsonData);
    }     

}


/***************************************/
