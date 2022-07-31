export default {
  triggers: ['!singletag', '!сінглтап'],
  run: (user: string, message?: string) => {
    return `${user} я новенька в грі, знаю, що потрібно використовувати більше пальців, але мені зручніше сінглтапати. Я намагаюсь навчитись, але поки погано виходить SadgeCry`;
  }
};
