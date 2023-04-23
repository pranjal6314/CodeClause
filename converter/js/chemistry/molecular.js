$(document).ready(function () {
  $("form").submit(function (event) {
    event.preventDefault();
    var formula = $("#formula").val();
    var weight = calculateWeight(formula);
    $("#result").html("Molecular weight: " + weight + " g/mol");
  });
});

function calculateWeight(formula) {
  // Define the atomic weights of each element in an object
  var atomicWeights = {
    H: 1.008,
    He: 4.003,
    Li: 6.941,
    Be: 9.012,
    B: 10.81,
    C: 12.01,
    N: 14.01,
    O: 16.0,
    F: 19.0,
    Ne: 20.18,
    Na: 22.99,
    Mg: 24.31,
    Al: 26.98,
    Si: 28.09,
    P: 30.97,
    S: 32.06,
    Cl: 35.45,
    K: 39.1,
    Ar: 39.95,
    Ca: 40.08,
  };

  // Define a regular expression to match element symbols and counts
  var pattern = /([A-Z][a-z]*)(\d*)/g;

  // Initialize the molecular weight to zero
  var weight = 0;

  // Loop over each match in the formula string
  var match;
  while ((match = pattern.exec(formula))) {
    var element = match[1];
    var count = match[2] === "" ? 1 : parseInt(match[2], 10);
    if (element in atomicWeights) {
      weight += atomicWeights[element] * count;
    } else {
      throw new Error("Unknown element: " + element);
    }
  }

  // Return the total molecular weight
  return weight;
}
