$(document).ready(function () {
  $("#equation-form").submit(function (event) {
    event.preventDefault();
    var equation = $("#equation-input").val();
    var balancedEquation = balanceEquation(equation);
    $("#balanced-equation-output").text(balancedEquation);
  });
});

function balanceEquation(equation) {
  var reactants = equation.split("=")[0].trim();
  var products = equation.split("=")[1].trim();
  var reactantsList = reactants.split("+");
  var productsList = products.split("+");
  var coefficients = [];
  var maxCoefficient = 100;
  var i;
  console.log(reactantsList);

  // Initialize coefficients with 1's
  for (i = 0; i < reactantsList.length + productsList.length; i++) {
    coefficients.push(1);
  }

  // Use matrix algebra to solve for coefficients
  var matrix = createMatrix(reactantsList, productsList);
  var rowReducedMatrix = rowReduce(matrix);
  var solutions = solveRowReducedMatrix(rowReducedMatrix);

  // Check for fractional coefficients and scale up if necessary
  var lcm = findLeastCommonMultiple(getDenominators(solutions));
  for (i = 0; i < solutions.length; i++) {
    if (solutions[i].denominator !== 1) {
      coefficients[i] = lcm / solutions[i].denominator;
    } else {
      coefficients[i] = solutions[i].numerator;
    }
  }

  // Build balanced equation string
  var balancedEquation = "";
  for (i = 0; i < reactantsList.length; i++) {
    if (coefficients[i] !== 1) {
      balancedEquation += coefficients[i];
    }
    balancedEquation += reactantsList[i];
    if (i < reactantsList.length - 1) {
      balancedEquation += " + ";
    }
  }
  balancedEquation += " = ";
  for (
    i = reactantsList.length;
    i < reactantsList.length + productsList.length;
    i++
  ) {
    if (coefficients[i] !== 1) {
      balancedEquation += coefficients[i];
    }
    balancedEquation += productsList[i - reactantsList.length];
    if (i < reactantsList.length + productsList.length - 1) {
      balancedEquation += " + ";
    }
  }

  return balancedEquation;
}

function createMatrix(reactantsList, productsList) {
  var matrix = [];
  var row, col, i, j, k;

  // Create matrix with reactants and products as columns
  for (i = 0; i < reactantsList.length + productsList.length; i++) {
    matrix.push([]);
    for (j = 0; j < reactantsList.length + productsList.length; j++) {
      matrix[i].push(0);
    }
  }

  // Fill in matrix with stoichiometric coefficients
  for (i = 0; i < reactantsList.length; i++) {
    row = i;
    col = reactantsList.length + i;
    matrix[row][col] = 1;
    var reactant = reactantsList[i].trim();
    var coefficient = 1;
    if (!isNaN(reactant.charAt(0))) {
      coefficient = parseInt(reactant.charAt(0));
      reactant = reactant.substring(1).trim();
    }
    for (j = 0; j < productsList.length; j++) {
      var product = productsList[j].trim();
      var productCoefficient = 1;
      if (!isNaN(product.charAt(0))) {
        productCoefficient = parseInt(product.charAt(0));
        product = product.substring(1).trim();
      }
      if (reactant === product) {
        matrix[j + reactantsList.length][col] -= coefficient;
      }
    }
  }

  return matrix;
}

function rowReduce(matrix) {
  var lead = 0;
  var rowCount = matrix.length;
  var columnCount = matrix[0].length;
  var i, j;

  for (i = 0; i < rowCount; i++) {
    if (lead >= columnCount) {
      return;
    }
    var k = i;
    while (matrix[k][lead] === 0) {
      k++;
      if (k === rowCount) {
        k = i;
        lead++;
        if (lead === columnCount) {
          return;
        }
      }
    }
    var temp = matrix[k];
    matrix[k] = matrix[i];
    matrix[i] = temp;
    var lv = matrix[i][lead];
    for (j = 0; j < columnCount; j++) {
      matrix[i][j] /= lv;
    }
    for (j = 0; j < rowCount; j++) {
      if (j !== i) {
        lv = matrix[j][lead];
        for (k = 0; k < columnCount; k++) {
          matrix[j][k] -= lv * matrix[i][k];
        }
      }
    }
    lead++;
  }

  return matrix;
}
function solveRowReducedMatrix(matrix) {
  var solutions = [];
  var rowCount = matrix?.length;
  var columnCount = matrix[0]?.length;
  var i, j;

  for (i = 0; i < rowCount; i++) {
    var foundLeadingOne = false;
    var leadingOneColumn = 0;
    for (j = 0; j < columnCount; j++) {
      if (matrix[i][j] === 1) {
        if (!foundLeadingOne) {
          foundLeadingOne = true;
          leadingOneColumn = j;
        } else {
          foundLeadingOne = false;
          break;
        }
      }
    }
    if (foundLeadingOne) {
      var solution = {
        numerator: -matrix[i][columnCount - 1],
        denominator: matrix[i][leadingOneColumn],
      };
      solutions.push(solution);
    }
  }

  return solutions;
}
function getDenominators(fractions) {
  var denominators = [];
  for (var i = 0; i < fractions.length; i++) {
    denominators.push(fractions[i].denominator);
  }
  return denominators;
}

// Returns the least common multiple of a list of numbers
function findLeastCommonMultiple(numbers) {
  var primes = [];
  var maxPrimeIndex = -1;
  var lcm = 1;
  var i, j;

  // Find all primes less than the maximum number in the list
  var maxNumber = Math.max.apply(null, numbers);
  for (i = 2; i <= maxNumber; i++) {
    var isPrime = true;
    for (j = 2; j <= Math.sqrt(i); j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) {
      primes.push(i);
    }
  }

  // Repeatedly divide each number in the list by the primes and multiply lcm by the primes
  while (maxPrimeIndex < primes.length) {
    maxPrimeIndex++;
    var prime = primes[maxPrimeIndex];
    var divided = false;
    for (i = 0; i < numbers.length; i++) {
      if (numbers[i] % prime === 0) {
        numbers[i] /= prime;
        divided = true;
      }
    }
    if (divided) {
      lcm *= prime;
      maxPrimeIndex--;
    }
  }

  return lcm;
}
