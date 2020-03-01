export class CryptoCoinObj {
  constructor(img, currPrice, currTime) {
    this.image = img;
    this.price = {
      Usd: `${currPrice.usd}` ,
      Eur: `${currPrice.eur}`,
      Ils: `${currPrice.ils}`
    };
    this.time = currTime;
  }
  showCoinInfo() {
    console.log(`
    Current Price in US Dollar: ${this.usd}\n
    Current Price in Euru: ${this.eur}\n
    Current Price in IL Shekel: ${this.ils}\n
    `);
  }
}
