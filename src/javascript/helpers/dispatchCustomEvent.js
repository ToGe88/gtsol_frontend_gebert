function dispatchCustomEvent(eventType, payload) {
  const customEvent = new CustomEvent(eventType, { detail: payload });

  // dispatch event for project
  window.dispatchEvent(customEvent);
}

export default dispatchCustomEvent;