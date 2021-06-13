/**
 * Interest Calculator
 * Copyright (C) 2004-2021  Georgi D. Sotirov
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
 * @file Interest Calculator Core JavaScript
 * @version 0.5.2
 * @author Georgi D. Sotirov <gdsotirov@gmail.com>
 */

/**
 * Calculate table with interest amount on a deposit account for a given period
 * @param {number} amount Deposed amount
 * @param {number} type Type of the deposit (in months)
 * @param {*} interest Yearly interest
 * @param {*} itype Interest type (simple or compound)
 * @param {*} period Period of the deposit (in months)
 * @returns A two dimensional array with calculated interest amount per period
 */
function calc_interest(amount, type, interest, itype, period) {
  if ( period % type )
    return 0;

  var profit;
  var profit_tax;
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
    else {
      profit = 0.0;
    }

    /* According to art. 38, par. 13 and art. 46, par. 4 of ЗДДФЛ
     * see https://www.lex.bg/bg/laws/ldoc/2135538631
     */
    profit_tax = profit * 8 / 100;

    if ( itype == "compaund" ) {
      acc += profit - profit_tax;
      Rows[i] = new Array(month,
                          profit,
                          profit_tax,
                          profit - profit_tax,
                          acc - amount,
                          acc);
    }
    else {
      Rows[i] = new Array(month,
                          profit,
                          profit_tax,
                          profit - profit_tax,
                          i * profit - profit_tax,
                          amount);
    }
  }

  return Rows;
}

