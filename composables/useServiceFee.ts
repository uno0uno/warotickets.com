/**
 * Service fee tier logic for WaRo Tickets.
 * Tier is determined by the cluster's total_capacity.
 * Reusable across event creation, area config, public event pages, and cart.
 */

export interface ServiceFeeTier {
  label: string
  maxCapacity: number
  fixedFee: number
  percentage: number
}

export const SERVICE_FEE_TIERS: ServiceFeeTier[] = [
  { label: '1 – 500',       maxCapacity: 500,      fixedFee: 1290, percentage: 2.39 },
  { label: '501 – 2,000',   maxCapacity: 2000,     fixedFee: 1190, percentage: 2.39 },
  { label: '2,001 – 5,000', maxCapacity: 5000,     fixedFee: 1090, percentage: 2.39 },
  { label: '5,000+',        maxCapacity: Infinity,  fixedFee: 990,  percentage: 2.39 }
]

export function useServiceFee() {
  /**
   * Returns the active tier for a given total capacity.
   * Capacity 0 maps to the first tier (1–500).
   */
  function getTierForCapacity(capacity: number): ServiceFeeTier {
    return (
      SERVICE_FEE_TIERS.find(t => capacity <= t.maxCapacity) ??
      SERVICE_FEE_TIERS[SERVICE_FEE_TIERS.length - 1]
    )
  }

  /**
   * Computes the service fee for a single ticket.
   * Returns fixedFee, variableFee, totalFee, and the public price.
   */
  function computeServiceFee(ticketPrice: number, capacity: number) {
    const tier = getTierForCapacity(capacity)
    const variableFee = Math.round(ticketPrice * tier.percentage / 100)
    const totalFee = tier.fixedFee + variableFee
    return {
      tier,
      fixedFee: tier.fixedFee,
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
    getTierForCapacity,
    computeServiceFee,
    formatCOP,
    SERVICE_FEE_TIERS
  }
}
