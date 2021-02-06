/**
 * Config Import.
 */
import { CONFIG } from '../../config';

/**
 * Helpers Import
 */
import dispatchCustomEvent from '../../helpers/dispatchCustomEvent';

class TimesCreate {
  constructor(options = {}) {
    this.element = options.element;
    this.form = this.element.querySelector('form#times-create-form');
  }

  /**
   * Init Function
   */
  init() {
    console.log('---- Times Create Init ----');

    this.initEvents();
  }

  /**
   * Init Event Listeners
   */
  initEvents() {
    window.addEventListener('times-create-new', (ev) => {
      this.fillForm(ev.detail.id);
    });

    /**
     * Listen to Form Submit
     */
    this.form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      let formData = new FormData(this.form);

      fetch(`${CONFIG.baseUrl}/users/${formData.get('uid')}/times`, {
        method: 'POST',
        body: formData,
      })
      .then((res) => res.json())
      .then((res) => this.triggerTimesCreateSuccess(res))
      .catch((error) => this.triggerTimesCreateError(error));
    });
  }

  /**
   * Fill Form with given ID.
   * @param {String} id 
   */
  fillForm(id) {
    this.form.querySelector('[name="uid"]').value = id;
    this.form.querySelector('[name="uid"]').focus();
  }

  /**
   * Trigger Success Event.
   * @param {*} response 
   */
  triggerTimesCreateSuccess(response) {
    dispatchCustomEvent('times-creation-success', {});
  }

  /**
   * Trigger Error Event.
   * @param {*} error 
   */
  triggerTimesCreateError(error) {
    console.error(error);
    
    dispatchCustomEvent('times-creation-error', {});
  }
}

export default TimesCreate;