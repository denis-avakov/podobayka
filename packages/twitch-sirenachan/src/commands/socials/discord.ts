export default {
  triggers: ['!discord', '!ds', '!dis', '!дис'],
  run: (user: string, message?: string) => {
    return `${user} https://discord.gg/FgkgzzDRWJ`;
  }
};
