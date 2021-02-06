import { CONFIG } from '../../config';

import dispatchCustomEvent from '../../helpers/dispatchCustomEvent';

class UsersCreate {
  constructor(options = {}) {
    this.element = options.element;

    this.form = this.element.querySelector('form');
  }

  init() {
    console.log('---- Users Create Init ----');

    // fetch(`${CONFIG.baseUrl}users`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     email: 'test@test.de',
    //     first_name: 'John',
    //     last_name: 'Doe',
    //   })
    // })
    // .then((res) => res.json())
    // .then((result) => this.renderData(result))
    // .catch((error) => this.renderError(error));
    this.initForm();
    
  }

  initForm() {
    console.log('---- Initing Form ----');

    this.form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      let formData = new FormData(this.form);
      console.log(formData.get('email'));

      fetch('https://morning-harbor-70967.herokuapp.com/users', {
        method: 'POST',
        // headers: {
        //   'Content-Type': 'application/x-www-form-urlencoded'
        // },
        body: formData,
      })
      .then((res) => res.json())
      .then((res) => this.triggerUserCreateSuccess(res))
      .catch((error) => this.triggerUserCreateError(res));
    });
  }

  triggerUserCreateSuccess(response) {
    console.log('Trigger Create Success', response);

    dispatchCustomEvent('user-creation-success', {});
  }

  triggerUserCreateError(error) {
    console.error(error);
    
    dispatchCustomEvent('user-creation-error', {});
  }

  // renderData(data) {
  //   console.log('RENDER DATA IN CREATE: ', data);
  //   if (data.length > 0) {
  //     console.log('I have Data to display', data);

  //     data.forEach((item) => {
  //       this.template = TemplateHandler.getTemplate('users-display-item');
  //       this.template = replacePlaceholder(this.template, 'Name', data.name);
  
  //       this.element.insertAdjacentHTML('beforeend', this.template);
  //     });
  //   } else {
  //     this.element.insertAdjacentHTML('beforeend', 'No data to show');
  //   }
  // }

  // renderError(error) {
  //   console.log('RENDER ERROR IN CREATE: ', error);
  // }
}

export default UsersCreate;