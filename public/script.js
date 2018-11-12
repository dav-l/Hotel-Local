// Initialize Firebase code goes here

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


//Go through each document in hotel collection (given a city document) to print
function hotelLoop(hotelList) {
	//Clear output box upon each search request
	searchOutput.innerText = "";
	//refer to hotels collection in given city
	const hotelQuery = hotelList.collection('Hotels');
	
	//within hotels collection, call hotelPrint on each hotel document
	hotelQuery.get().then(function(hotelSnap) {
		hotelSnap.docs.forEach(function(hotelDoc) {
			hotelPrint(hotelDoc);
		})
	})
	
}

//For a given hotel document, print it's attributes
function hotelPrint(hotel) {
	//Start of each hotel output line with name and attributes
	searchOutput.innerText += hotel.id + " - \tParking: ";
	const currentHotel = hotel.data();
	
	//Based on data in Firestore, print a readable output
	if (currentHotel.Parking == true) {
		searchOutput.innerText += "free,";
	} else {
		searchOutput.innerText += "none,";
	}
	
	searchOutput.innerText += "\tRating: " + currentHotel.Rating + ",\tWifi: ";
	
	if (currentHotel.Wifi == true) {
		searchOutput.innerText += "available\n";
	} else {
		searchOutput.innerText += "unavailable\n";
	}
}

//Linking up functions to actual search bar functionality
searchButton.addEventListener("click", function() {
	const inputCity = searchInput.value;
	
	//Given user's searchbar input, if city is valid, call hotelLoop
	if (inputCity == "Palo Alto") {;
		hotelLoop(paRef);
	} else if (inputCity == "San Luis Obispo") {
		hotelLoop(sloRef);
	} else if (inputCity == "Santa Monica") {
		hotelLoop(smRef);
	} else {
		//Otherwise, print unavailable message and display window
		window.alert("Sorry, we don't have info for hotels in that city yet.");
		searchOutput.innerText = "Information for hotels in " + inputCity + " unavailable\n";
	}
})