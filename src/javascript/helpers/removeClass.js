function removeClass(element, className) {
  if (!element) {
    return;
  }

  if (NodeList.prototype.isPrototypeOf(element) || Array.prototype.isPrototypeOf(element)) {
    arrayFrom(element).forEach(subelement => removeClass(subelement, className));
    return;
  }

  const classes = (element.getAttribute('class') || '').split(' ').filter(Boolean).filter(cn => cn !== className);
  element.setAttribute('class', classes.join(' '));
}

export default removeClass;