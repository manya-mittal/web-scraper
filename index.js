const puppeteer = require('puppeteer');
const { getInfo } = require("./getInfo");
const xlsx = require('xlsx');



async function scrape() {
  const browser = await puppeteer.launch({headless: false})
  const page = await browser.newPage()
  url = 'https://www.flashdiner.com/single-collection/5d9c5b45a7b1cc001cbff93f;collection=PIK%20';
  excelName = 'pik.xlsx'
  await page.goto(url, {waitUntil: "load"});


  var heading = await page.$eval('div.fd-page-heading-left', (el) => el.textContent)
  var numPages = Math.round(Number(heading.slice(1,4)) / 5) + 1 // since each page has 5 restaurants 

  
  let restaurants = [['Name', 'Cuisine', 'Type', 'Description']]; // each sub-array represents a row in excel

  for (let i = 0; i <= numPages; i++) {
    restaurants = await getInfo(page, restaurants)
    await page.waitForSelector('li.pagination-next')
    await page.click('li.pagination-next.page-item.ng-star-inserted') // move to next page
    console.log();
  }
  console.log(restaurants);
   

  var workbook = xlsx.utils.book_new(); // code to save data to an excel sheet
  var worksheet = xlsx.utils.aoa_to_sheet(restaurants)
  xlsx.utils.book_append_sheet(workbook, worksheet)
  xlsx.writeFile(workbook, excelName)

  await browser.close();

}
scrape()



