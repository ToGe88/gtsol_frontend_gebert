import { create } from 'lodash';
import { CONFIG } from '../../config';

import TemplateHandler from '../../helpers/templateHandler';
import addClass from '../../helpers/addClass';
import removeClass from '../../helpers/removeClass';
import dispatchCustomEvent from '../../helpers/dispatchCustomEvent';
import replacePlaceholder from '../../helpers/replacePlaceholder';
// import Chart from 'chart.js';

class TimesDisplay {
  constructor(options = {}) {
    this.element = options.element;
    this.content = this.element.querySelector('.times-display__content');
    this.diagram = this.element.querySelector('.times-display__diagram');
  }

  init() {
    console.log('---- Times Display Init ----');
    this.clearContent();
    this.initEvents();
  }

  clearContent() {
    this.diagram.innerHTML = '';
    this.content.innerHTML = '';
  }

  initEvents() {
    window.addEventListener('user-selected', (ev) => {
      console.log('USER Selected', ev);
      this.selectItem(ev.detail.id);
    });

    window.addEventListener('times-creation-success', () => this.clearContent());
  }

  selectItem(id) {
    fetch(`${CONFIG.baseUrl}users/${id}`)
    .then((res) => res.json())
    .then((result) => {
      console.log(result);
      // this.data = result.data;
      // this.renderData(this.data);
      this.showData(result.data);
    })
    .catch((error) => console.error(error));
  }

  showData(data) {
    this.clearContent();
    const timesItem = document.createElement('section');
    const description = document.createElement('div');
    addClass(description, 'times-display__item__description');
    description.innerHTML = `
      <small>${data.id}</small>
      <h2>Data of ${data.first_name} ${data.last_name}</h2>
      <p>E-Mail: ${data.email}</p>
    `;
    timesItem.appendChild(description);
    const cta = document.createElement('div');
    addClass(cta, 'times-display__item__cta');
    const createEntryButton = document.createElement('button');
    createEntryButton.value = 'Create New Time Entry';
    createEntryButton.innerText = 'Create New Time Entry';
    createEntryButton.addEventListener('click', () => {
      console.log('Create Button Clicked');
      dispatchCustomEvent('times-create-new', {
        id: data.id,
      });
    });

    cta.appendChild(createEntryButton);
    timesItem.appendChild(cta);

    fetch(`${CONFIG.baseUrl}users/${data.id}/times`)
    .then((res) => res.json())
    .then((result) => {
      if (result.data.length > 0) {
        const data = {
          datasets: [{
            data: [],
            backgroundColor: [],
          }],
          labels: [],
        };

        result.data.forEach((entry) => {
          console.log(entry);
          timesItem.insertAdjacentHTML('beforeend', this.renderTimesEntry(entry));
          
          const date1 = new Date(entry.start);
          const date2 = new Date(entry.end);
          const diffTime = Math.abs(date2 - date1);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) !== 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 1; 

          data.datasets[0].data.push(diffDays);
          data.labels.push(`${diffDays.toString()} Day/s`);
        });
        console.log(data);
        for (let i = 0; i < result.data.length; i += 1) {
          data.datasets[0].backgroundColor.push(`hsl(240, 100%, ${100 / result.data.length * i}%)`);
          console.log(i, data.datasets[0].backgroundColor);

        }
        const canvas = document.createElement('canvas');
        this.diagram.appendChild(canvas);
        removeClass(this.diagram, 'hidden');
        const myPieChart = new Chart(canvas.getContext('2d'), {
          type: 'doughnut',
          data,
          options: {
            cutoutPercentage: 80,
          }
        });
      } else {
        addClass(this.diagram, 'hidden');
        timesItem.insertAdjacentHTML('beforeend', '<h3>Man, this guy is lazy!</h3>');
      }
    })
    .catch((error) => console.error(error));
    console.log(timesItem);

    this.content.appendChild(timesItem);
  }

  renderTimesEntry(entry) {
    this.template = TemplateHandler.getTemplate('times-display-item');
    this.template = replacePlaceholder(this.template, 'ID', entry.id);
    this.template = replacePlaceholder(this.template, 'Start', `<span>${entry.start}</span>`);
    this.template = replacePlaceholder(this.template, 'End', `<span>${entry.end}</span>`);
    return this.template;
  }
}

export default TimesDisplay;