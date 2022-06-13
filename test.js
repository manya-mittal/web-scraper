
async function getInfo(page, restaurants) {

  length = restaurants.length - 1;
  const elementHandles = await page.$$('.restaurantName');
  const iterations = length + elementHandles.length

  var cuisines = await getCuisines(page, restaurants, length, iterations);
  var types = await getTypes(page, length);

  for (let i = length; i < (length + elementHandles.length); i++) {

    try {
      const name = await page.evaluate((el) => el.textContent, elementHandles[i - length]);
      restaurants.push([name]);

      // ------------------------------------ cuisines ---------------------------------------
      restaurants[i + 1].push(cuisines[i - length])
      // ------------------------------------ types --------------------------------------------
      restaurants[i + 1].push(types[i - length])
      // ----------------------------------- descriptions ---------------------------------------
      const descHandles = await page.$$('.restaurant-description');
      let description;
      if (descHandles[i - length] == null) {
        description = 'No Description specified';
      }
      description = await page.evaluate((el) => el.textContent, descHandles[i - length]);
      restaurants[i + 1].push(description);

    } catch (error) {
      console.log('iteration: ' + (i + 1));
      console.log('                                  ');
      console.log(error);
    }

  }
  return restaurants;
}
exports.getInfo = getInfo;


async function getCuisines(page, restaurants, length, iterations) {

  const cuisineHandles = await page.$$('div:nth-child(4) > span.area-text > span');
  let done = false
  var cuisine;
  var cuisines = []

  for (let i = length; i < (length + cuisineHandles.length); i++) {
    cuisine = await page.evaluate((el) => el.textContent, cuisineHandles[i - length]);
    if (cuisine.slice(-2) == ', ') {
      var cuisine1 = await page.evaluate((el) => el.textContent, cuisineHandles[i - length])
      var cuisine2 = await page.evaluate((el) => el.textContent, cuisineHandles[i - length + 1])
      cuisines.push(cuisine1 + cuisine2)
      done = true;
    }else{
      if (!done){
        cuisines.push(await page.evaluate((el) => el.textContent, cuisineHandles[i - length]));
      }
      done = false;
    }
  }
  return cuisines
}
exports.getCuisines = getCuisines;

async function getTypes(page, length){

  const typeHandles = await page.$$('div:nth-child(2) > span.area-text > span');
  let type;
  let done = false;
  let types = [];

  for (let i = length; i < (length + typeHandles.length); i++) {
    type = await page.evaluate((el) => el.textContent, typeHandles[i - length]);
    if (type.slice(-2) == ', ') {
      var type1 = await page.evaluate((el) => el.textContent, typeHandles[i - length])
      var type2 = await page.evaluate((el) => el.textContent, typeHandles[i - length + 1])
      var type3;
      if (type2.slice(-2) == ', ') {
        type3 = await page.evaluate((el) => el.textContent, typeHandles[i - length + 2])
        types.push(type1 + type2 + type3)
      } else{
        types.push(type1 + type2)
      }
      done = true;
    } else {
      if (!done){
        types.push(await page.evaluate((el) => el.textContent, typeHandles[i - length]));
      }
      done = false;
    }
  }
  return types
}