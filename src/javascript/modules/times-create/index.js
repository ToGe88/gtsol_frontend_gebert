import dispatchCustomEvent from '../../helpers/dispatchCustomEvent';

class TimesCreate {
  constructor(options = {}) {
    this.element = options.element;
    this.form = this.element.querySelector('form#times-create-form');
  }

  init() {
    console.log('---- Times Create Init ----');

    this.initEvents();
  }

  initEvents() {
    window.addEventListener('times-create-new', (ev) => {
      this.fillForm(ev.detail.id);
    });

    this.form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      let formData = new FormData(this.form);
      console.log(formData.get('uid'));

      fetch(`https://morning-harbor-70967.herokuapp.com/users/${formData.get('uid')}/times`, {
        method: 'POST',
        // headers: {
        //   'Content-Type': 'application/x-www-form-urlencoded'
        // },
        body: formData,
      })
      .then((res) => res.json())
      .then((res) => this.triggerTimesCreateSuccess(res))
      .catch((error) => this.triggerTimesCreateError(error));
    });
  }

  fillForm(id) {
    this.form.querySelector('[name="uid"]').value = id;
  }

  triggerTimesCreateSuccess(response) {
    console.log('Trigger Create Success', response);

    dispatchCustomEvent('times-creation-success', {});
  }

  triggerTimesCreateError(error) {
    console.error(error);
    
    dispatchCustomEvent('times-creation-error', {});
  }
}

export default TimesCreate;