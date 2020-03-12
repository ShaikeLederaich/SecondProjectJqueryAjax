import { Animations } from './animations.js';
import { Ajax, getCoinInfoByID, LiveReports } from './services.js';
import { UI } from './ui.js';

$(function() {
  Animations.hamburgerAnimation();

  Ajax.getDataFromURL(
    'https://api.coingecko.com/api/v3/coins/list',
    getCoinInfoByID
  );
  console.log(window)
  // LiveReports.chart()
});
