class TemplateHandler {
  static getTemplate(templateName, element = null) {
    const selector = element || document;
    const scriptTemplate = selector.querySelector(`[data-template-name="${templateName}"]`);

    return scriptTemplate.innerHTML;
  }
}

export default TemplateHandler;
