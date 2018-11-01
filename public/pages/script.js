(function() {
    var output = document.getElementById("data");
  var config = {
    apiKey: "AIzaSyAa68d5mjJ81AiXLGOZUtteupD7F9pD2vU",
    authDomain: "fir-setup-221202.firebaseapp.com",
    databaseURL: "https://fir-setup-221202.firebaseio.com",
    projectId: "firebase-setup-221202",
    storageBucket: "firebase-setup-221202.appspot.com",
    messagingSenderId: "892853776465"
  };
  firebase.initializeApp(config);
    var ref = firebase.database().ref();
    ref.on("value", function(snapshot) {
        output.innerHTML = JSON.stringify(snapshot.val(), null, 2);
    });
})();
