import { UI } from './ui.js';
import { CryptoCoinObj } from './coinObj.js';
import { Storage } from './Storage.js';

export class Ajax {
  //%---This Function Send API 'GET' Request And get All Crypto Coins list
  static getDataFromURL(url) {
    $.ajax({
      type: 'GET',
      url: `${url}`,
      dataType: 'json'
    })
      .done(response => {
        //%---Done() - If The Request Succses === No Error

        Extract.extractParam1(response, Ajax.getCryptoCoinInformationByID);
      })
      //%---Fail() - If The Request Not Succses === Error
      .fail(err => {
        console.log(err.responseText);
      });
  }

  //%---This Function Get Information About Specific Crypto Coin By 'Id' --- First Check In Session Storage And If The Specific 'Id' Does not exist There --- Send API 'GET' Request By the same 'Id'

  static getCryptoCoinInformationByID(id) {
    $(`div#${id}`).each(function(index, element) {
      $(this).on('click', 'button', function(e) {
        //%---ShowLoaderAnimation
        UI.showLoaderAnimation(id);

        //%---Get Item From Session Storage By Crypto Coin 'Id' --- The 'Id' Use to be A Key In Storage
        let currCoin = Storage.getCoinDetailsFromSessionStorage(id);
        if (currCoin === null) {
          //%---If The 'Id' Does not exist In Storage, Send Ajax 'GET' Request By 'Id' And get The Parameters
          Ajax.sendAPI_GETRequestByID(id);
        } else {
          //%---If the ID exists in Storage, So check when the first Ajax call was made.
          let date2 = new Date();
          let timeOnSecondClick = date2.getTime();
          let timeBetween = Math.abs(timeOnSecondClick - currCoin.time);
          //%---If more than two minutes have passed, Send Ajax 'GET' Request By 'Id'Again
          if (timeBetween > 120000) {
            Ajax.sendAPI_GETRequestByID(id);
          } else {
            UI.pushCollapseToDivByID(id, currCoin.image, currCoin.price);
          }
        }
      });
    });
  }

  static sendAPI_GETRequestByID(id) {
    let date1 = new Date();
    let timeOnFirstClick = date1.getTime();

    $.ajax({
      type: 'GET',
      url: `https://api.coingecko.com/api/v3/coins/${id}`,
      dataType: 'json'
    })
      .done(response => {
        Extract.extractParam2(response, id, timeOnFirstClick);
      })
      .fail(err => {
        console.log(err.responseText);
      });
  }

  static async getHtmlTemplate(url) {
    let response = await fetch(url);
    let currHtml = await response.text();

    return currHtml;
  }
}

//%---Extract parameters from an array and send them to UI
class Extract {
  static extractParam1(array, callback) {
    //%---This Function Send The Array of All Coins To the 'Search Button' And Return Promise With result

    $('#srcBtn').click(function(e) {
      searchCryptoCoin(array)
        .then(a => {
          console.log(a);
        })
        .catch(err => console.log(err));
      e.preventDefault();
    });

    //%---This Function Get Array of All Crypto Coins list And Extract Specific Parametrs

    $.each(array, function(indexInArray, valueOfElement) {
      if (indexInArray <= 100) {
        UI.drawCryptoCoinsCards(
          indexInArray,
          valueOfElement.symbol,
          valueOfElement.name,
          valueOfElement.id
        );
        callback(valueOfElement.id);
      }
    });
  }

  static extractParam2(array, id, currTime) {
    const currImg = array.image.large;
    const currPrice = array.market_data.current_price;

    let currCryptoCoin = new CryptoCoinObj(currImg, currPrice, currTime);

    console.log(currCryptoCoin);

    Storage.setToSessionStorage(currCryptoCoin, id);

    UI.pushCollapseToDivByID(id, currCryptoCoin.image, currCryptoCoin.price);
  }
}

function searchCryptoCoin(arr) {
  let promise = new Promise((resolve, reject) => {
    let userSearch = document.getElementById('searchCoin').value;

    let findAMatchingCurrency = arr.find(coin => coin.symbol === userSearch);

    if (findAMatchingCurrency !== undefined) {
      // console.log(findAMatchingCurrency.id);
      // console.log(findAMatchingCurrency.symbol);
      // console.log(typeof findAMatchingCurrency);

      let specialBox = Ajax.getHtmlTemplate('../HtmlTemplate/specialBox.html');
      specialBox.then((template) => {
        UI.drawBTNSearchCoinResult(template, findAMatchingCurrency.id, findAMatchingCurrency.symbol)
      })

      resolve("Ok! It's Worked!");
    } else {
      reject('Please search for the currency exactly according to its symbol');
    }
  });
  return promise;
}


export async function GetCoinParamBySrcSym(id) {
  let response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
  let currCoinParam = await response.json();

  console.log(currCoinParam);
  console.log(currCoinParam.image.small);
  console.log(currCoinParam.market_data.current_price.usd);
  console.log(currCoinParam.market_data.current_price.eur);
  console.log(currCoinParam.market_data.current_price.ils);
}
