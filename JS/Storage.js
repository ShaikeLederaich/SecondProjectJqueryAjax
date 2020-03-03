import { Ajax } from './services.js';

export class Storage {
  static setToSessionStorage(cryptoCoin, cryptoId) {
    sessionStorage.setItem(`${cryptoId}`, JSON.stringify(cryptoCoin));
  }

  static getCoinDetailsFromSessionStorage(cryptoId, callBack) {
    let currCoin = JSON.parse(sessionStorage.getItem(`${cryptoId}`));

    if (currCoin === null) {
      //%---If The 'Id' Does not exist In Storage, Send Ajax 'GET' Request By 'Id' And get The Parameters
      Ajax.sendAPI_GETRequestByID(cryptoId);
      console.log(currCoin)
    } else {
      //%---If the ID exists in Storage, So check when the first Ajax call was made.
      let date2 = new Date();
      let timeOnSecondClick = date2.getTime();
      let timeBetween = Math.abs(timeOnSecondClick - currCoin.time);
      //%---If more than two minutes have passed, Send Ajax 'GET' Request By 'Id'Again
      if (timeBetween > 120000) {
        Ajax.sendAPI_GETRequestByID(cryptoId);
        console.log(currCoin)
      } else {
        console.log(currCoin)
        callBack(cryptoId, currCoin.image, currCoin.price)
      }
    }
  }
}
