import { UI } from './ui.js';
import { CryptoCoinObj, Coins } from './coinClasses.js';
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

        Extract.extractParam1(response, getCoinInfoByID);
      })
      //%---Fail() - If The Request Not Succses === Error
      .fail(err => {
        console.log(err.responseText);
      });
  }

  static async sendAPI_GETRequestByID(id) {
    let date1 = new Date();
    let timeOnFirstClick = date1.getTime();

    let response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);

    let obj = await response.json();
    // console.log(obj);

    Extract.extractParam2(obj, id, timeOnFirstClick);
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
    //%---This Function Get Array of All Crypto Coins list And Extract Specific Parametrs
    $.each(array, function(indexInArray, valueOfElement) {
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
  }

  static extractParam2(obj, id, currTime) {
    const currImg = obj.image.large;
    const currPrice = obj.market_data.current_price;

    let currCryptoCoin = new CryptoCoinObj(currImg, currPrice, currTime);

    // console.log(currCryptoCoin);
    Coins.addExtraParam(currCryptoCoin);

    Storage.setToSessionStorage(currCryptoCoin, id);

    UI.pushCollapseToDivByID(id, currCryptoCoin.image, currCryptoCoin.price);
  }
}

function searchCryptoCoin() {
  let promise = new Promise((resolve, reject) => {
    let userSearch = document.getElementById('searchCoin').value;

    let arr = Coins.getList();
    console.log(arr);

    let findAMatchingCurrency = arr.find(coin => coin.symbol === userSearch);

    if (findAMatchingCurrency !== undefined) {
      let specialBox = Ajax.getHtmlTemplate('../HtmlTemplate/specialBox.html');
      specialBox.then(template => {
        UI.drawBTNSearchCoinResult(
          template,
          findAMatchingCurrency.id,
          findAMatchingCurrency.symbol
        );
      });

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
  let price = currCoinParam.market_data.current_price;
  let img = currCoinParam.image.small;

  UI.drwaSearchingExtraInfo(price.usd, price.eur, price.ils, img, id);
}
//%---This Function Get Information About Specific Crypto Coin By 'Id' --- First Check In Session Storage And If The Specific 'Id' Does not exist There --- Send API 'GET' Request By the same 'Id'

function getCoinInfoByID() {
  let coinsList = Coins.getList();
  $.each(coinsList, function(indexInArray, valueOfElement) {
    let id = valueOfElement.id;

    $(`div#${id}`).each(function(index, element) {
      $(this).on('click', 'button', async function(e) {
        //%---ShowLoaderAnimation
        UI.showLoaderAnimation(id);
        //%---Get Item From Session Storage By Crypto Coin 'Id' --- The 'Id' Use to be A Key In Storage

        let currCoin = await Storage.getCoinDetailsFromSessionStorage(
          id,
          UI.pushCollapseToDivByID
        );
      });
    });
  });
}

function getCoinInfoByID2() {
  let coinsList = Coins.getList();
  $.each(coinsList, function(indexInArray, valueOfElement) {
    let id = valueOfElement.id;

    $(`div#${id}`).each(function(index, element) {
      $(this).on('click', 'button', function(e) {
        //%---ShowLoaderAnimation
        UI.showLoaderAnimation(id);

        //%---Get Item From Session Storage By Crypto Coin 'Id' --- The 'Id' Use to be A Key In Storage
        Storage.getCoinDetailsFromSessionStorage(id, UI.pushCollapseToDivByID);
      });
    });

    $('#mySpecialSrcBox > #moreInfo').click(function(e) {
      
      //%---Get Item From Session Storage By Crypto Coin 'Id' --- The 'Id' Use to be A Key In Storage
      Storage.getCoinDetailsFromSessionStorage(id, UI.pushCollapseToDivByID);

      e.preventDefault();
    });
  });
}
