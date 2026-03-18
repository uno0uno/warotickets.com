/**
 * Service fee logic for WaRo Tickets.
 * Flat formula: price * 3.26% + $1,894 COP fixed per ticket.
 * No capacity tiers — same formula for all events.
 */

export const SERVICE_FEE_RATE = 3.26    // percentage
export const SERVICE_FEE_FIXED = 1894   // COP fixed per ticket

export function useServiceFee() {
  /**
   * Computes the service fee for a single ticket using the flat formula.
   * Returns fixedFee, variableFee, totalFee, and the public price.
   */
  function computeServiceFee(ticketPrice: number) {
    const variableFee = Math.round(ticketPrice * SERVICE_FEE_RATE / 100)
    const totalFee = SERVICE_FEE_FIXED + variableFee
    return {
      fixedFee: SERVICE_FEE_FIXED,
      variableFee,
      totalFee,
      publicPrice: ticketPrice + totalFee
    }
  }

  /**
   * Formats a COP amount as "$X,XXX".
   */
  function formatCOP(amount: number): string {
    return `$${amount.toLocaleString('es-CO')}`
  }

  return {
    computeServiceFee,
    formatCOP,
  }
}
