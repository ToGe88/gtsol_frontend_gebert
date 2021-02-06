function replacePlaceholder(content, placeholder, value) {
  if (value || value === '') {
    return content.replace(`~${placeholder}~`, value);
  }

  return content;
}

export default replacePlaceholder;