/* Interest calculator Web Interface
 * ---
 * Written by George D. Sotirov (gdsotirov@dir.bg)
 * Version: 0.1.1
 * $Id: icalc.js,v 1.10 2005/12/10 20:08:06 gsotirov Exp $
 */

/* This are the interests for the main currencyes as defined by
 * First Investment Bank as of 2005-03-01
 * The arrays should contain the interests for 1, 3, 6, 12, 18, 24 and
 * 36 months deposits in that order.
 */
var BGNInterests = new Array(3.50, 4.00, 4.50, 6.00, 7.00, 7.50, 9.00);
var USDInterests = new Array(2.75, 3.25, 4.00, 4.50, 5.00, 5.50, 7.00);
var EURInterests = new Array(2.50, 3.00, 3.50, 4.50, 5.00, 5.50, 7.00);
var CHFInterests = new Array(0.30, 0.40, 0.50, 0.60, 0.00, 0.00, 0.00);
var GBPInterests = new Array(3.50, 3.75, 4.00, 4.50, 5.00, 5.50, 7.00);

var uisPlsFillAmount = 0;
var uisPlsCorrAmount = 1;
var uisPlsFillInterest = 2;
var uisPlsCorrInterest = 3;
var uisPlsFillPeriod = 4;
var uisPlsCorrPeriod = 5;
var uisPeriodError = 6;
var uisMonth = 7;
var uisAccumulated = 8;
var uisProfit = 9;
var uisProfitAcc = 10;

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
/*  9 */ "Печалба",
/* 10 */ "Печалба натрупване"
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
/*  9 */ "Profit",
/* 10 */ "Profit accumulation"
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

function initForm() {
    var Form = document.forms.CalcForm;
    Form.Amount.focus();
    changeInterest(Form.Type.value, Form.Currency.value, Form.Interest);
}

function changeInterest(months, cur, element) {
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
  switch ( cur ) {
    case "BGN": interest = BGNInterests[index]; break;
    case "USD": interest = USDInterests[index]; break;
    case "EUR": interest = EURInterests[index]; break;
    case "CHF": interest = CHFInterests[index]; break;
    case "GBP": interest = GBPInterests[index]; break;
    default   : interest = 0.0; break;
  }
  element.value = interest;
}

function doReset() {
  var Output = document.getElementById("Output");
  removeAllChilds(Output);
  initForm();
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
  var amount = parseFloat(form.Amount.value);
  var type = parseInt(form.Type.value);
  var interest = parseFloat(form.Interest.value);
  var period = parseInt(form.Period.value);

  var Output = document.getElementById("Output");
  removeAllChilds(Output);
  var OutputTable = document.createElement("table");
  OutputTable.setAttribute("class", "tbThinBorder");
  OutputTable.setAttribute("id", "OutputTable");
  OutputTable.setAttribute("cellspacing", "0");
  var cur = document.forms.CalcForm.Currency.value;
  makeTableHeader(OutputTable, loadUIString(uisMonth),
                               sprintf("%s, %s", loadUIString(uisAccumulated), cur),
                               sprintf("%s, %s", loadUIString(uisProfit), cur),
                               sprintf("%s, %s", loadUIString(uisProfitAcc), cur));
  var Rows = calc_interest(amount, type, interest, period);
  var OutputTableBody = document.createElement("tbody");
  for ( var i = 1; i < Rows.length; ++i ) {
    var Row = Rows[i];
    makeTableRow(OutputTableBody, Row[0], sprintf("%3.2f", Row[1]), sprintf("%3.2f", Row[2]), sprintf("%3.2f", Row[3]));
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
