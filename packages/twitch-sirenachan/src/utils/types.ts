export type Triggers = {
  firstWord?: string[];
  any?: string[] | string[][];
};

export type FeatureFile = {
  triggers?: Triggers;
  onMessage?: (userName: string, wordsList: string[]) => string | Promise<string>;
  onTimer?: () => string;
};
