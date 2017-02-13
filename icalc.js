/* Interest Calculator
 * Copyright (C) 2004-2017  Georgi D. Sotirov
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * ---------------------------------------------------------------------------
 * Description: Interest Calculator UI JavaScript
 * Version: 0.4.0
 * $Id: icalc.js,v 1.22 2017/02/13 14:30:26 gsotirov Exp $
 */

/* This are the interests for the main currencyes as defined by
 * First Investment Bank as of 2015-05-12
 * The arrays should contain the interests for 1, 3, 6, 12, 18, 24 and
 * 36 months deposits in that order.
 */
var BGNInterests = new Array(0.10, 0.15, 0.25, 0.50, 0.60, 0.80, 0.90);
var USDInterests = new Array(0.10, 0.15, 0.25, 0.40, 0.50, 0.70, 0.80);
var EURInterests = new Array(0.05, 0.10, 0.20, 0.30, 0.40, 0.60, 0.70);
var CHFInterests = new Array(0.05, 0.10, 0.20, 0.30, 0.00, 0.00, 0.00);
var GBPInterests = new Array(0.05, 0.10, 0.20, 0.30, 0.40, 0.60, 0.70);

var uisPlsFillAmount   = 0;
var uisPlsCorrAmount   = 1;
var uisPlsFillInterest = 2;
var uisPlsCorrInterest = 3;
var uisPlsFillPeriod   = 4;
var uisPlsCorrPeriod   = 5;
var uisPeriodError     = 6;
var uisMonth           = 7;
var uisBalance         = 8;
var uisGrossInterest   = 9;
var uisTaxOnInterest   = 10;
var uisNetInterest     = 11;
var uisInterestAcc     = 12;

var UIStringsBG = new Array(
/*  0 */ "Моля, попълнете полето Сума!",
/*  1 */ "Моля, задайте правилна стойност в полето Сума!\nНапример: 10000, 15500, 20100.55",
/*  2 */ "Моля, попълнете полето Годишен номинален лихвен процент!",
/*  3 */ "Моля, задайте правилна стойност в полето Годишен номинален лихвен процент!\nНапример: 3.5, 4, 6.0",
/*  4 */ "Моля, попълнете полето Срок на депозита!",
/*  5 */ "Моля, задайте правилна стойност в полето Срок на депозита!\nНапример: 1, 3, 6, 12",
/*  6 */ "Периода на депозита трябва да е кратен на броя месеци от типа на депозита!",
/*  7 */ "Месец",
/*  8 */ "Салдо",
/*  9 */ "Лихва",
/* 10 */ "Данък върху лихвата",
/* 11 */ "Нето лихва",
/* 12 */ "Натрупана лихва"
);

var UIStringsEN = new Array(
/*  0 */ "Please, fill in the Amount field!",
/*  1 */ "Please, fill in correct value in the Amount field!\nExamples: 10000, 15500, 20100.55",
/*  2 */ "Please, fill in the Nominal yearly interest field!",
/*  3 */ "Please, fill in correct value in the Yearly Nominal Interest field!\nExamples: 3.5, 4, 6.0",
/*  4 */ "Please, fill in the Period of the deposit field!",
/*  5 */ "Please, fill in correct value in the Period of the deposit field!\nExamples: 1, 3, 6, 12",
/*  6 */ "The period of the deposit must be multiple to the month count in the type of the deposit!",
/*  7 */ "Month",
/*  8 */ "Balance",
/*  9 */ "Interest",
/* 10 */ "Tax on interest",
/* 11 */ "Net interest",
/* 12 */ "Accumulated interest"
);

function loadUIString(id) {
  var htmltags = document.getElementsByTagName("html");
  var lang = htmltags[0].lang;

  if ( lang == "en" ) {
    return UIStringsEN[id];
  }
  else if ( lang == "bg" ) {
    return UIStringsBG[id];
  }
  else return "???";
}

function formatNumber(number, float) {
  var htmltags = document.getElementsByTagName("html");
  var lang = htmltags[0].lang;

  /* Configure number formatting */
  var num = new NumberFormat();
  num.setInputDecimal('.');
  num.setSeparators(true, ' ', '.');
  num.setPlaces('2', false);
  num.setCurrency(false);
  num.setCurrencyPosition(num.LEFT_OUTSIDE);
  num.setNegativeFormat(num.LEFT_DASH);
  num.setNegativeRed(false);
  num.setNumber(number);
  return num.toFormatted();
}

function formatField(obj) {
  obj.value = formatNumber(obj.value.replace(/,/, "."));
}

function checkField(fld, type, uisFill, uisCorr) {
  if ( fld.value == "" ) {
    alert(loadUIString(uisFill));
    fld.focus();
    return false;
  }

  if ( type != "string" ) {
    if ( type == "float" )
      val = parseFloat(fld.value);
    else if ( type == "int" )
      val = parseInt(fld.value);
    if ( isNaN(val) ) {
      alert(loadUIString(uisCorr));
      fld.focus();
      return false;
    }
  }

  return true;
}

function initForm(forReset) {
  forReset = typeof(forReset) != 'undefined' ? forReset : false;
  var Form = document.forms.CalcForm;

  if ( forReset ) {
    var defType = getDefaultSelected(Form.Type).value;
    var defCurr = getDefaultSelected(Form.Currency).value;
    changeInterest(defType, defCurr, Form.Interest);
  }
  else {
    changeInterest(Form.Type.value, Form.Currency.value, Form.Interest);
  }
}

function changeInterest(months, curr, element) {
  var index = 0;

  switch ( parseInt(months) ) {
    case  1: index = 0; break;
    case  3: index = 1; break;
    case  6: index = 2; break;
    case 12: index = 3; break;
    case 18: index = 4; break;
    case 24: index = 5; break;
    case 36: index = 6; break;
  }
  switch ( curr ) {
    case "BGN": interest = formatNumber(BGNInterests[index]); break;
    case "USD": interest = formatNumber(USDInterests[index]); break;
    case "EUR": interest = formatNumber(EURInterests[index]); break;
    case "CHF": interest = formatNumber(CHFInterests[index]); break;
    case "GBP": interest = formatNumber(GBPInterests[index]); break;
    default   : interest = formatNumber(0.0); break;
  }
  element.defaultValue = interest;
}

function onChangeCurrency () {
  var form  = document.forms.CalcForm;

  changeInterest(form.Type.value, form.Currency.value, form.Interest);
}

function onChangeType() {
  var form    = document.forms.CalcForm;
  var type    = form.Type;
  var period  = form.Period;

  changeInterest(type.value, form.Currency.value, form.Interest)

  if ( period.value == "" ) {
    if ( parseInt(type.value) <= 12 ) {
      period.value = "12";
    }
    else {
      period.value = type.value;
    }
  }
}

function doReset() {
  var Output = document.getElementById("Output");
  var OutputTable = document.getElementById("OutputTable");
  if ( OutputTable ) {
    Output.removeChild(OutputTable);
  }
  initForm(true);
}

function checkForm() {
  var form = document.forms.CalcForm;

  if ( !checkField(form.Amount, "float", uisPlsFillAmount, uisPlsCorrAmount) ) {
    doReset();
    return false;
  }

  if ( !checkField(form.Interest, "float", uisPlsFillInterest, uisPlsCorrInterest) ) {
    doReset();
    return false;
  }

  if ( !checkField(form.Period, "int", uisPlsFillPeriod, uisPlsCorrPeriod) ) {
    doReset();
    return false;
  }

  var Period = parseInt(form.Period.value);
  var Type = parseInt(form.Type.value);

  if ( Period % Type ) {
     alert(loadUIString(uisPeriodError));
     form.Period.focus();
     doReset();
     return false;
  }

  return true;
}

function calcAndDisplay() {
  var form = document.forms.CalcForm;
  var amount = parseFloat(form.Amount.value.replace(/\s+/, ""));
  var type = parseInt(form.Type.value);
  var interest = parseFloat(form.Interest.value.replace(/\s+/, ""));
  var itype = getRadioValue(form.InterestType);
  var period = parseInt(form.Period.value);

  var Output = document.getElementById("Output");
  var OutputTable = document.getElementById("OutputTable");
  if ( OutputTable ) {
    Output.removeChild(OutputTable);
  }
  OutputTable = document.createElement("table");
  OutputTable.setAttribute("class", "tbThinBorder");
  OutputTable.setAttribute("id", "OutputTable");
  OutputTable.setAttribute("cellspacing", "0");
  var cur = document.forms.CalcForm.Currency.value;
  makeTableHeader(OutputTable, loadUIString(uisMonth),
                               loadUIString(uisGrossInterest) + ", " + cur,
                               loadUIString(uisTaxOnInterest) + ", " + cur,
                               loadUIString(uisNetInterest)   + ", " + cur,
                               loadUIString(uisInterestAcc)   + ", " + cur,
                               loadUIString(uisBalance)       + ", " + cur);
  var Rows = calc_interest(amount, type, interest, itype, period);
  var OutputTableBody = document.createElement("tbody");
  for ( var i = 1; i < Rows.length; ++i ) {
    var Row = Rows[i];
    makeTableRow(OutputTableBody, Row[0],
                                  formatNumber(Row[1]),
                                  formatNumber(Row[2]),
                                  formatNumber(Row[3]),
                                  formatNumber(Row[4]),
                                  formatNumber(Row[5]));
  }
  OutputTable.appendChild(OutputTableBody);
  Output.appendChild(OutputTable);

  return true;
}

function removeAllChilds(node) {
  if ( node )
    while ( node.firstChild )
      node.removeChild(node.firstChild);
}

function makeTableHeader(otable) {
  var new_tr = document.createElement("tr");
  for ( var i = 1; i < arguments.length; ++i ) {
    var new_th = document.createElement("th");
    new_th.appendChild(document.createTextNode(arguments[i]));
    new_tr.appendChild(new_th);
  }
  var new_thead = document.createElement("thead");
  new_thead.appendChild(new_tr);
  otable.appendChild(new_thead);
}

function makeTableRow(otable) {
  var new_tr = document.createElement("tr");
  for ( var i = 1; i < arguments.length; ++i ) {
    var new_td = document.createElement("td");
    new_td.appendChild(document.createTextNode(arguments[i]));
    new_tr.appendChild(new_td);
  }
  otable.appendChild(new_tr);
}

function getRadioValue(radio) {
  var i = 0;
  while ( i < radio.length ) {
    if ( radio[i].checked )
      return radio[i].value;
    ++i;
  }
  return;
}

/* Description: Retrieve the default selected element from an option group.
 *              (e.g. <option id="default" selected="selected">Default</option>
 */
function getDefaultSelected(element) {
  if ( element.options ) {
    var i = 0;
    while ( i < element.options.length ) {
      if ( element.options[i].defaultSelected ) {
        return element.options[i];
      }
      ++i;
    }
    return element.options[0];
  }
  return;
}

