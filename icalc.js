<!--
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

var UIStringsBG = new Array(
/*  0 */ "Моля, попълнете полето Сума!",
/*  1 */ "Моля, задайте правилна стойност в полето Сума!\nНапример: 10000, 15500, 20100.55",
/*  2 */ "Моля, попълнете полето Годишен номинален лихвен процент!",
/*  3 */ "Моля, задайте правилна стойност в полето Годишен номинален лихвен процент!\nНапример: 3.5, 4, 6.0",
/*  4 */ "Моля, попълнете полето Срок на депозита!",
/*  5 */ "Моля, задайте правилна стойност в полето Срок на депозита!\nНапример: 1, 3, 6, 12",
/*  6 */ "Периода на депозита трябва да е кратен на броя месеци от типа на депозита!",
/*  7 */ "Месец",
/*  8 */ "Натрупване",
/*  9 */ "Печалба"
);

var UIStringsEN = new Array(
/*  0 */ "Please, fill in the Amount field!",
/*  1 */ "Please, fill in correct value in the Amount field!\nExample: 10000, 15500, 20100.55",
/*  2 */ "Please, fill in the Yearly Nominal Interest field!",
/*  3 */ "Please, fill in correct value in the Yearly Nominal Interest field!\nExample: 3.5, 4, 6.0",
/*  4 */ "Please, fill in the Period of the deposit field!",
/*  5 */ "Please, fill in correct value in the Period of the deposit field!\nExample: 1, 3, 6, 12",
/*  6 */ "The period of the deposit must be multiple to the month count in the type of the deposit!",
/*  7 */ "Month",
/*  8 */ "Accumulated",
/*  9 */ "Profit"
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
  else
    return "???";
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

function doReset() {
  var OutputTable = document.getElementById("OutputTable");
  OutputTable.innerHTML = "";
}

/*function showCC() {
  var imgCC = document.getElementById("CurCode");
  var sel = document.forms.CalcForm.Currency.value;

  switch ( sel ) {
    case "BGN" :
      imgCC.src = "bgn.gif";
      imgCC.alt = "BGN";
      break;
    case "USD" :
      imgCC.src = "usd.gif";
      imgCC.alt = "USD";
      break;
    case "EUR" :
      imgCC.src = "eur.gif";
      imgCC.alt = "EUR";
      break;
  }
}*/

function checkForm() {
  var form = document.forms.CalcForm;

  if ( !checkField(form.Amount, "float", uisPlsFillAmount, uisPlsCorrAmount) )
    return false;
  if ( !checkField(form.Interest, "float", uisPlsFillInterest, uisPlsCorrInterest) )
    return false;
  if ( !checkField(form.Period, "int", uisPlsFillPeriod, uisPlsCorrPeriod) )
    return false;
  var Period = parseInt(form.Period.value);
  var Type = parseInt(form.Type.value);
  if ( Period % Type ) {
     alert(loadUIString(uisPeriodError));
     form.Period.focus();
     return false;
  }
  return true;
}

function doCalc() {
  var form = document.forms.CalcForm;
  var amount = parseFloat(form.Amount.value);
  var type = parseInt(form.Type.value);
  var interest = parseFloat(form.Interest.value);
  var period = parseInt(form.Period.value);

  var OutputTable = document.getElementById("OutputTable");
  var Header = makeTableHeader();
  var RowsCode = "";
  var Rows = calc_interest(amount, type, interest, period);
  for ( var i = 1; i < Rows.length; ++i ) {
    var Row = Rows[i];
    RowsCode += makeTableRow(Row[0], Row[1], Row[2]);
  }
  OutputTable.innerHTML = Header + RowsCode;
  return true;
}

function makeTableHeader() {
  var header = "<tr>\n";
  var cur = document.forms.CalcForm.Currency.value;
  header += "<th width=\"15%\">" + loadUIString(uisMonth) + "</th>\n";
  header += "<th width=\"55%\">" + sprintf("%s, %s", loadUIString(uisAccumulated), cur) + "</th>\n";
  header += "<th>" + sprintf("%s, %s", loadUIString(uisProfit), cur) + "</th>\n";
  header += "</tr>\n";
  return header;
}

function makeTableRow(month, gain, interest) {
  var row = "<tr>\n";
  row += "<td>" + sprintf("%d", month) + "</td>\n";
  row += "<td>" + sprintf("%9.2f", gain) + "</td>\n";
  row += "<td>" + sprintf("%9.2f", interest) + "</td>\n";
  row += "</tr>\n";
  return row;
}
//-->
