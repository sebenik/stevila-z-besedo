"use sctrict";

var defs = require("./defs");

function leftTrim(s, c) {
  var re = new RegExp("^" + c + "+");
  return s.replace(re, "");
}

function rightTrim(s, c) {
  var re = new RegExp(c + "+$");
  return s.replace(re, "");
}

function countNumberOfDigits(number) {
  return number.toString().length;
}

function getFirstNdigits(number, n) {
  n = typeof n !== "undefined" ? n : 1;
  var s = number.toString();
  n = n > s.length ? s.length : n;
  return Number(s.substr(0, n));
}

function getLastNdigits(number, n) {
  n = typeof n !== "undefined" ? n : 1;
  var s = number.toString();
  n = n > s.length ? s.length : n;
  return Number(s.substr(-n, n));
}

function isPredefined(number) {
  var l = countNumberOfDigits(number);
  if (l in defs.base && number in defs.base[l].fixed) {
    return defs.base[l].fixed[number];
  }
  return false;
}

function isPredefinedDate(number) {
  if (number in defs.date["1"].fixed) {
    return defs.date["1"].fixed[number];
  }
  return false;
}

function padLeftMod(s, c, m) {
  var string = leftTrim(s, "0");
  while (countNumberOfDigits(string) % m !== 0) {
    string = c + string;
  }
  return string;
}

function padZerosNum(s, num) {
  while (num > 0) {
    s += "0";
    num = num - 1;
  }
  while (num < 0) {
    s = "0" + s;
    num = num + 1;
  }
  return s;
}

function makeBase10PowString(pow) {
  pow = pow > 0 ? pow : 0;
  var string = "1";
  while (pow > 0) {
    string += "0";
    pow = pow - 1;
  }
  return string;
}

function resolveDecimalSymbol(string, options) {
  if (options.decimalniSimbolPika === true) {
    return string.replace(/,/g, "");
  }
  string = string.replace(/\./g, "");
  return string.replace(/,/g, ".");
}

function formatNumberString(string, options) {
  if (options.brezPresledkov === true) {
    return string.replace(/\s+/g, "").trim();
  }
  return string.replace(/ +(?= )/g, "").trim();
}

function assignSuffixGender(threeDigitNumber, gender) {
  var last2Digits = getLastNdigits(threeDigitNumber, 2)
    , genderSuffix = defs[gender];
  if (last2Digits in genderSuffix) {
    return genderSuffix[last2Digits] + " ";
  }
  return genderSuffix[genderSuffix.length - 1] + " ";
}

function assignDecimalWord(integerPart) {
  if (integerPart === "0") { return " " + defs.decimalWord[0] + " "; }

  if (integerPart.length === 1) {
    var lastWholePartDigit = getLastNdigits(integerPart);
    if (lastWholePartDigit in defs.decimalWord && lastWholePartDigit !== 0) {
      return " " + defs.decimalWord[lastWholePartDigit] + " ";
    }
    return " " + defs.decimalWord[defs.decimalWord.length - 1] + " ";
  }

  var last2WholePartDigits = getLastNdigits(integerPart, 2);
  if (last2WholePartDigits in defs.decimalWord && last2WholePartDigits !== 0) {
    return " " + defs.decimalWord[last2WholePartDigits] + " ";
  }
  return " " + defs.decimalWord[defs.decimalWord.length - 1] + " ";
}

function assignDecimalSuffix(decimalPart) {
  if (decimalPart === 0) { return ""; }

  var suffix = countNumberOfDigits(decimalPart) === 2 ? "tink" : "ink"
    , numberAndSuffix = " " + processString(makeBase10PowString(countNumberOfDigits(decimalPart)), false, true)
    .trim().replace(/\s+/g, "-") + suffix;

  var las2DecimalPartDigits = getLastNdigits(decimalPart, 2);
  if (las2DecimalPartDigits in defs.zenski) {
    return numberAndSuffix + defs.zenski[las2DecimalPartDigits] + " ";
  }
  return numberAndSuffix + defs.zenski[defs.zenski.length - 1] + " ";
}

function stringify(number, gender, exclude) {
  exclude = typeof exclude !== "undefined" ? exclude : false;

  if (number === 0) { return ""; }
  var p = isPredefined(number);
  if (p) {
    if (number === 1 && exclude) { return ""; }
    if (number === 2 && (gender === "moski" || gender === "mnozinski")) { return "dva"; }
    return p;
  }

  if (countNumberOfDigits(number) < 3) {
    return stringify2orLessDigits(number, gender);
  }

  return stringify3digits(number, gender);
}

function stringify3digits(number, gender) {
  var firstDigit = getFirstNdigits(number)
    , last2Digits = getLastNdigits(number, 2)
    , s3d = defs.koncnice["0"].suffix + " " + stringify2orLessDigits(last2Digits, gender);

  if (firstDigit === 1) { return s3d; }
  return stringify2orLessDigits(firstDigit, gender) + s3d;
}

function stringify2orLessDigits(number, gender) {
  if (number === 0) { return ""; }
  if (number === 1 && gender === "moski") { return "en"; }
  if (number === 2 && gender === "moski") { return "dva"; }
  var p = isPredefined(number);
  if (p) { return p; }

  var firstDigit = getFirstNdigits(number)
    , lastDigit = getLastNdigits(number)
    , prefix = lastDigit === 0 ? "" : stringify2orLessDigits(lastDigit, gender) + "in";

  if (firstDigit === 2) {
    return prefix + isPredefined(20);
  }
  return prefix + stringify2orLessDigits(firstDigit) + isPredefined(10);
}

function processString(string, sklanjaj, allowPlusOneDecimalPlace) {
  sklanjaj = typeof sklanjaj === "undefined" ? true : sklanjaj;
  var plusOneDecimalPlace = allowPlusOneDecimalPlace ? 1 : 0;
  // add/remove leading zeros so number of digits can be divided by 3
  string = padLeftMod(string, "0", 3);

  var processedString = ""
    , numberOfDigits = countNumberOfDigits(string)
    , numberOfFactors = Math.floor((numberOfDigits - 1) / 3);

  // Check if number fits inside predefined number suffixes
  // Current max digits are 66 (deciljarda)
  if (numberOfFactors > Object.keys(defs.koncnice).length - 2 + plusOneDecimalPlace) { return false; }

  var p = isPredefined(Number(string));
  if (p) { return p; }

  for (var i = numberOfFactors; i > 0; i--) {
    var threeDigitNumber = Number(string.substr(-3 * (i + 1), 3))
      , gender = defs.koncnice[i].gender;

    processedString += stringify(threeDigitNumber, gender, true);

    if (!(i in defs.koncnice && threeDigitNumber !== 0)) { continue; }

    processedString += " " + defs.koncnice[i].suffix;
    if (sklanjaj) {
      processedString += assignSuffixGender(threeDigitNumber, gender);
    }
  }

  return processedString + " " + stringify(Number(string.substr(-3, 3)));
}

function scientificToString(scientificString) {
  scientificString = leftTrim(scientificString, "0");
  var eIndex = scientificString.toLowerCase().indexOf("e")
    , numberString = scientificString.substr(0, eIndex)
    , decIndex = scientificString.indexOf(".") > -1 ? scientificString.indexOf(".") : numberString.length
    , exponent = Number(scientificString.substr(eIndex + 1));
  numberString = padZerosNum(numberString, exponent);
  if (exponent >= 0) {
    numberString = rightTrim(numberString.substr(0, decIndex) + numberString.substr(decIndex + 1, exponent) + "." + numberString.substr(decIndex + 1 + exponent), "0");
  } else {
    numberString = rightTrim(numberString.substr(0, decIndex) + "." + numberString.substr(decIndex, decIndex - exponent - 1) + numberString.substr(decIndex - exponent + 1), "0");
  }
  return rightTrim(numberString, "\\.");
}

function validateNumber(currentNumber, string, options) {
  // Check if string contains comma (default eu notation for decimal numbers)
  // and replace comma with a dot
  string = resolveDecimalSymbol(string, options);

  // Check that string is a number
  if (isNaN(string) || !string) {
    throw new Error(currentNumber + " is not a number.");
  }

  // Check if string represent a number in scientific notation
  if (string.toLowerCase().indexOf("e") > -1) {
    return scientificToString(string);
  }

  return string;
}

function validateDate(string) {
  // to visulaize this regural expression go to: https://goo.gl/RikGH6
  var validDateRE = /^(?:(?:31(\/|-|\.)(?:(?:0?[13578]|1[02])\1)?)|(?:(?:29|30)(\/|-|\.)(?:(?:0?[1,3-9]|1[0-2])\2)?))(?:(?:1[6-9]|[2-9]\d)\d{2})?$|^(?:29(\/|-|\.)(?:0?2\3)?(?:(?:(?:1[6-9]|[2-9]\d)(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))?)$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:(?:0?[1-9])|(?:1[0-2]))\4)?(?:(?:1[6-9]|[2-9]\d)\d{2})?$/;
  return validDateRE.test(string);
}

function convertNumber(numberString, options) {
  var inputString = numberString.trim();

  // If string represents a negative number,
  // trim minus "-" to make a pisitive represenation
  var isNegativeNumber = inputString[0] === "-";
  if (isNegativeNumber) {
    inputString = leftTrim(inputString, "-").trim();
  }
  var wholeNumberString = isNegativeNumber ? "minus " : "";

  try {
    inputString = validateNumber(numberString, inputString, options);
  } catch (err) { return err.toString(); }

  var integerAndFractionalPart = inputString.split(".")
    , integerPart = integerAndFractionalPart[0]
    , processedIntegerPart = processString(integerPart);
  if (processedIntegerPart === false) {
    return numberString + " is out of bounds.";
  }
  wholeNumberString += processedIntegerPart;

  if (integerAndFractionalPart.length > 1 && integerAndFractionalPart[1] !== "") {
    var fractionalPart = integerAndFractionalPart[1]
      , processedFractionalPart = processString(fractionalPart);

    wholeNumberString += assignDecimalWord(integerPart);
    if (processedFractionalPart === false) {
      return numberString + " is out of bounds.";
    }
    wholeNumberString += processedFractionalPart;
    wholeNumberString += assignDecimalSuffix(fractionalPart);
  }

  return formatNumberString(wholeNumberString, options);
}

function convertDate(numberString, options) {
  var inputString = numberString.trim();

  if (!validateDate(inputString)) {
    return numberString + " is not a valid date form.";
  }

  var dateSeparators = ["\\.", "-", "/"]
    , dateTokens = inputString
    .split(new RegExp(dateSeparators.join("|"), "g"))
    .filter(function(e) { return e !== ""; });

  var wholeDateString = "";
  for (var j = 0; j < dateTokens.length; j++) {
    var p = isPredefinedDate(Number(dateTokens[j]));
    if (p) {
      wholeDateString += p + " ";
      continue;
    }
    wholeDateString += processString(dateTokens[j]);
    if (dateTokens[j].length > 2) { continue; }
    wholeDateString += "i ";
  }

  return formatNumberString(wholeDateString, options);
}

function convertByDigits(numberString, options) {
  var inputString = numberString.trim();

  // If string represents a negative number,
  // trim minus "-" to make a pisitive represenation
  var isNegativeNumber = inputString[0] === "-";
  if (isNegativeNumber) {
    inputString = leftTrim(inputString, "-").trim();
  }
  var wholeDigitString = isNegativeNumber ? "minus " : "";

  try {
    inputString = validateNumber(numberString, inputString, options);
  } catch (err) { return err.toString(); }

  var integerAndFractionalPart = inputString.split(".")
    , integerPart = integerAndFractionalPart[0];
  for (var j = 0; j < integerPart.length; j++) {
    wholeDigitString += processString(integerPart[j]) + " ";
  }

  if (!(integerAndFractionalPart.length > 1 && integerAndFractionalPart[1] !== "")) {
    return formatNumberString(wholeDigitString, options);
  }

  var index = typeof integerPart[j - 1] === "undefined" ? "0" : integerPart[j - 1];
  wholeDigitString += assignDecimalWord(index);

  var fractionalPart = integerAndFractionalPart[1];
  for (j = 0; j < fractionalPart.length; j++) {
    wholeDigitString += processString(fractionalPart[j]) + " ";
  }

  return formatNumberString(wholeDigitString, options);
}

// constructor
function szb(options) {
  options = typeof options === "undefined" || typeof options !== "object" ? {} : options;

  this.opts = {};
  this.opts.decimalniSimbolPika = options.hasOwnProperty("decimalniSimbolPika") ? options.decimalniSimbolPika : false;
  this.opts.brezPresledkov = options.hasOwnProperty("brezPresledkov") ? options.brezPresledkov : false;
  this.opts.type = options.hasOwnProperty("type") ? options.type : "number";
}

szb.prototype.convert = function(numbers) {
  numbers = numbers.constructor === Array ? numbers.map(String) : [numbers.toString()];
  var numbersAsText = []
    , converter;

  if (this.opts.type === "number") {
    converter = convertNumber;
  } else if (this.opts.type === "date") {
    converter = convertDate;
  } else if (this.opts.type === "digit") {
    converter = convertByDigits;
  } else {
    console.log("Error (stevila-z-besedo): wrong converter type.");
    return false;
  }

  for (var currentNumber = 0; currentNumber < numbers.length; currentNumber++) {
    numbersAsText.push(converter(numbers[currentNumber], this.opts));
  }

  return numbersAsText;
};

module.exports = szb;

