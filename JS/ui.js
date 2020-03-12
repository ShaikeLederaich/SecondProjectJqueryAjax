import { Animations } from './animations.js';
import { Ajax } from './services.js';
import { Storage } from './Storage.js';
import { Coins } from './coinClasses.js';

export class UI {
  static drawCryptoCoinsCards(index, symbol, name, id) {
    let output = `
      <div data-index="${index}" id="${id}" class="card myCardBox">
        <label class="rocker rocker-small">
          <input type="checkbox" class="liveRepCheck"/>
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
    setTimeout(() => {
      $(
        `div#${id} > div.card-body > div#collapse-${id} > div.card > img#loadText`
      ).replaceWith(`
        <div class="card-body">
          <p class="card-text text-center">
          Current Price in <span id="spn1">US Dollar: </span><span id="spn2">&#36;${currPriceObj.Usd}</span>
          </p>
          <p class="card-text text-center">
          Current Price in <span id="spn3">Euru</span>:<span id="spn4"> &#8364;${currPriceObj.Eur}</span>
          </p>
          <p class="card-text text-center">
          Current Price in <span id="spn5">IL Shekel:</span><span id="spn6">&#8362;${currPriceObj.Ils}</span>
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
    }, 500);
  }

  static drawBTNSearchCoinResult(template, id, sym) {
    $('#sctn2').html(template);
    $('article#extraInfo').hide();
    $('h2 > span').text(`${sym}`);
    $('h3 > span').text(`${id}`);
    // console.log(template);
    Animations.testSpecialBoxAnimation();
    let mainHeader = document.getElementById('myHeader');
    mainHeader.style.zIndex = -1;

    $('#mySpecialSrcBox > #moreInfo').click(function(e) {
      let target = e.target.id;

      console.log(target);

      Storage.getCoinDetailsFromSessionStorage(id, target);

      $('article#extraInfo').fadeIn(2000);
      e.preventDefault();
    });

    $('#mySpecialSrcBox > i').click(function(e) {
      // console.log(e);
      $('#mySpecialSrcBox').fadeOut(1500);
      mainHeader.style.zIndex = 1;
      e.preventDefault();
    });
  }

  static drwaSearchingExtraInfo(id, img, price) {
    $('#extraInfo > #currPrice > header > h4 > span').text(id);
    $('#extraInfo > #currPrice > #text > #p1 > span').text(price.Usd);
    $('#extraInfo > #currPrice > #text > #p2 > span').text(price.Eur);
    $('#extraInfo > #currPrice > #text > #p3 > span').text(price.Ils);
    let imgPlace = document.getElementById('currCoinImg');
    imgPlace.style.backgroundImage = `url(${img})`;
  }

  static addCoinToModalList(arr) {
    $('#myModal > .modal-dialog > .modal-content > .modal-body > ol').empty();

    let newSym = arr[5];

    arr.pop();

    for (let sym of arr) {
      sym = sym.toLowerCase();
      let currObj = Coins.findCoinBySearch(sym);
      // console.log(currObj);

      let output = `
      <li id="${currObj.id}">
        <p>
        Currency Id: <span id="spn1-${currObj.id}">${currObj.id}</span>, Currency Symbol: <span id="spn2-${sym}">${sym}</span>
        <label class="rocker rocker-small">
          <input type="checkbox"/>
          <span class="switch-left">Yes</span>
          <span class="switch-right">No</span>
        </label>
        </p>
      </li>
      `;

      $('#myModal > .modal-dialog > .modal-content > .modal-body > ol').append(
        output
      );

      //%---Style For Modal List

      //%--01) 'ol' Style
      $(
        '#myModal > .modal-dialog > .modal-content > .modal-body > ol'
      ).css({
        'list-style-position': 'inside'
      });

      //%--02) 'li' Style
      $(
        '#myModal > .modal-dialog > .modal-content > .modal-body > ol > li'
      ).css({
        'font-size': '1.3rem',
        'border-bottom': '4px dashed black',
        'padding-top': '10px',
        'padding-bottom': '20px'
      });

      //%--03) 'p' Style
      $(
        '#myModal > .modal-dialog > .modal-content > .modal-body > ol > li > p'
      ).css({
        'display': 'inline-block',
        'font-weight': 'bold',
        'font-style': 'italic',
        'margin': '10px 15px'
      });

      //%--04) 'btn toggle' Style
      $(
        `#myModal > .modal-dialog > .modal-content > .modal-body > ol > li > p > .rocker`
      ).css({
        
        'right': '3%',
        'font-size': '0.65em'
      });

      //%--05) 'span' Style
      $(
        '#myModal > .modal-dialog > .modal-content > .modal-body > ol > li > p > span'
      ).css({
        'font-size': '1.4rem',
        color: 'Blue',
        'background-color': 'rgba(0, 0, 0, 0.25)',
        'font-weight': 'bold',
        'font-style': 'none'
      });
    }
    return newSym
  }
}
