const Jimp = require('jimp-compact');

new Jimp(16, 16, 0x00000000, (err, image) => {
  if (err) throw err;
  const green = 0x2C3E2DFF;
  const skin = 0xE6C2A5FF;
  const black = 0x000000FF;

  // Helmet
  for(let x=4; x<=11; x++) image.setPixelColor(green, x, 3);
  for(let x=3; x<=12; x++) image.setPixelColor(green, x, 4);
  for(let x=2; x<=13; x++) image.setPixelColor(green, x, 5);
  for(let x=2; x<=13; x++) image.setPixelColor(green, x, 6);
  // Visor / Brim
  for(let x=1; x<=14; x++) image.setPixelColor(green, x, 7);
  
  // Face
  for(let x=4; x<=11; x++) image.setPixelColor(skin, x, 8);
  for(let x=4; x<=11; x++) image.setPixelColor(skin, x, 9);
  for(let x=4; x<=11; x++) image.setPixelColor(skin, x, 10);
  for(let x=4; x<=11; x++) image.setPixelColor(skin, x, 11);
  
  // Eyes
  image.setPixelColor(black, 6, 9);
  image.setPixelColor(black, 9, 9);

  // Body/Uniform
  for(let x=3; x<=12; x++) image.setPixelColor(green, x, 12);
  for(let x=2; x<=13; x++) image.setPixelColor(green, x, 13);
  for(let x=1; x<=14; x++) image.setPixelColor(green, x, 14);
  for(let x=1; x<=14; x++) image.setPixelColor(green, x, 15);

  image.write('./assets/favicon.png', () => {
    console.log("Soldier favicon successfully generated!");
  });
});
