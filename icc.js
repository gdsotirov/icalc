/* Interest calculator
 * ---
 * Written by George D. Sotirov (gdsotirov@dir.bg)
 * Version: 0.1.0
 * $Id: icc.js,v 1.3 2005/05/23 20:53:45 gsotirov Exp $
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

  var acc = amount;
  var Rows = new Array();

  for ( var i = 1; i <= period/type; ++i ) {
    if ( type <= 12 )
      var profit = acc * interest/(12/type)/100;
    else
      var profit = acc * interest/100;
    acc += profit;
    var row = new Array(i * type, acc, profit, acc - amount);
    Rows[i] = row;
  }
  return Rows;
}

