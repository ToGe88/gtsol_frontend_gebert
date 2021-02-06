
function addClass(element, className) {
  if (!element) {
    return;
  }

  if (NodeList.prototype.isPrototypeOf(element) || Array.prototype.isPrototypeOf(element)) {
    arrayFrom(element).forEach(subelement => addClass(subelement, className));
    return;
  }

  const classes = (element.getAttribute('class') || '').split(' ').filter(Boolean).filter(cn => cn !== className);
  classes.push(className);
  element.setAttribute('class', classes.join(' '));
}

export default addClass;