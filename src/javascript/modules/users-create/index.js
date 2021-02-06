/**
 * Config Import
 */
import { CONFIG } from '../../config';

/**
 * Helpers Import
 */
import dispatchCustomEvent from '../../helpers/dispatchCustomEvent';

class UsersCreate {
  constructor(options = {}) {
    this.element = options.element;
    this.form = this.element.querySelector('form');
  }

  /**
   * Init Function.
   */
  init() {
    console.log('---- Users Create Init ----');
    this.initForm();
  }

  /**
   * User Creation Form Init
   */
  initForm() {
    console.log('---- Initing Form ----');
    /**
     * Add Submit Listener.
     */
    this.form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      let formData = new FormData(this.form);
      fetch('https://morning-harbor-70967.herokuapp.com/users', {
        method: 'POST',
        body: formData,
      })
      .then((res) => res.json())
      .then((res) => this.triggerUserCreateSuccess(res))
      .catch((error) => this.triggerUserCreateError(error));
    });
  }

  /**
   * Trigger User Success Event.
   * @param {*} response 
   */
  triggerUserCreateSuccess(response) {
    console.log('Trigger Create Success', response);

    dispatchCustomEvent('user-creation-success', {});
  }

  /**
   * Trigger User Error Event.
   * @param {*} error 
   */
  triggerUserCreateError(error) {
    console.error(error);
    
    dispatchCustomEvent('user-creation-error', {});
  }
}

export default UsersCreate;