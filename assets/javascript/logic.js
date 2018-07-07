// Initialize Firebase
var config = {
    apiKey: "AIzaSyBNlgV6z7NYyy8tlYfcbU2PKO8GthPj7Gs",
    authDomain: "trainscheduler-5ffb9.firebaseapp.com",
    databaseURL: "https://trainscheduler-5ffb9.firebaseio.com",
    projectId: "trainscheduler-5ffb9",
    storageBucket: "",
    messagingSenderId: "944127338452"
};
firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

// Initial Values
var trainName = "";
var destination = "";
var firstTrain = "";
var frequency = "";
var nextTrain = "";

var waitTime;


$("#submit").on("click", function (event) {

    event.preventDefault();

    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    firstTrain = $("#first-train").val().trim();
    frequency = $("#frequency").val().trim();

    console.log(frequency);

    // Grab the values from the boxes
    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        nextTrain: nextTrain,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train").val("");
    $("#frequency").val("");
    $("#next-train").val("");

});

// Firebase watcher + initial loader HINT: .on("value")
database.ref().on("child_added", function (snapshot) {
    // Log everything that's coming out of snapshot
    console.log(snapshot.val());
    console.log(snapshot.val().trainName);
    console.log(snapshot.val().destination);
    console.log(snapshot.val().firstTrain);
    console.log(snapshot.val().frequency);
    console.log(snapshot.val().nextTrain);


    // Current Time
    var now = moment();
    console.log(now);

    // Formatting the first train time to  
    // trainTimeObject = moment((snapshot.val().firstTrain));
    var firstTrainToday = moment(now.format("MM-DD-YYYY") + " " + snapshot.val().firstTrain, "MM-DD-YYYY H:mm");
    console.log(firstTrainToday);


    var timeDiff = Math.abs(now.diff(firstTrainToday, "minutes"));
    console.log(timeDiff);
    console.log(typeof (timeDiff));
    console.log(frequency);


    var waitTime = parseInt(snapshot.val().frequency) - (timeDiff % parseInt(snapshot.val().frequency));
    console.log(waitTime);




    // Subtract the current time from arrival time

    // Modulus the difference to find the waittime

    // Determin the next train arrivale time from now (12:05pm)


    // Change the HTML to reflect trains
    var newRow = $("<tr>");

    newRow.prepend("<td>" + snapshot.val().trainName + "</td>" + "<td>" + snapshot.val().destination + "</td>" +
        "<td>" + snapshot.val().firstTrain + "</td>" + "<td>" + snapshot.val().frequency + "</td>" + "<td>" + waitTime + "</td>");

    $("tbody").append(newRow);

    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (timeSnapshot) {
    // Change the HTML to reflect
    $("#train-name").text(timeSnapshot.val().trainName);
    $("#destination").text(timeSnapshot.val().destination);
    $("#first-train").text(timeSnapshot.val().firstTrain);
    $("#frequency").text(timeSnapshot.val().frequency);
    $("#frequency").text(timeSnapshot.val().nextTrain);
});






