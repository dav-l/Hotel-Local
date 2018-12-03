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
 * Colors for the table fonts and background found on Color Picker Tool:
 * https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Colors/Color_picker_tool
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
//Search bar and button
const searchButton = document.querySelector("#searchButton");
const searchInput = document.querySelector("#search");
//Seasonal price drop-down list
const seasonalPrice = document.getElementById("seasonalPrice");
//Park/wifi filters
const parkButton = document.querySelector("#parkFilter");
const wifiButton = document.querySelector("#wifiFilter");
//Rate sort
const rateDesButton = document.querySelector("#rateHigh");
//Rate Filters
const rateOneButton = document.querySelector("#ratingOne");
const rateTwoButton = document.querySelector("#ratingTwo");
const rateThreeButton = document.querySelector("#ratingThree");
const rateFourButton = document.querySelector("#ratingFour");
//Price sorts
const priceLowToHigh = document.querySelector("#priceLow");
const priceHighToLow = document.querySelector("#priceHigh");

//Price Filters
const priceEightHundred = document.querySelector("#priceEight");
const priceSixHundred = document.querySelector("#priceSix");
const priceFourHundred = document.querySelector("#priceFour");
const priceTwoHundred = document.querySelector("#priceTwo");
//Clear filters
const clearFilterButton = document.querySelector("#clearFilter");

//Making universal input variable
var inputCity = '';
//Making empty table data
var resultTable = '';

//Depending on which collection of data needed (for sorting later on)
var hotelQuery;

//Default: prints out summer prices
var priceSeason = "winter";

//Filter values (rating and price)
var rateIn = 0;
var priceIn = 0;

//Basic filtering
var parkFilter = false;
var wifiFilter = false;
//Rate filtering
var rateFilter = false;
var rateSort = false;
//Price filtering
var priceFilter = false;
var lowestPrice = false;
var highestPrice = false;

//Given user's searchbar input, if city is valid, call hotelLoop
function pickCity() {
	//In case of weird/forgotten capitalization on input
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
		window.alert("Sorry, we don't have info for hotels in that city yet.");
	}
}

//Allow for price sorting
function priceSortingOptions(queryHotel) {
	if (lowestPrice) { //in case of sorting based on price: high -> low
			return queryHotel = priceSort(queryHotel, priceSeason, 'asc');
	} else if (highestPrice) { //in case of sorting based on price: low -> high
			return queryHotel = priceSort(queryHotel, priceSeason, 'desc');
	} else { //otherwise, return unsorted hotel query
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
	//Clear output table upon each search request
	$("#resultsTable tbody").empty();
	
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
			//In case of winter pricing:
			case 'winter':
				hotelQuery = hotelQuery.where('priceWinter', "<=", priceIn);
				break;
			//In case of spting pricing:	
			case 'spring':
				hotelQuery = hotelQuery.where('priceSpring', "<=", priceIn);
				break;
			//In case of summer pricing:
			case 'summer':
				hotelQuery = hotelQuery.where('priceSummer', '<=', priceIn);
				break;
		}
		//Check for price sorting
		hotelQuery = priceSortingOptions(hotelQuery);
	} else { //otherwise, still check for sorting without price filtering
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
		
		//Add table data to output table
		$(resultTable).appendTo("#resultsTable tbody");
		//Be sure to clear result data for next search call
		resultTable = '';
		
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
		resultTable += "";
		return;
	}
	
	//Skip entry if wifi filter is on and wifi != true
	if (wifiFilter && (currentHotel.Wifi != true)) {
		resultTable += "";
		return;
	}
	
	//Start of each hotel output line with name and attributes
    resultTable += "<tr><td>" + hotel.id + "</td>";
	
	//Based on data in Firestore, print a readable output
	if (currentHotel.Parking == true) {
		resultTable += "<td>free</td>";
	} else {
		resultTable += "<td>none</td>";
	}
	
	switch (priceSeason) {
		//Print out winter pricing attribute
		case "winter":
			resultTable += "<td>$" + currentHotel.priceWinter + "</td>";
			break;
		//Print out spring pricing attribute	
		case "spring":
			resultTable += "<td>$" + currentHotel.priceSpring + "</td>";
			break;
		//Print out summer pricing attribute
		case "summer":
			resultTable += "<td>$" + currentHotel.priceSummer + "</td>";
			break;
	}
	
	//Print out rating
	resultTable += "<td>" + currentHotel.Rating + "</td>";
	
	//and wifi availability
	if (currentHotel.Wifi == true) {
		resultTable += "<td>available</td></tr>";
	} else {
		resultTable += "<td>unavailable</td></tr>";
	}
}

//Search in case "SEARCH" button clicked directly
searchButton.addEventListener("click", function() {
	pickCity();
})

//Display prices for season on drop-down list
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

//Sort based on rating from High to Low
rateDesButton.addEventListener("click", function() {
	rateSort = true;
	lowestPrice = false;
	highestPrice = false;
	pickCity();
})

//Rating filtering functionality
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
	
	//$('input[name=price]').attr('checked', false);
	var filterPrice = document.getElementsByName("price");
	for (var i = 0; i < filterPrice.length; i++) {
		filterPrice[i].checked = false;
	}
	
	rateIn = 0;
	priceIn = 0;
	pickCity();
})


//Sidebar Toggle-----------------------------
/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
	document.getElementById("index").style.marginLeft = "250px";
	document.getElementById("navBar").style.marginLeft = "250px";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
	document.getElementById("index").style.marginLeft = "0";
	document.getElementById("navBar").style.marginLeft = "0";
}