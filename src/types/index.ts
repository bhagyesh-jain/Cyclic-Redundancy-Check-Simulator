export type SimulationStage = 
  | 'input'
  | 'padding'
  | 'division'
  | 'codeword'
  | 'transmission'
  | 'error_injection'
  | 'receiver_division'
  | 'verification';

export type AppMode = 'guided' | 'instant';

export interface PresetExample {
  id: string;
  name: string;
  data: string;
  generator: string;
  description: string;
  standard?: string;
}

export interface GlossaryTerm {
  term: string;
  shortDesc: string;
  detailedDesc: string;
  formula?: string;
  networkRelevance: string;
}
