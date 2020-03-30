import { Animations } from './animations.js';
import {
  Ajax,
  drawMainPage,
  drawInfoPage
} from './services.js';
import { UI } from './ui.js';

$(function() {
  Animations.hamburgerAnimation();

  Ajax.getDataFromURL('https://api.coingecko.com/api/v3/coins/list');

  drawMainPage();
  drawInfoPage();
  UI.getCurrYear();
  $('#InfoSctn').hide();
});
