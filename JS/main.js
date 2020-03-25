import { Animations } from './animations.js';
import { Ajax, getCoinInfoByID, LiveReports, drawMainPage } from './services.js';
import { UI } from './ui.js';

$(function() {
  Animations.hamburgerAnimation();

  Ajax.getDataFromURL(
    'https://api.coingecko.com/api/v3/coins/list',
    getCoinInfoByID
  );
  
  // UI.smartphoneLandscapeHeaderStyle();

  drawMainPage();
});
