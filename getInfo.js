
async function getInfo(page, restaurants) {

  length = restaurants.length - 1;
  const elementHandles = await page.$$('.restaurantName');

  var names = await getNames(page, length);
  var cuisines = await getCuisines(page, length);
  var types = await getTypes(page, length);
  var descriptions = await getDescriptions(page, length);

  for (let i = length; i < (length + elementHandles.length); i++) {

    var newRestaurant = [names[i - length], cuisines[i - length], types[i - length], descriptions[i - length]]
    restaurants.push(newRestaurant)
  

  }
  return restaurants;
}
exports.getInfo = getInfo;

async function getNames(page, length){
  const nameHandles = await page.$$('.restaurantName');
  let name;
  let names = [];
  for (let i = length; i < (length + nameHandles.length); i++) {
    name = await page.evaluate((el) => el.textContent, nameHandles[i - length]);
    names.push(name);
  }
  return names
}

async function getCuisines(page, length) {

  const cuisineHandles = await page.$$('div:nth-child(4) > span.area-text > span');
  let accountedFor = false
  var cuisine;
  var cuisines = []

  for (let i = length; i < (length + cuisineHandles.length); i++) {
    cuisine = await page.evaluate((el) => el.textContent, cuisineHandles[i - length]);
    if (cuisine.slice(-2) == ', ') {
      // restaurant has 2 cuisines listed
      var cuisine1 = await page.evaluate((el) => el.textContent, cuisineHandles[i - length])
      var cuisine2 = await page.evaluate((el) => el.textContent, cuisineHandles[i - length + 1])
      cuisines.push(cuisine1 + cuisine2)
     accountedFor = true; // cuisine was accounted for already, so won't affect other restaurants
    }else{
      if (!accountedFor){ // only adds as a new cuisine if it has not already been accounted for
        // restaurant only has one cuisine listed
        cuisines.push(await page.evaluate((el) => el.textContent, cuisineHandles[i - length]));
      }
     accountedFor = false;
    }
  }
  return cuisines
}

async function getTypes(page, length){

  const typeHandles = await page.$$('div:nth-child(2) > span.area-text > span');
  let type;
  let accountedFor = false;
  let types = [];

  for (let i = length; i < (length + typeHandles.length); i++) {
    type = await page.evaluate((el) => el.textContent, typeHandles[i - length]);
    if (type.slice(-2) == ', ') {
      // restaurant has multiple types listed
      var type1 = await page.evaluate((el) => el.textContent, typeHandles[i - length])
      var type2 = await page.evaluate((el) => el.textContent, typeHandles[i - length + 1])
      var type3;
      if (type2.slice(-2) == ', ') {
        // executes if there are 3 types instead of only 2
        type3 = await page.evaluate((el) => el.textContent, typeHandles[i - length + 2])
        types.push(type1 + type2 + type3)
      } else{
        types.push(type1 + type2)
      }
     accountedFor = true; // type was accounted for already, so won't affect other restaurants
    } else {
      // restaurant only has one type listed
      if ( !accountedFor){// only adds as a new type if it has not already been accounted for
        types.push(await page.evaluate((el) => el.textContent, typeHandles[i - length]));
      }
     accountedFor = false;
    }
  }
  return types
}

async function getDescriptions(page, length){
  const descHandles = await page.$$('.restaurant-description');
  let description;
  let descriptions = [];
  for (let i = length; i < (length + descHandles.length); i++) {
    description = await page.evaluate((el) => el.textContent, descHandles[i - length]);
    descriptions.push(description);
  }
  return descriptions
}