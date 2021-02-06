/**
 * Config Import
 */
import { CONFIG } from '../../config';

/**
 * Helper Imports
 */
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

  /**
   * Init Function for Events and initial Data Fetch.
   */
  init() {
    console.log('---- Users Display Init ----');
    this.initEvents();
    this.fetchData();
  }

  /**
   * Adding Event Listeners for unique behaviour.
   */
  initEvents() {
    window.addEventListener('user-creation-success', () => this.fetchData());
    window.addEventListener('times-creation-success', () => this.fetchData());

    /**
     * Listen to Sort Change.
     */
    this.sort.addEventListener('change', (ev) => {
      ev.preventDefault();
      this.sortData(ev.target.value);
    });

    /**
     * Listen to Form Submit
     */
    this.searchForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const searchFormData = new FormData(this.searchForm);
      this.searchData(searchFormData);
    });

    /**
     * Listen to Reset Click and do initial Fetch again.
     */
    this.reset.addEventListener('click', () => {
      this.fetchData();
    })
  }

  /**
   * Fetch Initial Data from /users.
   */
  fetchData() {
    fetch(`${CONFIG.baseUrl}users`)
    .then((res) => res.json())
    .then((result) => {
      /**
       * Set initial Data.
       */
      this.initialData = result.data;

      /**
       * Render Data
       */
      this.renderData(this.initialData);
    })
    .catch((error) => this.renderError(error));
  }

  /**
   * Render the Data based on given Array.
   * @param {Array} data - Data-Array to Render.
   */
  renderData(data) {
    if (data.length > 0) {
      /**
       * Clear the content.
       */
      this.clearContent();

      /**
       * Instance-Data to initial Data.
       */
      this.data = this.initialData;
      data.forEach((item) => {
        const itemElement = document.createElement('section');
        addClass(itemElement, 'users-display__item');

        /**
         * Get Template and replace Placeholders with fetched data.
         */
        this.template = TemplateHandler.getTemplate('users-display-item');
        this.template = replacePlaceholder(this.template, 'FirstName', item.first_name);
        this.template = replacePlaceholder(this.template, 'LastName', item.last_name);
        this.template = replacePlaceholder(this.template, 'Mail', item.email);
        this.template = replacePlaceholder(this.template, 'ID', item.id);
  
        itemElement.insertAdjacentHTML('beforeend', this.template);
        
        /**
         * Check for Times Entries.
         */
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
        })
        .catch((error) => console.error(error));

        /**
         * Add Listeners to Buttons.
         */
        const showEntryButton = itemElement.querySelector('.users-display__item__show-entry');
        showEntryButton.addEventListener('click', () => {
          dispatchCustomEvent('user-selected', {
            id: item.id,
          });
        });

        const createEntryButton = itemElement.querySelector('.users-display__item__create-entry');
        createEntryButton.addEventListener('click', () => {
          dispatchCustomEvent('times-create-new', {
            id: item.id,
          });
        });

        /**
         * Append final Element to Content.
         */
        this.content.appendChild(itemElement);
      });
    } else {
      this.clearContent();
      this.data = this.initialData;
      this.content.insertAdjacentHTML('beforeend', '<h3>No data to show</h3>');
    }
  }

  /**
   * Error Function
   * @param {*} error 
   */
  renderError(error) {
    console.error('RENDER ERROR: ', error);
  }

  /**
   * Inital Clearing of Content
   */
  clearContent() {
    this.content.innerHTML = '';
  }

  /**
   * Sort Data by given Value.
   * @param {String} value - Value to sort by.
   */
  sortData(value) {
    this.sortBy = value || '';
    if (this.data.length > 0) {
      this.data = this.data.sort((a, b) => {
        return a[this.sortBy].localeCompare(b[this.sortBy])
      });

      /**
       * Render the sorted Data.
       */
      this.renderData(this.data);
    }
  }

  /**
   * Search for given Values by findBy and searchKey.
   * @param {FormData} formData - Initial Form Data.
   */
  searchData(formData) {
    if (this.initialData.length > 0) {
      this.data = this.initialData.filter((a) => {
        return a[formData.get('findBy')].search(formData.get('searchKey')) > -1 ? a : false;
      });

      /**
       * Check for SortBy and render afterwards.
       */
      if (this.sortBy) {
        this.sortData(this.sortBy)
      } else {
        this.renderData(this.data);
      }
    }
  }
}

export default UsersDisplay;