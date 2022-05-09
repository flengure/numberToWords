const decimal_seperator   = '.'        ;
const conjunction         = 'and'      ;
const thousands_seperator = ','        ;
const negative_prefix     = 'negative' ;

const words = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
    "hundred",
    "thousand",
    "million",
    "billion",
    "trillion",
    "quadrillion",
    "quintillion",
    "sextillion",
    "septillion",
    "octillion",
    "nonillion",
    "decillion",
    "undecillion",
    "duodecillion",
    "tredecillion"
];
const ones_index = 0  ; // all the single letter words start at index 0 to index 20
const tens_index = 20 ; // 2 letter number prefixes start here
const huns_index = 28 ; // the word hundred, kind of an odd man out
const mils_index = 29 ; // all the powers of 1000 start here keep adding to your hearts delight

//  function fractions
//  transorm a number like below
//  245 --> point two four five
// 7543 --> point seven five four three
//   02 --> point zero two
const fractions = (number) => {
    if (parseFloat(number) == 0) {
        return ;
    }
    const number_string = number.toString();
    let result = 'point';
    for ( let x = 0; x < number_string.length; x++ ){
        result = [ result, words[ones_index + parseInt(number_string.charAt(x))] ].join(' ');
    }
    return result;
}

// function ones
// Expects any 1 or 2 digit number from 0 to 20 and converts it to a word.
// Be careful! It does not check the validity of input if you give it any
// thing apart from a 1 or 2 digit number from 0 to 20, results will be useless.
// check the inputs before calling it
const ones = (number) => {
    return words[ones_index + parseInt(number)];
}
    
// function tens
// Expects any 2 digit number from 20 to 99 and converts it to words.
// Be careful! It does not check the validity of input if you give it any
// thing apart from a 2 digit number from 20 to 99, results will be useless.
// check the inputs before calling it
const tens = (number) => {
    const number_string = number.toString();
    const tens_digit = parseInt(number_string.substring(0, 1));
    const unit_digit = parseInt(number_string.substring(1));
    const result = words[tens_index + tens_digit - 2];
    if (unit_digit > 0 ) { 
        return [result, ones(unit_digit)].join(" "); 
    }
    return result;
}
    
// function hundreds
// Expects any 3 digit number from 100 to 999 and converts it to words.
// Be careful! It does not check the validity of input if you give it any
// thing apart from a 3 digit number from 100 to 999, results will be useless.
// check the inputs before calling it
const hundreds = (number) => {
    const number_string = number.toString();
    const hundreds_digit = parseInt(number_string.substring(0, 1));
    const tens_remainder = parseInt(number_string.substring(1));
    const result = [ ones(hundreds_digit), words[huns_index] ].join(' ');
    if (tens_remainder > 0 ) {
        if (tens_remainder < 21) {
            return [ result, conjunction, ones(tens_remainder)].join(' ');
        } else {
            return [ result, conjunction, tens(tens_remainder)].join(' ');
        }
    }
    return result;
}
    
// function thousands
// Expects any number over 3 digits long and converts it to words.
// Be careful! It does not check the validity of input if you give it any
// thing apart from a number longer than 3 digits, results will be useless.
// check the inputs before calling it
const thousands = (number) => {

    const number_string = number.toString();

    let   number_array     = number_string.replace(/\B(?=(\d{3})+(?!\d))/g, ",").split(",");
    const left_string      = number_array[0];
    number_array.shift();
    const thousands_index  = number_array.length;
    const right_string     = number_array.join("");
    if ( thousands_index  >= words.length - mils_index ) {
        const words_string = words.toString().replace(/\w+/g,'"'+"$&"+'"').replace(/,/g, ", ");
        return "You are degenerate, why would you want to spell out a number this large.\n" +
            "If you insist on giving yourself a headache, go look for this line of code " +
            "and add other crazy words to the end.\n\n" +
            "const words = ["+words_string+"]";
    }
    const mils_name        = words[mils_index + thousands_index];

    const result = [ numberToWords(left_string), mils_name ].join(' ');

    if (parseFloat(right_string) > 0)
    {
        if (parseFloat(right_string) < 100) {
            return [ result, conjunction, numberToWords(right_string) ].join(' ');
        } else {
            return [ result, numberToWords(right_string) ].join(', ');
        }
    }
    return result;
}

export const numberToWords = ( number ) => {

    let number_input = number;

    // if the number is negative set a flag and remove the negative sign
    const is_negative = /^\s*-\s*/.test(number.toString()) ;
    if (is_negative) {
        number_input = number.toString().replace(/^\s*-\s*/, '');
    }

    // First lets make sure the input given is actually a number if its not a number
    // really we should return an error, but in our case for now lets just return an 
    // explanation that the gien input is not a number
    if ( typeof parseFloat(number) != 'number' ) {

        // Lets try removing thousands seperators to see if paddy man
        // littered the place with commas
        const re = new RegExp( '\\' + thousands_seperator, 'g' );
        const number_without_commas = number_input.toString().replace(re, '')

        if (typeof parseFloat(number_without_commas) != 'number' ) {
            return number + " is not a number";
        }

        number_input = number_without_commas;
    }

    // lets save the string reresentation of the number, we will use it to manipulate
    // the number and avoid floating point or integer limitations for large numbers
    // also we see if a point with a fractional part was specified
    let number_string = number_input.toString();
    let fraction_string = '';
    const number_split_on_dot = number_string.split(decimal_seperator);
    if ( number_string.includes(decimal_seperator) ) {
        number_string = number_split_on_dot[0];
        fraction_string = number_split_on_dot[1];
    }

    // If there are any fractions save the words here
    const fraction_result = fractions(fraction_string);

    // function return_result
    // Append the fraction words (if any) to whatever is passed to it
    const return_result = (result) => {
        let full_result = '';
        if (is_negative) {
            full_result = [negative_prefix, result].join(' '); 
        } else {
            full_result = result;
        }
        if (parseFloat(fraction_string) > 0) {
            return [full_result, fraction_result].join(' ');
        } else {
            return full_result;
        }
    }

    // If the decimal part of the number input is 1 or 2 digits long and is from 0 to 19
    // then run the ones function on it.
    if ( /^1?[0-9]$/.test(number_string.toString()) ) {
        return return_result(ones(number_string));
    }

    // If the code gets here, the decimal portion of the number is more than 19
    // If the decimal part of the number input is a 2 digit number from 20 to 99, 
    // then run the tens function on it.
    if (/^[2-9][0-9]$/.test(number_string)) {
        return return_result(tens(number_string));
    }

    // If the code gets here, the decimal portion of the number is more than 99
    // If the decimal part of the number input is a 3 digit number from 100 to 999, 
    // then run the hundreds function on it
    if (/^[0-9][0-9][0-9]$/.test(number_string)) {
        return return_result(hundreds(number_string));
    }

    // If the code gets here, the decimal portion of the number is more than 3 digits long
    return return_result(thousands(number_string));

}