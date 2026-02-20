/**
 * Pricing utilities to ensure consistency between frontend and backend
 */

export interface PricingCalculation {
  servicePrice: number;
  adjustedPricePerSlot: number;
  totalPrice: number;
  numberOfPeople: number;
  numberOfSlots: number;
}

/**
 * Calculate booking price using consistent logic
 * This matches the backend calculation: (service.pricePerSlot + 1) * slots * people
 * The $1 platform fee is included in the total price
 */
export const calculateBookingPrice = (
  servicePricePerSlot: number,
  numberOfSlots: number,
  numberOfPeople: number,
): PricingCalculation => {
  const adjustedPricePerSlot = servicePricePerSlot + 1; // Add $1 platform fee
  const totalPrice = adjustedPricePerSlot * numberOfSlots * numberOfPeople;

  return {
    servicePrice: servicePricePerSlot,
    adjustedPricePerSlot,
    totalPrice,
    numberOfPeople,
    numberOfSlots,
  };
};

/**
 * Format price for display
 */
export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

/**
 * Calculate price per slot for display (includes the $1 platform fee)
 */
export const getDisplayPricePerSlot = (servicePricePerSlot: number): number => {
  return servicePricePerSlot; // $1 platform fee included
};

/**
 * Validate pricing consistency between frontend calculation and backend booking
 */
export const validatePricingConsistency = (
  frontendCalculation: PricingCalculation,
  backendBooking: { total: number; priceAtCheckout?: number },
): { isConsistent: boolean; discrepancy: number } => {
  const expectedTotal = frontendCalculation.totalPrice;
  const actualTotal = backendBooking.priceAtCheckout || backendBooking.total;
  const discrepancy = Math.abs(expectedTotal - actualTotal);

  return {
    isConsistent: discrepancy < 0.01, // Allow for small floating point differences
    discrepancy,
  };
};

/**
 * Get pricing breakdown for display
 */
export const getPricingBreakdown = (
  servicePricePerSlot: number,
  numberOfSlots: number,
  numberOfPeople: number,
) => {
  const calculation = calculateBookingPrice(
    servicePricePerSlot,
    numberOfSlots,
    numberOfPeople,
  );

  return {
    basePricePerSlot: calculation.servicePrice,
    adjustedPricePerSlot: calculation.adjustedPricePerSlot,
    totalSlots: numberOfSlots,
    numberOfPeople,
    subtotal: calculation.adjustedPricePerSlot * numberOfSlots,
    total: calculation.totalPrice,
    breakdown: [
      {
        label: `Base price per slot`,
        amount: calculation.servicePrice,
        description: "Service base price",
      },
      {
        label: `Platform fee per slot`,
        amount: 1,
        description: "Platform service fee",
      },
      {
        label: `Adjusted price per slot`,
        amount: calculation.adjustedPricePerSlot,
        description: "Total per slot",
      },
      {
        label: `Subtotal (${numberOfSlots} slots)`,
        amount: calculation.adjustedPricePerSlot * numberOfSlots,
        description: "Price for all slots",
      },
      {
        label: `Total (${numberOfPeople} people)`,
        amount: calculation.totalPrice,
        description: "Final total",
      },
    ],
  };
};

/**
 * Constants for pricing
 */
export const PRICING_CONSTANTS = {
  PLATFORM_FEE_PER_SLOT: 1, // $1 per slot platform fee (included in all prices)
  CURRENCY: "SGD",
  CURRENCY_SYMBOL: "$",
} as const;
