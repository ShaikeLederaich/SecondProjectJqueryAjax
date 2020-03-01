import { Animations } from './animations.js';
import {GetCoinParamBySrcSym} from './services.js'

export class UI {
  static drawCryptoCoinsCards(index, symbol, name, id) {
    let output = `
      <div data-index="${index}" id="${id}" class="card myCardBox">
        <label class="rocker rocker-small">
          <input type="checkbox" />
          <span class="switch-left">Yes</span>
          <span class="switch-right">No</span>
        </label>
        <div class="card-body">
          <h5 class="card-title text-center font-weight-bolder">${symbol}</h5>
          <p class="card-text font-weight-bold text-center">${name}</p>
          <button class="btn btn-primary btn-block" data-toggle="collapse" data-target="#collapse-${id}">Read More</button>

          <div class="collapse mb-5" id="collapse-${id}">
            <div class="card">
              
            </div>
          </div>

        </div>
      </div>
      `;
    $('#boxOfAllCards').append(output);
  }

  static showLoaderAnimation(id) {
    let output = `
    <img id="loadImg" class="mx-auto my-3" src="./image/770.png" width="200px" alt="loader" >
    <img id="loadText" class="mx-auto pb-3" src="./image/289 (1).png" width="128px" alt="text animation">
    `;
    $(`div#${id} > div.card-body > div#collapse-${id} > div.card`).html(output);
  }

  static pushCollapseToDivByID(id, imgLink, currPriceObj) {
    $(
      `div#${id} > div.card-body > div#collapse-${id} > div.card > img#loadText`
    ).replaceWith(`
      <div class="card-body">
        <p class="card-text text-center">
        Current Price in US Dollar:<span>${currPriceObj.Usd}</span><br>
        Current Price in Euru:<span>${currPriceObj.Eur}</span><br>
        Current Price in IL Shekel:<span>${currPriceObj.Ils}</span>
        </p>
      </div>
    `);
    $(
      `div#${id} > div.card-body > div#collapse-${id} > div.card > img#loadImg`
    ).replaceWith(
      `<img class="card-img-top" src="${imgLink}" alt="Card image cap">`
    );
    setTimeout(() => {
      $(`div#collapse-${id}`).collapse('hide');
    }, 10000);
  }

  static drawBTNSearchCoinResult(template, id, sym) {
    $('#sctn2').html(template);
    $('h2 > span').text(`${sym}`);
    $('h3 > span').text(`${id}`);
    console.log(template);
    Animations.testSpecialBoxAnimation();
    let maiHeader = document.getElementById('myHeader')
    maiHeader.style.zIndex = -1

    $('#mySpecialSrcBox > #moreInfo').click(function (e) { 
      console.log(e)
      GetCoinParamBySrcSym(id)
      e.preventDefault();
      
    });

    $('#mySpecialSrcBox > i').click(function (e) { 
      console.log(e)
      $('#mySpecialSrcBox').hide()
      maiHeader.style.zIndex = 1
      e.preventDefault();
    });
  }

}
