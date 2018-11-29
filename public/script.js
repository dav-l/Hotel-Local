// Initialize Firebase

/* Primary code references for search bar (so far):
 * 
 * Get started with Cloud Firestore:
 * https://firebase.google.com/docs/firestore/quickstart#initialize
 * Getting Started With Cloud Firestore on the Web - Firecasts:
 * https://www.youtube.com/watch?time_continue=256&v=2Vf1D-rUMwE
 * Get data with Cloud Firestore: 
 * https://firebase.google.com/docs/firestore/query-data/get-data#get_all_documents_in_a_collection
 * Perform simple and compound queries in Cloud Firestore:
 * https://firebase.google.com/docs/firestore/query-data/queries
 * Cloud Firestore Quicktip — DocumentSnapshot vs. QuerySnapshot:
 * https://medium.com/@scarygami/cloud-firestore-quicktip-documentsnapshot-vs-querysnapshot-70aef6d57ab3
 * Firebase Firestore Tutorial #3 - Getting Documents:
 * https://www.youtube.com/watch?v=kmTECF0JZyQ
 *
 */

/*Informed by Chrome Console to place prior to calling Firestore functions
 (to avoid breaking app)*/
const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);

//Baseline cloud firestore references
const cityRef = firestore.collection('Cities');
const paRef = cityRef.doc('Palo Alto');
const sloRef = cityRef.doc('San Luis Obispo');
const smRef = cityRef.doc('Santa Monica');

//Id accesses for interacting with database queries
const searchButton = document.querySelector("#searchButton");
const searchInput = document.querySelector("#search");
const searchOutput = document.querySelector("#results");

const seasonalPrice = document.getElementById("seasonalPrice");

/*const winterPrice = document.querySelector("#winterPrice"); 
const springPrice = document.querySelector("#springPrice"); 
const summerPrice = document.querySelector("#summerPrice");*/

const parkButton = document.querySelector("#parkFilter");
const wifiButton = document.querySelector("#wifiFilter");

const rateDesButton = document.querySelector("#rateHigh");

const rateOneButton = document.querySelector("#ratingOne");
const rateTwoButton = document.querySelector("#ratingTwo");
const rateThreeButton = document.querySelector("#ratingThree");
const rateFourButton = document.querySelector("#ratingFour");

const priceLowToHigh = document.querySelector("#priceLow");
const priceHighToLow = document.querySelector("#priceHigh");

const priceEightHundred = document.querySelector("#priceEight");
const priceSixHundred = document.querySelector("#priceSix");
const priceFourHundred = document.querySelector("#priceFour");
const priceTwoHundred = document.querySelector("#priceTwo");

const clearFilterButton = document.querySelector("#clearFilter");

//Making universal input variable
var inputCity = '';

var hotelQuery;

//Default: prints out summer prices
var priceSeason = "winter";

var rateIn = 0;
var parkFilter = false;
var wifiFilter = false;
var rateFilter = false;
var rateSort = false;

var priceFilter = false;
var lowestPrice = false;
var highestPrice = false;

//Given user's searchbar input, if city is valid, call hotelLoop
function pickCity() {
	inputCity = searchInput.value.toLowerCase();
	//If input city is Palo Alto:
	if (inputCity == "palo alto") {
		hotelLoop(paRef);
	} else if (inputCity == "san luis obispo") {
		//If San Luis Obispo:
		hotelLoop(sloRef);
	} else if (inputCity == "santa monica") {
		//If Santa Monica: 
		hotelLoop(smRef);
	} else {
		//Otherwise, print unavailable message and display window
		searchOutput.innerText = "Information for hotels in " + inputCity + " unavailable\n";
		window.alert("Sorry, we don't have info for hotels in that city yet.");
	}
}

//Allow for price sorting
function priceSortingOptions(queryHotel) {
	if (lowestPrice) { //in case of sorting based on price: high -> low
			return queryHotel = priceSort(queryHotel, priceSeason, 'asc');
	} else if (highestPrice) { //in case of sorting based on price: low -> high
			return queryHotel = priceSort(queryHotel, priceSeason, 'desc');
	} else {
		return queryHotel;
	}
}

//Given displayed price and order of ascension, sort by price
function priceSort(hotelList, price, ascendOrder) {
	var priceAttribute;
	switch (price) {
		//if winter -> grab priceWinter
		case 'winter':
			priceAttribute = 'priceWinter';
			break;
		//if spring -> grab priceSpring
		case 'spring':
			priceAttribute = 'priceSpring';
			break;
		//if summer -> grab priceSummer
		case 'summer':
			priceAttribute = 'priceSummer';
			break;
	}
	//if sorting from high to low
	if (ascendOrder == 'desc') {
		return hotelList.orderBy(priceAttribute, 'desc');
	} else { //if sorting from low to high
		return hotelList.orderBy(priceAttribute);
	}
}

//Go through each document in hotel collection (given a city document) to print
function hotelLoop(hotelCity) {
	//Clear output box upon each search request
	searchOutput.innerText = "";
	
	//in case of rating filter
	if (rateFilter) {
		//refer to hotels collection in given city
		switch (rateIn) {
			//rating 1 star & up
			case 1:
				hotelQuery = hotelCity.collection('Hotels');
				break;
			//rating 2 stars & up
			case 2:
				hotelQuery = hotelCity.collection('Hotels 2 Star');
				break;
			//rating 3 stars & up
			case 3:
				hotelQuery = hotelCity.collection('Hotels 3 Star');
				break;
			//rating 4 stars & up
			case 4:
				hotelQuery = hotelCity.collection('Hotels 4 Star');
				break;
		}
	} else {
		//use default collection in case of no rating filter
		hotelQuery = hotelCity.collection('Hotels');
	}
	
	//in case of price filtering
	if (priceFilter) {
		//set up range of pricing
		switch (priceSeason) {
			case 'winter':
				hotelQuery = hotelQuery.where('priceWinter', "<=", priceIn);
				break;
				
			case 'spring':
				hotelQuery = hotelQuery.where('priceSpring', "<=", priceIn);
				break;
				
			case 'summer':
				hotelQuery = hotelQuery.where('priceSummer', '<=', priceIn);
				break;
		}
		hotelQuery = priceSortingOptions(hotelQuery);
	} else {
		if (rateSort) {
			hotelQuery = hotelQuery.orderBy('Rating', 'desc');
		} else {
			hotelQuery = priceSortingOptions(hotelQuery);
		}
	}
	
	//Within each document of the hotel collection
	hotelQuery.get().then(function(hotelSnap) {
		hotelSnap.docs.forEach(function(hotelDoc) {
			//call the printing function
			hotelPrint(hotelDoc);
		})
	}).catch(function(error) {
		console.log("Can't get each hotel snapshot");
	})
}

//For a given hotel document, print it's attributes
function hotelPrint(hotel) {
	//Obtaining the hotel data:
	const currentHotel = hotel.data();
	
	//Skip entry if parking filter is on and parking != true
	if (parkFilter && (currentHotel.Parking != true)) {
		searchOutput.innerText += "";
		return;
	}
	
	//Skip entry if wifi filter is on and wifi != true
	if (wifiFilter && (currentHotel.Wifi != true)) {
		searchOutput.innerText += "";
		return;
	}
	
	//Start of each hotel output line with name and attributes
	searchOutput.innerText += hotel.id + " - \tParking: ";
	
	//Based on data in Firestore, print a readable output
	if (currentHotel.Parking == true) {
		searchOutput.innerText += "free,";
	} else {
		searchOutput.innerText += "none,";
	}
	
	switch (priceSeason) {
		//Print out winter pricing attribute
		case "winter":
			searchOutput.innerText += "\tWinter Pricing: $" + currentHotel.priceWinter;
			break;
		//Print out spring pricing attribute	
		case "spring":
			searchOutput.innerText += "\tSpring Pricing: $" + currentHotel.priceSpring;
			break;
		//Print out summer pricing attribute
		case "summer":
			searchOutput.innerText += "\tSummer Pricing: $" + currentHotel.priceSummer;
			break;
	}
	
	
	//Print out rating
	searchOutput.innerText += "\tRating: " + currentHotel.Rating + ",\tWifi: ";
	//and wifi availability
	if (currentHotel.Wifi == true) {
		searchOutput.innerText += "available\n";
	} else {
		searchOutput.innerText += "unavailable\n";
	}
}

//Search in case "SEARCH" button clicked directly
searchButton.addEventListener("click", function() {
	pickCity();
})

function seasonChange() {
	priceSeason = seasonalPrice.value;
	pickCity();
}

//Parking Filtering
parkButton.addEventListener("click", function() {
	parkFilter = true;
	pickCity();
})

//Wifi Filtering
wifiButton.addEventListener("click", function() {
	wifiFilter = true;
	pickCity();
})

rateDesButton.addEventListener("click", function() {
	rateSort = true;
	lowestPrice = false;
	highestPrice = false;
	pickCity();
})

//Rating sorting functionality
//Rate 1 stars and up
rateOneButton.addEventListener("click", function() {
	rateFilter = true;
	rateIn = 1;
	pickCity();
})

//Rate 2 stars and up
rateTwoButton.addEventListener("click", function() {
	rateFilter = true;
	rateIn = 2;
	pickCity();
})

//Rate 3 stars and up
rateThreeButton.addEventListener("click", function() {
	rateFilter = true;
	rateIn = 3;
	pickCity();
})

//Rate 4 stars and up
rateFourButton.addEventListener("click", function() {
	rateFilter = true;
	rateIn = 4;
	pickCity();
})

//Sorting entries based on pricing from low to high
priceLowToHigh.addEventListener("click", function() {
	inputCity = searchInput.value.toLowerCase();
	rateSort = false;
	lowestPrice = true;
	highestPrice = false;
	pickCity();
})

//Sorting entries based on pricing from high to low
priceHighToLow.addEventListener("click", function() {
	inputCity = searchInput.value.toLowerCase();
	rateSort = false;
	lowestPrice = false;
	highestPrice = true;
	pickCity();
})

//price $800 and below
priceEightHundred.addEventListener("click", function() {
	inputCity = searchInput.value.toLowerCase();
	priceFilter = true;
	priceIn = 800;
	pickCity();
})

//price $600 and below
priceSixHundred.addEventListener("click", function() {
	inputCity = searchInput.value.toLowerCase();
	priceFilter = true;
	priceIn = 600;
	pickCity();
})

//price $400 and below
priceFourHundred.addEventListener("click", function() {
	inputCity = searchInput.value.toLowerCase();
	priceFilter = true;
	priceIn = 400;
	pickCity();
})

//price $200 and below
priceTwoHundred.addEventListener("click", function() {
	inputCity = searchInput.value.toLowerCase();
	priceFilter = true;
	priceIn = 200;
	pickCity();
})

//Clear all filtering options
clearFilterButton.addEventListener("click", function() {
	parkFilter = false;
	wifiFilter = false;
	
	rateSort = false;
	rateFilter = false;
	
	priceFilter = false;
	lowestPrice = false;
	highestPrice = false;
	
	rateIn = 0;
	priceIn = 0;
	pickCity();
})
