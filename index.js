import { numberToWords } from "./numberToWords.js";

const convertBtn = document.querySelector("#convertBtn");
const resultDiv = document.getElementById("results");

const number_formatted = (number) => {
  const number_array_dot    = number.toString().split('.');
  const number_string_comma = number_array_dot[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const number_coefficient  = Math.round((parseFloat(number_array_dot[0].substring(0,4).replace(/./, "$&.")) + Number.EPSILON) * 100) / 100;
  const number_exponent     = number_array_dot[0].length - 1;
  const number_science      = number_coefficient.toString() + " × 10<sup>" + number_exponent + "</sup>";
  if ( number_array_dot[0].length < 4 ) {
    return [ number, number_science ];
  }
  if (number_array_dot.length > 1) {
    return [ [number_string_comma, number_array_dot[1]].join('.'), number_science ];
  }
  return [ number_string_comma, number_science ];
}

const numberWithCommas = (x) => {
  const y = x.toString().split('.');
  let result = y[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (y.length > 1) {
    result = [result, y[1]].join('.');
  }
  return result;
}

const createResultTable = () => {
  // Create the table itself
  let resultTable = document.createElement("table");
  resultTable.className = "resultTable";
  let tableHeaders = ["readable", "scientific", "number in words"];

  // Create the table header group element
  let resultTableHead = document.createElement("thead");
  resultTableHead.className = "resultTableHead";

  // Create the row that will contain the headers
  let resultTableHeaderRow = document.createElement("tr");
  resultTableHeaderRow.className = "resultTableHeaderRow";

  // Will iterate over all the strings in the tableHeader array and will append the header cells to the table header row
  tableHeaders.forEach((header) => {
    // Create the current header cell during a specific iteration
    let resultHeader = document.createElement("th");
    resultHeader.className = "resultHeader";
    resultHeader.innerText = header;
    // Append the current header cell to the header row
    resultTableHeaderRow.append(resultHeader);
  });

  // Append the header row to the table header group element
  resultTableHead.append(resultTableHeaderRow);
  resultTable.append(resultTableHead);

  // Create the table body group element
  let resultTableBody = document.createElement("tbody");
  resultTableBody.className = "resultTable-Body";

  // Append the table body group element to the table
  resultTable.append(resultTableBody);

  // Append the table to the result div
  resultDiv.append(resultTable);
};

const appendResult = (number, sn, words) => {
  const resultTable = document.querySelector(".resultTable");
  let resultTableBodyRow = document.createElement("tr"); // Create the current table row
  resultTableBodyRow.className = "resultTableBodyRow";
  let resultNumber = document.createElement("td");
  resultNumber.className = "resultNumber";
  resultNumber.innerText = number;
  let resultSn = document.createElement("td");
  resultSn.className = "resultSn";
  resultSn.innerHTML = sn;
  let resultWords = document.createElement("td");
  resultWords.className = "resultWords";
  resultWords.innerText = words;

  resultTableBodyRow.append(resultNumber, resultSn, resultWords); // Append all 2 cells to the table row
  resultTable.append(resultTableBodyRow); // Append the current row to the scoreboard table body
};

// this function is called when the user clicks the button
const convertToWords = () => {
  // Get what the user typed in the user input, note that when we created the box in the
  // html above we assigned it an id of "userInput" so we can identify it here
  const userInput = document.getElementById("userInput").value;
  const addNumbers = document.getElementById("addNumbers").value;

  // remove all children from the resultdiv if any
  while (resultDiv.firstChild) resultDiv.removeChild(resultDiv.firstChild);

  createResultTable();

  appendResult(number_formatted(userInput)[0], number_formatted(userInput)[1], numberToWords(userInput));

  if (addNumbers > 0) {
    appendResult("", "");

    let scale = Math.max(userInput, addNumbers);
    let addCount = addNumbers;
    if (parseFloat(userInput) <= parseFloat(addNumbers)) {
      addCount = userInput - 1;
    }
    let skipCount = parseFloat(userInput) / parseFloat(addNumbers);
    let last_number = userInput;

    console.log("scale=" + scale);
    console.log("userInput=" + userInput);
    console.log("addNumbers=" + addNumbers);

    console.log("addCount=" + addCount);
    console.log("skipCount=" + skipCount);

    for (let x = 0; x < addCount; x++) {
      console.log(addNumbers);
      let this_number = Math.floor(userInput - (x + 1) * skipCount);
      appendResult(numberWithCommas(this_number), numberToWords(this_number));
    }

  }
};

convertBtn.addEventListener("click", convertToWords);
