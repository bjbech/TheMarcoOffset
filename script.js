function calculateTotal() {
    // Get the selected iPhone model from the dropdown
    var selectedModel = document.getElementById("selectedModel").value;

    // Set the starting price based on the selected model
    var startingPrice;
    switch (selectedModel) {
        case "iphone16":
            startingPrice = 799; // Set the starting price for iPhone 15
            break;
        case "iphone16pro":
            startingPrice = 999; // Set the starting price for iPhone 15 Pro
            break;
        default:
            startingPrice = 0; // Default if none of the options match
    }

    // Get the input values
    var num1 = parseFloat(document.getElementById("num1").value) || 0;
    var num2 = parseFloat(document.getElementById("num2").value) || 0;

    // Calculate the total by adding the input numbers and subtracting the starting price
    var total = num1 + (num2 * 12) - startingPrice;

    // Ensure the total is displayed as zero if it's less than zero
    total = total < 0 ? 0 : total;

    // Display the total
    var formatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById("total").innerText = formatter.format(total);
}
