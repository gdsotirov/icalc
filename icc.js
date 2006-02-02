/* Interest calculator
 * ---
 * Written by George D. Sotirov (gdsotirov@dir.bg)
 * Version: 0.1.0
 * $Id: icc.js,v 1.7 2006/02/02 19:56:39 gsotirov Exp $
 */

/* Function   : calc_interest
 * Description: Calculate interest
 * Parameters : amount   - the deposed amount
 *              type     - type of the deposit (months)
 *              interest - yearly interest
 *              itype    - interest type (simple or compaund)
 *              period   - the period of the deposit
 */
function calc_interest(amount, type, interest, itype, period) {
  if ( period % type )
    return 0;

  var acc = amount; /* accumulated amount */
  var Rows = new Array();

  for ( var i = 1; i <= period / type; ++i ) {
    var month = i * type;
    if ( interest != 0.0 ) {
      if ( type <= 12 )
        profit = acc * interest / (12 / type) / 100;
      else
        profit = acc * interest / 100 * type / 12;
    }
    else
      profit = 0.0;
    if ( itype == "compaund" ) {
      acc += profit;
      Rows[i] = new Array(month, acc, profit, acc - amount);
    }
    else
      Rows[i] = new Array(month, amount, profit, i * profit);
  }

  return Rows;
}

