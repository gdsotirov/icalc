/* Interest Calculator
 * Copyright (C) 2004-2006  Georgi D. Sotirov
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
 * Description: Interest Calculator Core JavaScript
 * Version: 0.3.1
 * $Id: icc.js,v 1.9 2006/12/07 09:59:58 gsotirov Exp $
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

