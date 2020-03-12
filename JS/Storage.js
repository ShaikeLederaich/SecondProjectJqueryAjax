import { Ajax, moreInfo } from './services.js';

export class Storage {
  static setToSessionStorage(cryptoCoin, cryptoId) {
    sessionStorage.setItem(`${cryptoId}`, JSON.stringify(cryptoCoin));
  }

  static getCoinDetailsFromSessionStorage(cryptoId, target) {
    let currCoin = JSON.parse(sessionStorage.getItem(`${cryptoId}`));

    if (currCoin === null) {
      //%---If The 'Id' Does not exist In Storage, Send Ajax 'GET' Request By 'Id' And get The Parameters
      Ajax.sendAPI_GETRequestByID(cryptoId, target)
        .then(console.log('Its Null'))
        .catch(error => {
          console.log('Something Went Wrong!');
          console.error(error);
        });
    } else {
      //%---If the ID exists in Storage, So check when the first Ajax call was made.
      let date2 = new Date();
      let timeOnSecondClick = date2.getTime();
      let timeBetween = Math.abs(timeOnSecondClick - currCoin.time);
      //%---If more than two minutes have passed, Send Ajax 'GET' Request By 'Id'Again
      if (timeBetween > 120000) {
        Ajax.sendAPI_GETRequestByID(cryptoId, target)
          .then(console.log('Two minutes passed, load information again'))
          .catch(error => {
            console.log('Something Went Wrong!');
            console.error(error);
          });
      } else {
        console.log('Loading Information');
        moreInfo(target, cryptoId, currCoin.image, currCoin.price);
      }
    }
  }
}
