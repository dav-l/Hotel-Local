//-- Firebase initialization/config with API key goes here --

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

//Output string
const results = "";

//Go through each document in hotel collection to print
function hotelLoop(hotelList. results) {
	var hotelQuery = hotelList.collection('Hotels');
	hotelQuery.get().then(function(hotelSnap) {
			if (hotelSnap.empty) {
				console.log('No documents in Hotels');
			} else {
				hotelSnap.forEach(function(hotelDoc) {
					hotelPrint(hotelDoc, results);
				});
			}
		})
		.catch(function(error) {
			console.log('Error fetching collection', error);
		});
}

//For a given hotel document, print it's attributes
function hotelPrint(hotel, results) {
	hotel.get().then(function(docSnap) {
		if (docSnap && docSnap.exists) {
			const currentHotel = docSnap.data();
			
			results += docSnap.id + " - Parking: ";
			if (currentHotel.Parking == true) {
				results += "free, ";
			} else {
				results += "none, "
			}
			
			results += "Rating: " + currentHotel.Rating + ", Wifi: "; 
			
			if (currentHotel.Wifi == true) {
				results += "available";
			} else {
				results += "unavailable";
			}
			
			results += "<br>";
			console.log(docSnap.id, "status read!");
		}
	})
	.catch(function(error) {
			console.log('Error getting documents', error);
		});
}

//Linking up functions to actual search bar functionality
searchButton.addEventListener("click", function() {
	const inputCity = searchInput.value;
	if (inputCity == "Palo Alto") {
		//const paHotels = paRef.collection('Hotels');
		hotelLoop(paRef, results);
	} else if (inputCity == "San Luis Obispo") {
		//const sloHotels = sloRef.collection('Hotels');
		hotelLoop(sloRef, results);
	} else if (inputCity == "Santa Monica") {
		//const smHotels = smRef.collection('Hotels');
		hotelLoop(smRef, results);
	} else {
		window.alert("Sorry, we don't have info for hotels in that city yet.");
	}
})

/* //Tester code to verify access of database and print upon clicking search button
const ref = firestore.doc("Cities/Palo Alto/Hotels/Coronet Motel");

searchButton.addEventListener("click", function() {
	ref.get().then(function(docSnap) {
		if (docSnap && docSnap.exists) {
			const myResult = docSnap.data();
			searchOutput.innerText = "Coronet Motel, Parking: " + myResult.Parking + 
			", Rating: " + myResult.Rating + ", Wifi: " + myResult.Wifi;
			console.log("Status read!");
		}
	}).catch(function(error) {
		console.log("Got an error: ", error);
	});
})*/

/* //Prior code to connect search button to total list of hotels (on hotels page)
document.getElementById("searchButton").onclick = function () {
    location.href = "pages/Hotels.html";
};*/