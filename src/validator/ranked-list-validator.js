function RankedListValidator(options) {
    if (!(this instanceof RankedListValidator)) {
        return new RankedListValidator(options);
    }
    Validator.call(this, options);

    this._columnsSize = -1;
}

RankedListValidator.prototype = Object.create(Validator.prototype);

RankedListValidator.prototype.validateLine = function (line, isLast) {
    this.parseData(line, isLast);
}

RankedListValidator.prototype.parseData = function (line, isLast) {
    if (line == "") {
        if (!isLast)
            this.addLog("warning", "Empty line.");
    } else {
        var columns = line.split("\t");

        if (this._columnsSize == -1) {
            this._columnsSize = columns.length;
        }

        if (this._columnsSize !== columns.length) {
            this.addLog("error", "Column length must be same as the header column length.");
        }
    }
}
