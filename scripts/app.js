let keyValuesService = {
    numberBtns: document.getElementsByClassName("numberBtn"),
    operatorBtns: document.getElementsByClassName("operatorBtn"),
    clearBtn: document.getElementById("cBtn"),
    plusMinusBtn: document.getElementById("plusMinusBtn"),
    equalBtn: document.getElementById("equalBtn"),
    commaBtn: document.getElementById("commaBtn"),
    selectedNumber: 0, // pocetni vrednosti za brojki
    selectedOperator: null, // pocetni vrednosti za operator
    wholeNumber: 0,  // celiot broj pred operacijata
    historyString: "", // celiot string gore
    currentValue: 0,  // momentalno izracunatiot rezultat no ne konecniot
    started: false, // sme vnele brojki prvo
    lastClickIsOperator: false, // poslednoto nesto sto e vneseno e operatorot
    isFraction: false,
    fraction: 10,


    updateNumber: function (newNumber) {
        this.lastClickIsOperator = false;     // false na operator deka e stisnat broj
        this.started = true;                // Pocetno e brojka
        this.selectedNumber = newNumber;    //cifrata vo momentot
        if (this.isFraction == false) {
            this.wholeNumber = this.wholeNumber * 10 + this.selectedNumber; // celosniot broj plus poslednata selektirana cifra
        }
        else {
            this.wholeNumber = this.wholeNumber + this.selectedNumber / this.fraction;
            this.fraction *= 10;
        }
    },

    updateOperator: function (newOperator) {
        if (this.started == true) {     //ako e napisana prvata brojka ondak moze
            this.lastClickIsOperator = true; // pisuvame deka posleden e stisnat operatorot

            if (this.selectedOperator != null) {
                this.updateCurrentValue(); // znacite
            }
            else { // ako nema stisnato uste operator momentalnata vrednost da e kolku celiot broj
                this.currentValue = this.wholeNumber;
            }

            displayService.displayCurrentValue(this.currentValue);
            this.wholeNumber = 0;
            this.isFraction = false;
            this.selectedOperator = newOperator;
        }
    },

    updateHistoryNumber: function (number) { // string input od brojka
        if (number != "0" || this.wholeNumber != 0) { // ako brojot ne e ednakov na nula ili celata cifra ne e ednakva na nula
            if (this.historyString.length >= 18) {
                this.historyString = this.historyString.substring(1, 18);
            }
            this.historyString += number; // na stringot gore mu ja dodavame novata vnesena brojka
            displayService.displayHistoryString(this.historyString); // go dodavame stringot vo gorniot display
        }
    },

    updateHistoryOperator: function (operator) {
        if (this.started == true) {
            if (this.lastClickIsOperator == true) {
                this.historyString = this.historyString.slice(0, -1);
            }
            if (this.historyString.length >= 18) {
                this.historyString = this.historyString.substring(1, 18);
            }
            this.historyString += operator;
            displayService.displayHistoryString(this.historyString);
        }
    },

    updateCurrentValue: function () {

        switch (this.selectedOperator) {
            case "+":
                this.currentValue += this.wholeNumber;
                break;
            case "-":
                this.currentValue -= this.wholeNumber;
                break;
            case "x":
                this.currentValue *= this.wholeNumber;
                break;
            case "/":
                this.currentValue /= this.wholeNumber;
                break;
            case "%":
                this.currentValue *= this.wholeNumber;
                this.currentValue /= 100;
                break;

            default:
                console.log("Problem");
        }
    },

    clearAll: function () {
        this.selectedNumber = 0;
        this.selectedOperator = null;
        this.wholeNumber = 0;
        this.isFraction = false;
        this.historyString = "";
        this.currentValue = 0;
        this.started = false;
        this.lastClickIsOperator = false;
        displayService.displayHistoryString(this.historyString);
        displayService.displayCurrentValue(this.currentValue);
    },

    plusMinus: function () {
        if (this.lastClickIsOperator != true && this.started == true) {
            this.wholeNumber *= -1;
        }
    },

    historyPlusMinus: function () {
        if (this.lastClickIsOperator != true && this.started == true) {
            let wholeNumberString = this.wholeNumber.toString();
            this.historyString = this.historyString.slice(0, -wholeNumberString.length);
            if (this.wholeNumber > 0) {
                this.historyString = this.historyString + "-";
            }
            else {
                this.historyString = this.historyString.slice(0, -1);
            }
            this.historyString = this.historyString + wholeNumberString;
            displayService.displayHistoryString(this.historyString);
        }
    },

    equal: function () {
        if (this.started == true && this.selectedOperator != null) {
            this.updateCurrentValue();
            let tempResult = this.currentValue;
            this.clearAll();
            displayService.displayCurrentValue(tempResult);
            displayService.displayHistoryString("");
        }
    },

    comma: function () {
        if (this.isFraction == false) {
            this.isFraction = true;
            this.fraction = 10;
        }
    },

    historyComma: function () {
        if (this.isFraction == false) {
            this.historyString += ".";
            displayService.displayHistoryString(this.historyString);
        }
    }
}


let displayService = {
    displayUp: document.getElementById("displayUp").innerHTML = 0,
    displayDown: document.getElementById("displayDown").innerHTML = 0,

    displayCurrentValue: function (currentValue) {  // dolniot displej
        displayDown.innerHTML = currentValue;
    },

    displayHistoryString: function (historyString) {    // gorniot displej
        if (historyString === "") {
            displayUp.innerHTML = 0;
        }
        else {
            displayUp.innerHTML = historyString; //pooleto go zimame so dom i mu go davame celiot string
        }
    }
}

let listenerService = {
    createNumbersListeners: function () {
        for (let number of keyValuesService.numberBtns) {
            number.addEventListener("click", function (event) {         // liseneri za brojki
                keyValuesService.updateHistoryNumber(event.target.innerHTML.trim()); // input string od edinicna brojka
                keyValuesService.updateNumber(parseInt(event.target.innerHTML)); // izmeni za novata brojka parsirana
            })
        }
    },

    createOperatorListeners: function () {
        for (let operator of keyValuesService.operatorBtns) {
            operator.addEventListener("click", function (event) {  //liseneri za operandi
                keyValuesService.updateHistoryOperator(event.target.innerHTML.trim());
                keyValuesService.updateOperator(event.target.innerHTML.trim());     // dodavanje operacija
            })
        }
    },

    createClearListener: function () {
        keyValuesService.clearBtn.addEventListener("click", function (event) {  //liseneri za operandi
            keyValuesService.clearAll();
        })
    },

    createPlusMinusListener: function () {
        keyValuesService.plusMinusBtn.addEventListener("click", function (event) {  //lisener za plusMinus
            keyValuesService.historyPlusMinus();
            keyValuesService.plusMinus();
        })
    },

    createEqualListener: function () {
        keyValuesService.equalBtn.addEventListener("click", function (event) {  //lisener za plusMinus
            keyValuesService.equal();
        })
    },

    createCommaListener: function () {
        keyValuesService.commaBtn.addEventListener("click", function (event) {  //lisener za plusMinus
            keyValuesService.historyComma();
            keyValuesService.comma();
        })
    }
}

listenerService.createNumbersListeners();
listenerService.createOperatorListeners();
listenerService.createClearListener();
listenerService.createPlusMinusListener();
listenerService.createEqualListener();
listenerService.createCommaListener();