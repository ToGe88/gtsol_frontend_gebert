import { CONFIG } from '../../config';

import TemplateHandler from '../../helpers/templateHandler';
import replacePlaceholder from '../../helpers/replacePlaceholder';
import addClass from '../../helpers/addClass';
import dispatchCustomEvent from '../../helpers/dispatchCustomEvent';

class UsersDisplay {
  constructor(options = {}) {
    this.element = options.element;
    this.content = this.element.querySelector('.users-display__content');
    this.sort = this.element.querySelector('[name="sort"]');
    this.searchForm = this.element.querySelector('form#search-form');
    this.reset = this.element.querySelector('.users-display__reset');
  }

  init() {
    console.log('---- Users Display Init ----');

    this.initEvents();
    this.fetchData();
  }

  initEvents() {
    window.addEventListener('user-creation-success', () => this.fetchData());
    window.addEventListener('times-creation-success', () => this.fetchData());

    this.sort.addEventListener('change', (ev) => {
      ev.preventDefault();
      console.log('Sort Changed');
      this.sortData(ev.target.value);
    });

    this.searchForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      console.log('Search Submitted');
      const searchFormData = new FormData(this.searchForm);
      this.searchData(searchFormData);
    });

    this.reset.addEventListener('click', () => {
      this.fetchData();
    })
  }

  fetchData() {
    fetch(`${CONFIG.baseUrl}users`)
    .then((res) => res.json())
    .then((result) => {
      this.initialData = result.data;
      this.renderData(this.initialData);
    })
    .catch((error) => this.renderError(error));
  }

  renderData(data) {
    console.log('RENDER DATA: ', data);
    if (data.length > 0) {
      this.clearContent();
      this.data = this.initialData;
      data.forEach((item) => {
        const itemElement = document.createElement('section');
        addClass(itemElement, 'users-display__item');
        this.template = TemplateHandler.getTemplate('users-display-item');
        this.template = replacePlaceholder(this.template, 'FirstName', item.first_name);
        this.template = replacePlaceholder(this.template, 'LastName', item.last_name);
        this.template = replacePlaceholder(this.template, 'Mail', item.email);
        this.template = replacePlaceholder(this.template, 'ID', item.id);
  
        itemElement.insertAdjacentHTML('beforeend', this.template);
        
        console.log('TIMES ENTRY CHECK: ', this.checkForTimesEntry(item.id));

        fetch(`${CONFIG.baseUrl}users/${item.id}/times`)
        .then((res) => res.json())
        .then((result) => {
          let countTemplate = '';

          if (result.data.length > 0) {
            if (result.data.length === 1) {
              countTemplate = `There is <span>${result.data.length}</span> Entry for Times.`;
            } else {
              countTemplate = `There are <span>${result.data.length}</span> Entries for Times.`;
            }
          }
          itemElement.querySelector('p.times-entries').innerHTML = countTemplate;
          console.log('TIMES ENTRY RESULT', result);
        })
        .catch((error) => console.error(error));


        const showEntryButton = itemElement.querySelector('.users-display__item__show-entry');
        showEntryButton.addEventListener('click', () => {
          console.log('Show Entry Click');
          dispatchCustomEvent('user-selected', {
            id: item.id,
          });
        });

        const createEntryButton = itemElement.querySelector('.users-display__item__create-entry');
        createEntryButton.addEventListener('click', () => {
          console.log('Create Entry Click');
          dispatchCustomEvent('times-create-new', {
            id: item.id,
          });
        });
        this.content.appendChild(itemElement);
      });
    } else {
      this.clearContent();
      this.data = this.initialData;
      this.content.insertAdjacentHTML('beforeend', 'No data to show');
    }
  }

  renderError(error) {
    console.log('RENDER ERROR: ', error);
  }

  clearContent() {
    this.content.innerHTML = '';
  }

  sortData(value) {
    this.sortBy = value || '';
    if (this.data.length > 0) {
      console.log(event.target.value);
      this.data = this.data.sort((a, b) => {
      //   console.log(a[event.target.value] - b[event.target.value], a[event.target.value], b[event.target.value]);
      //   a[event.target.value] - b[event.target.value]
        return a[this.sortBy].localeCompare(b[this.sortBy])
      });

      this.renderData(this.data);
    }
  }

  searchData(formData) {
    // this.fetchData();
    console.log('Searching Data: ');
    if (this.initialData.length > 0) {
      console.log(formData.get('findBy'), formData.get('searchKey'));
      this.data = this.initialData.filter((a) => {
        // console.log(a[data.get('findBy')].search(data.get('searchKey')));
        return a[formData.get('findBy')].search(formData.get('searchKey')) > -1 ? a : false;
      });

      if (this.sortBy) {
        this.sortData(this.sortBy)
      } else {
        this.renderData(this.data);
      }
    }
  }

  checkForTimesEntry(id) {
    let timesEntry = ''
    

    return timesEntry;
  }
}

export default UsersDisplay;