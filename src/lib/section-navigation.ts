export function sectionScrollStops(sections: HTMLElement[]) {
  const root = document.documentElement;
  const maxScroll = root.scrollHeight - root.clientHeight;
  return sections.map(section => {
    const inset = parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
    const top = section.getBoundingClientRect().top + window.scrollY - inset;
    return Math.max(0, Math.min(top, maxScroll));
  });
}
