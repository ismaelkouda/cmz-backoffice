export const formatterNombre = (number, decimalPlaces) => {
    var roundedNumber = parseFloat(number).toFixed(decimalPlaces);
    var numberString = roundedNumber.toString();
    var formattedNumber = numberString.substring(
        0,
        numberString.indexOf('.') + 3
    );
    return formattedNumber;
};
