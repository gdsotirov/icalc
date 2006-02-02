/* Interest calculator
 * ---
 * Written by George D. Sotirov (gdsotirov@dir.bg)
 * Version: 0.1.0
 * $Id: icc.js,v 1.6 2006/02/02 19:27:33 gsotirov Exp $
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

  for ( var i = 1; i <= period / type; ++i ) {
    if ( interest != 0.0 ) {
      if ( type <= 12 )
        profit = acc * interest / (12 / type) / 100;
      else
        profit = acc * interest / 100 * type / 12;
    }
    else
      profit = 0.0;
    acc += profit;
    Rows[i] = new Array(i * type, acc, profit, acc - amount);
  }

  return Rows;
}

