export const getKeyByHTMLMediaElement = (element) => {
  if (!(element instanceof HTMLAudioElement)) {
    return;
  }

  return element.src;
};
