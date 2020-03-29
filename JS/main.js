import { Animations } from './animations.js';
import {
  Ajax,
  getCoinInfoByID,
  LiveReports,
  drawMainPage,
  drawInfoPage
} from './services.js';
import { UI } from './ui.js';

$(function() {
  Animations.hamburgerAnimation();

  Ajax.getDataFromURL('https://api.coingecko.com/api/v3/coins/list');

  console.log(window);
  drawMainPage();
  drawInfoPage();
  UI.getCurrYear();
  $('#InfoSctn').hide();
});
