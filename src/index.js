import arrayFrom from 'array-from';
// import LazyLoad from 'vanilla-lazyload';

import "./scss/index.scss";

import UsersCreate from '../src/javascript/modules/users-create';
import UsersDisplay from '../src/javascript/modules/users-display';
import TimesDisplay from '../src/javascript/modules/times-display';
import TimesCreate from '../src/javascript/modules/times-create';

// OVERRIDES
const defineClassesMaster = () => ({
  UsersCreate,
  UsersDisplay,
  TimesDisplay,
  TimesCreate,
});

// GLOBAL INIT
/*
  all components that have a javascript module attached must provide "data-module" attribute in markup with the name of their JS class
  then their JS module will be instantiated
 */
const getModuleForInit = () => {
  const classesMaster = defineClassesMaster();

  return Object.assign({}, classesMaster);
};

const initModules = () => {


  // get all modules that will be used for auto initialization
  const classes = getModuleForInit();

  // get all modules to initialize on page
  const moduleElements = document.querySelectorAll('[data-module]');

  // initialize modules
  window.initializedModuleInstances = arrayFrom(moduleElements).map((moduleElement) => {
    const moduleClassName = moduleElement.getAttribute('data-module');

    try {
      if (moduleClassName !== '') {
        const instance = new (classes[moduleClassName])({
          element: moduleElement,
        });
        instance.init();
        return instance;
      }
      return null;
    } catch (er) {
      console.error(`error initializing module instance with class "${moduleClassName}"`);
      console.error(er);
      return null;
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initModules();
});
