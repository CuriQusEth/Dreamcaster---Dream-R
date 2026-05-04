/**
 * ERC-8004: Trustless Agents Integration
 * Allows smart agents to interact with the garden state securely.
 */

export interface AgentIntent {
  agentId: string;
  action: 'water' | 'harvest' | 'sing';
  targetPlantId: string;
  signature: string;
}

export function verifyAgentIntent(intent: AgentIntent): boolean {
  // In a real implementation, you would verify the signature against the agent's public key
  // and check if they are authorized to interact with this specific garden using ERC-8004 primitives.
  console.log(`Verifying intent for agent ${intent.agentId}`);
  return true;
}
