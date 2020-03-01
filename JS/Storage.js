export class Storage {
  static setToSessionStorage(cryptoCoin, cryptoId) {
    sessionStorage.setItem(`${cryptoId}`, JSON.stringify(cryptoCoin));
  }

  static getCoinDetailsFromSessionStorage(cryptoId) {
    let currCoin = JSON.parse(sessionStorage.getItem(`${cryptoId}`));
    // console.log(currCoin);
    return currCoin;
  }
  
}
