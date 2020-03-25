import { Animations } from './animations.js';
import { Ajax, LiveReports } from './services.js';
import { Storage } from './Storage.js';
import { Coins } from './coins.js';

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
          <button id="btn-${id}" class="btn btn-primary btn-block" data-toggle="collapse" data-target="#collapse-${id}">Read More</button>

          <div class="collapse mb-5" id="collapse-${id}">
          <div class="accordion">
          <div class="progress mt-4">
            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 75%">
            </div>
          </div>
          <div class="card">

          </div>
          </div>
          </div>
        </div>
      </div>
      `;
    $('#boxOfAllCards').append(output);
  }

  static pushCollapseToDivByID(id, imgLink, currPriceObj) {
    $(
      `#boxOfAllCards > div#${id} > .card-body > .collapse > .accordion > .progress`
    ).hide();
    $(`button#btn-${id}`).hide();

    $(
      `div#${id} > div.card-body > div#collapse-${id} > div.accordion > div.card`
    ).html(`
        <div class="card-body">
          <img class="card-img-top" src="${imgLink}" alt="Card image cap">
          <h5 class="card-title">Current<br/>Price:</h5>
          <p class="card-text text-center">
          <span id="spn1">US Dollar: </span><br/><span id="spn2"> &#36;${currPriceObj.Usd}</span>
          </p>
          <p class="card-text text-center">
          <span id="spn3">Euru:</span><br/><span id="spn4"> &#8364;${currPriceObj.Eur}</span>
          </p>
          <p class="card-text text-center">
          <span id="spn5">IL Shekel:</span><br/><span id="spn6"> &#8362;${currPriceObj.Ils}</span>
          </p>
          <button id="readLess-${id}" class="btn btn-primary btn-block" data-toggle="collapse" data-target="#collapse-${id}">Read Less</button>
        </div>
      `);

    $(`#readLess-${id}`).click(function(e) {
      $(`button#btn-${id}`).show();
      e.preventDefault();
    });
  }

  static drawSearchCoinResult(id, sym) {
    let mainHeader = document.getElementById('myHeader');
    let boxOfAllCards = document.getElementById('boxOfAllCards')

    Ajax.getHtmlTemplate('../HtmlTemplate/specialBox.html').then(temp => {
      $('#sctn2').html(temp);
      $('article#extraInfo').hide();
      $('h2 > span').text(`${sym}`);
      $('h3 > span').text(`${id}`);
      Animations.testSpecialBoxAnimation();
      mainHeader.style.zIndex = -1;
      boxOfAllCards.style.zIndex = -1;
      UI.drawAndHideMoreInfoForSpeacialBox(id);
      UI.updateModalAndLiveArrFromSpecialBox(sym, id);
    });
  }

  static drawAndHideMoreInfoForSpeacialBox(id) {
    let mainHeader = document.getElementById('myHeader');

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
      mainHeader.style.zIndex = 0;
      boxOfAllCards.style.zIndex = 1;
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

  static updateModalAndLiveArrFromSpecialBox(sym, id) {
    sym = sym.toUpperCase();
    console.log(sym);
    if (LiveReports.liveRep.includes(sym)) {
      $('#mySpecialSrcBox > label > input').prop('checked', true);
      $('#mySpecialSrcBox > label > input').on('click', function() {
        updateModalAndLiveArr(sym, id);
        $(`div#${id} > label > .liveRepCheck`).prop('checked', false);
      });
      console.log('Yes');
    } else {
      $('#mySpecialSrcBox > label > input').on('click', function() {
        updateModalAndLiveArr(sym, id);
        $(`div#${id} > label > .liveRepCheck`).prop('checked', true);
      });
      console.log('No');
    }
  }

  static updateModalAndLiveArrFromAllCards() {
    let coinsList = Coins.getList();
    let eTarget;

    $.each(coinsList, function(indexInArray, valueOfElement) {
      let id = valueOfElement.id;
      let sym = valueOfElement.symbol;
      sym = sym.toUpperCase();

      $(`div#${id}`).each(function(index, element) {
        $(this).on('click', 'input', function(e) {
          eTarget = e.target;
          updateModalAndLiveArr(sym, id);
        });
      });
    });

    UI.removeFromLiveRepArrFromTheModal(LiveReports.pushFromModal);
  }

  static removeFromLiveRepArrFromTheModal(callback) {
    $('.modal-footer > #confirm').on('click', function(e) {
      let allInputsAtList = $('ol')
        .children()
        .children()
        .children('label')
        .children('input');

      $.each(allInputsAtList, function(indexInArray, input) {
        if (this.checked === true) {
          let currSym = $(
            `ol > li:nth-child(${indexInArray + 1}) > p > span:nth-child(2)`
          ).text();
          currSym = currSym.toUpperCase();
          console.log(currSym);

          let indexLiveRep = LiveReports.liveRep.indexOf(currSym);

          console.log(indexLiveRep);

          let currId = $(
            `ol > li:nth-child(${indexInArray + 1}) > p > span:first-child`
          ).text();
          console.log(currId);

          LiveReports.liveRep.splice(indexLiveRep, 1);
          console.log(LiveReports.liveRep);

          $(`div#${currId} > label > .liveRepCheck`).prop('checked', false);
        }
      });
      $('#myModal').modal('hide');
    });

    $('#myModal').on('hidden.bs.modal', function(e) {
      console.log('12345');

      LiveReports.removeAttrToOpenModal();
      $('.liveRepCheck').prop('disabled', false);

      callback();
    });
  }

  static addLiToModalList(arr) {
    $('#myModal > .modal-dialog > .modal-content > .modal-body > ol').empty();

    let newSym = arr[5];

    arr.pop();
    Storage.setLiveRepToLocalStorage(arr);

    for (let sym of arr) {
      sym = sym.toLowerCase();
      let currObj = Coins.findCoinBySearch(sym);
      // console.log(currObj);

      let output = `
      <li id="${currObj.id}">
        <p>
        Currency Id: <span id="spn1-${currObj.id}">${currObj.id}</span>, Currency Symbol: <span id="spn2-${sym}" class="spnSym">${sym}</span>
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
      $('#myModal > .modal-dialog > .modal-content > .modal-body > ol').css({
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
        display: 'inline-block',
        'font-weight': 'bold',
        'font-style': 'italic',
        margin: '10px 15px'
      });

      //%--04) 'btn toggle' Style
      $(
        `#myModal > .modal-dialog > .modal-content > .modal-body > ol > li > p > .rocker`
      ).css({
        right: '3%',
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
    return newSym;
  }
  //%---Change 'Header' Height From '20%' To 'Auto' When 'Click' on Collapse Button inside Navbar
  static changeHeaderHeightToAuto() {
    let myHeader = document.getElementById('myHeader');
    $(myHeader).on('click', 'button#navCollapseBtn', function() {
      myHeader.style.height = 'auto';
      myHeader.style.zIndex = 2;
    });
    $('#collapsibleNavId').on('hidden.bs.collapse', function() {
      myHeader.style.height = '20%';
      myHeader.style.zIndex = 0;
    });
  }

  //%---Change Toggle-BTN Z-Index When Nav Collapse Is Open
  static changeZIndexForToggleBTN() {
    let cardToggle = document.querySelectorAll('label.rocker');
    $('#collapsibleNavId').on('show.bs.collapse', function() {
      console.log('Open');
      cardToggle[0].style.zIndex = 0;
      cardToggle[1].style.zIndex = 0;
    });
    $('#collapsibleNavId').on('hide.bs.collapse', function() {
      console.log('Close');
      cardToggle[0].style.zIndex = 2;
      cardToggle[1].style.zIndex = 2;
    });
  }

  static smartphoneLandscapeHeaderStyle() {
    let body = document.getElementsByTagName('body');
    // console.log(body)
    console.log(body[0].offsetHeight);
    console.log(body[0].offsetWidth);
    let header = document.getElementById('myHeader');
    let h1 = header.children[0];
    let borderBottom = header.children[1];
    let nav = header.children[4];
    let navCollapseBTN = nav.children[0].children[0];
    if (body[0].offsetHeight < 576 && body[0].offsetWidth < 767.98) {
      console.log('Yes');
      h1.style.height = '50%';
      nav.style.height = '50%';
      h1.style.fontSize = '3.5em';
      borderBottom.style.display = 'none'
      navCollapseBTN.style.position = 'absolute'
      navCollapseBTN.style.top = '0'
    } else {
      console.log('No');
      h1.style.height = '60%';
      nav.style.height = '40%';
    }
  }
}

function updateModalAndLiveArr(sym, id) {
  LiveReports.pushAndRemovedFromLiveReportsBefore6(sym);

  if (LiveReports.liveRep.length > 5) {
    $(this).attr({
      'data-toggle': 'modal',
      'data-target': '#myModal'
    });

    LiveReports.newsym = UI.addLiToModalList(LiveReports.liveRep);

    setTimeout(() => {
      $('#myModal').modal('show');

      $(`div#${id} > label > .liveRepCheck`).prop('checked', false);
    }, 200);

    $('.liveRepCheck').prop('disabled', true);
  }
}
