import { UI } from './ui.js';
import { CryptoCoinObj, Coins } from './coinClasses.js';
import { Storage } from './Storage.js';

export class Ajax {
  //%---This Function Send API 'GET' Request And get All Crypto Coins list
  static getDataFromURL(url, callback) {
    $.ajax({
      type: 'GET',
      url: `${url}`,
      dataType: 'json'
    })
      .done(response => {
        //%---Done() - If The Request Succses === No Error

        //%---This Function Get Array of All Crypto Coins list And Extract Specific Parametrs
        $.each(response, function(indexInArray, valueOfElement) {
          if (indexInArray <= 100) {
            UI.drawCryptoCoinsCards(
              indexInArray,
              valueOfElement.symbol,
              valueOfElement.name,
              valueOfElement.id
            );
            Coins.addToList(valueOfElement);
          }
        });

        callback();

        $('#srcBtn').click(function(e) {
          searchCryptoCoin()
            .then(a => {
              console.log(a);
            })
            .catch(err => console.log(err));
          e.preventDefault();
        });

        LiveReports.updateModalAndLiveArr();
      })
      //%---Fail() - If The Request Not Succses === Error
      .fail(err => {
        console.log(err.responseText);
      });
  }

  static async sendAPI_GETRequestByID(id, target) {
    let date1 = new Date();
    let timeOnFirstClick = date1.getTime();

    let response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);

    let obj = await response.json();

    const currImg = obj.image.large;
    const currPrice = obj.market_data.current_price;

    let currCryptoCoin = new CryptoCoinObj(
      currImg,
      currPrice,
      timeOnFirstClick
    );

    //%---Add to Array Of coins objects With Extra Info
    Coins.addExtraParam(currCryptoCoin);

    Storage.setToSessionStorage(currCryptoCoin, id);

    Storage.getCoinDetailsFromSessionStorage(id, target);

    moreInfo(target, id, currCryptoCoin.image, currCryptoCoin.price);
  }

  static async getHtmlTemplate(url) {
    let response = await fetch(url);
    let currHtml = await response.text();

    return currHtml;
  }
}

export function moreInfo(target, id, img, price) {
  if (target !== 'moreInfo') {
    UI.pushCollapseToDivByID(id, img, price);
  } else {
    UI.drwaSearchingExtraInfo(id, img, price);
  }
}

function searchCryptoCoin() {
  let promise = new Promise((resolve, reject) => {
    let userSearch = document.getElementById('searchCoin').value;

    let findAMatchingCurrency = Coins.findCoinBySearch(userSearch);

    if (findAMatchingCurrency !== undefined) {
      let specialBox = Ajax.getHtmlTemplate('../HtmlTemplate/specialBox.html');
      specialBox
        .then(template => {
          UI.drawBTNSearchCoinResult(
            template,
            findAMatchingCurrency.id,
            findAMatchingCurrency.symbol
          );
        })
        .catch(error => {
          console.log('Something Went Wrong!');
          console.error(error);
        });

      resolve("Ok! It's Worked!");
    } else {
      reject('Please search for the currency exactly according to its symbol');
    }
  });
  return promise;
}

//%---This Function Get Information About Specific Crypto Coin By 'Id' --- First Check In Session Storage And If The Specific 'Id' Does not exist There --- Send API 'GET' Request By the same 'Id'

export function getCoinInfoByID() {
  let coinsList = Coins.getList();
  $.each(coinsList, function(indexInArray, valueOfElement) {
    let id = valueOfElement.id;
    let sym = valueOfElement.symbol;

    $(`div#${id}`).each(function(index, element) {
      $(this).on('click', 'button', function(e) {
        //%---ShowLoaderAnimation
        UI.showLoaderAnimation(id);
        let target = e.target;
        // console.log(target);
        //%---Get Item From Session Storage By Crypto Coin 'Id' --- The 'Id' Use to be A Key In Storage
        Storage.getCoinDetailsFromSessionStorage(id, target);
      });
    });
  });
}

export class LiveReports {
  static liveRep = [];
  static newsym;

  static async getLiveInfo(symArr) {
    let response = await fetch(
      `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symArr}&tsyms=USD`
    );
    let obj = await response.json();
    console.log(obj);
  }

  static updateModalAndLiveArr() {
    let coinsList = Coins.getList();
    console.log(coinsList);
    $.each(coinsList, function(indexInArray, valueOfElement) {
      let id = valueOfElement.id;
      let sym = valueOfElement.symbol;

      sym = sym.toUpperCase();
      // LiveReports.liveRep = LiveReports.get();

      $(`div#${id}`).each(function(index, element) {
        $(this).on('click', 'input', function(e) {
          LiveReports.pushAndRemovedFromLiveReportsBefore6(sym);

          if (LiveReports.liveRep.length === 6) {
            console.log('5 Coin Add To Live Reports');
            console.log(this);
            $(this).attr({
              'data-toggle': 'modal',
              'data-target': '#myModal'
            });
            // console.log(LiveReports.liveRep)

            LiveReports.newsym = UI.addCoinToModalList(LiveReports.liveRep);

            $('#myModal').modal('show');

            $('.liveRepCheck').prop('disabled', true);

            console.log(LiveReports.liveRep);
            setTimeout(() => {
              $(`div#${id} > label > .liveRepCheck`).prop('checked', false);
            }, 100);
          }

          LiveReports.removeFromLiveReportsOnModal(
            id,
            sym,
            LiveReports.pushFromModal
          );

          LiveReports.getLiveInfo(LiveReports.liveRep);
        });
        // console.log(LiveReports.liveRep)
      });
    });
  }

  static pushAndRemovedFromLiveReportsBefore6(sym) {
    let num = LiveReports.liveRep.indexOf(sym);

    if (LiveReports.liveRep.includes(sym)) {
      LiveReports.liveRep.splice(num, 1);
      // console.log(num);
      console.log(LiveReports.liveRep);
    } else {
      LiveReports.liveRep.push(sym);
      console.log(LiveReports.liveRep);
    }
  }

  static removeFromLiveReportsOnModal(id, sym, callback) {
    $('.modal-footer > #confirm').on('click', function(e) {
      $(`li#${id} > p > label > input`).each(function(index, element) {
        if (this.checked === true) {
          let num = LiveReports.liveRep.indexOf(sym);
          LiveReports.liveRep.splice(num, 1);
          console.log(LiveReports.liveRep);

          $(`div#${id} > label > .liveRepCheck`).prop('checked', false);
        }
      });

      $('#myModal').modal('hide');
      $('.liveRepCheck').prop('disabled', false);

      callback();
    });
  }

  static pushFromModal() {
    if (
      LiveReports.liveRep.length < 5 &&
      !LiveReports.liveRep.includes(LiveReports.newsym)
    ) {
      LiveReports.liveRep.push(LiveReports.newsym);
      console.log(LiveReports.liveRep);

      let sym = LiveReports.newsym.toLowerCase();

      let coinObj = Coins.findCoinBySearch(sym);

      $(`div#${coinObj.id} > label > .liveRepCheck`).prop('checked', true);

      $(`div#${coinObj.id} > label > .liveRepCheck`).removeAttr('data-toggle');

      $(`div#${coinObj.id} > label > .liveRepCheck`).removeAttr('data-target');
    }
  }
  static get() {
    return LiveReports.liveRep;
  }

  static chart() {
    var ctx = document.getElementById('liveRepChart');
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });
  }
}
