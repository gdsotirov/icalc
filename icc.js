<!--
/* Interest calculations
 * ---
 * Written by George D. Sotirov (gsotirov@obs.bg)
 */

/* Function   : calc_interest
 * Description: Calculate interest
 * Parameters : amount   - the deposed amount
 *              type     - type of the deposit (months)
 *              interest - yearly interest
 *              period   - the period of the deposit
 */
function calc_interest(amount, type, interest, period) {
  if ( period % type )
     return 0;
  var iperiods = period / type;
  var acc = amount;
  var Rows = new Array();
  for ( var i = 1; i <= iperiods; ++i ) {
    var month = i * type;
    var profit;
    if ( type < 12 )
      profit = acc * interest/12/100;
    else
      profit = acc * interest/100;
    acc += profit;
    var row = new Array(month, acc, profit);
    Rows[i] = row;
  }
  return Rows;
}
//-->
