import { PromptTemplate } from '@langchain/core/prompts';
import type { GraphState } from '../state.ts';
import { prompts } from '../../config.ts';
import { AIMessage } from 'langchain';

export async function blockedNode(state: GraphState): Promise<Partial<GraphState>> {
  const guardrailCheck = state.guardrailCheck!;
  const analysis = guardrailCheck.analysis ? `**Analysis:** ${guardrailCheck.analysis}` : '';

  const permissions = state.user.permissions?.join(', ') ?? 'None';
  const template = PromptTemplate.fromTemplate(prompts.blocked);
  const blockedMessage = await template.format({
    REASON: guardrailCheck.reason ?? 'security check failed',
    ANALYSIS: analysis,
    PERMISSIONS: permissions,
    USER_ROLE: state.user.role,
  })

  return {
    messages: [new AIMessage(blockedMessage)],
  };
}
