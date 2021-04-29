let keyValuesService = {
    numberBtns: document.getElementsByClassName("numberBtn"),
    operatorBtns: document.getElementsByClassName("operatorBtn"),
    clearBtn: document.getElementById("cBtn"),
    plusMinusBtn: document.getElementById("plusMinusBtn"),
    equalBtn: document.getElementById("equalBtn"),
    commaBtn: document.getElementById("commaBtn"),
    selectedNumber: 0,
    selectedOperator: null,
    wholeNumber: 0,
    historyString: "",
    currentValue: 0,
    started: false,
    lastClickIsOperator: false,
    isFraction: false,
    fraction: 10,


    updateNumber: function (newNumber) {
        this.lastClickIsOperator = false;
        this.started = true;
        this.selectedNumber = newNumber;
        if (this.isFraction == false) {
            this.wholeNumber = this.wholeNumber * 10 + this.selectedNumber;
        }
        else {
            this.wholeNumber = this.wholeNumber + this.selectedNumber / this.fraction;
            this.fraction *= 10;
        }
    },

    updateOperator: function (newOperator) {
        if (this.started == true) {
            this.lastClickIsOperator = true;

            if (this.selectedOperator != null) {
                this.updateCurrentValue();
            }
            else {
                this.currentValue = this.wholeNumber;
            }

            displayService.displayCurrentValue(this.currentValue);
            this.wholeNumber = 0;
            this.isFraction = false;
            this.selectedOperator = newOperator;
        }
    },

    updateHistoryNumber: function (number) {
        if (number != "0" || this.wholeNumber != 0) {
            if (this.historyString.length >= 18) {
                this.historyString = this.historyString.substring(1, 18);
            }
            this.historyString += number;
            displayService.displayHistoryString(this.historyString);
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

    displayCurrentValue: function (currentValue) {
        displayDown.innerHTML = currentValue;
    },

    displayHistoryString: function (historyString) {
        if (historyString === "") {
            displayUp.innerHTML = 0;
        }
        else {
            displayUp.innerHTML = historyString;
        }
    }
}

let listenerService = {
    createNumbersListeners: function () {
        for (let number of keyValuesService.numberBtns) {
            number.addEventListener("click", function (event) {
                keyValuesService.updateHistoryNumber(event.target.innerHTML.trim());
                keyValuesService.updateNumber(parseInt(event.target.innerHTML));
            })
        }
    },

    createOperatorListeners: function () {
        for (let operator of keyValuesService.operatorBtns) {
            operator.addEventListener("click", function (event) {
                keyValuesService.updateHistoryOperator(event.target.innerHTML.trim());
                keyValuesService.updateOperator(event.target.innerHTML.trim());
            })
        }
    },

    createClearListener: function () {
        keyValuesService.clearBtn.addEventListener("click", function (event) {
            keyValuesService.clearAll();
        })
    },

    createPlusMinusListener: function () {
        keyValuesService.plusMinusBtn.addEventListener("click", function (event) {
            keyValuesService.historyPlusMinus();
            keyValuesService.plusMinus();
        })
    },

    createEqualListener: function () {
        keyValuesService.equalBtn.addEventListener("click", function (event) {
            keyValuesService.equal();
        })
    },

    createCommaListener: function () {
        keyValuesService.commaBtn.addEventListener("click", function (event) {
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