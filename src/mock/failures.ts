export type FailureScenario = 
  | 'none'
  | 'declined_card'
  | '3ds_fail'
  | 'sell_out'
  | 'double_click'
  | 'tamper_price'
  | 'network_timeout';

export interface FailureState {
  armedScenario: FailureScenario;
  fastLatency: boolean;
  tamperActive: boolean;
}

// In-memory failure singleton
let currentFailureState: FailureState = {
  armedScenario: 'none',
  fastLatency: false,
  tamperActive: false,
};

const listeners = new Set<(state: FailureState) => void>();

export function getFailureState(): FailureState {
  return { ...currentFailureState };
}

export function setFailureState(update: Partial<FailureState>) {
  currentFailureState = { ...currentFailureState, ...update };
  listeners.forEach((listener) => listener(currentFailureState));
}

export function armFailureScenario(scenario: FailureScenario) {
  if (currentFailureState.armedScenario === scenario) {
    // toggle off if already armed
    setFailureState({ armedScenario: 'none', tamperActive: false });
  } else {
    setFailureState({ 
      armedScenario: scenario, 
      tamperActive: scenario === 'tamper_price' 
    });
  }
}

export function resetFailureState() {
  currentFailureState = {
    armedScenario: 'none',
    fastLatency: false,
    tamperActive: false,
  };
  listeners.forEach((listener) => listener(currentFailureState));
}

export function subscribeFailureState(listener: (state: FailureState) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
