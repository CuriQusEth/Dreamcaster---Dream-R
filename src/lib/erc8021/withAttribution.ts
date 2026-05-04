/**
 * ERC-8021: Transaction Attribution
 * Appends builder tracking code to transaction data.
 */
import { Hex, toHex, concat } from 'viem';

export function withAttribution(data: Hex, builderCode: string): Hex {
  const attributionData = toHex(`ATTRIBUTION:${builderCode}`);
  return concat([data, attributionData]);
}
