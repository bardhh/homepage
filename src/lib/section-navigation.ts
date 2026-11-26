export function sectionScrollTop(section: HTMLElement) {
  const inset = parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
  return Math.max(0, section.getBoundingClientRect().top + window.scrollY - inset);
}
