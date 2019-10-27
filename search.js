const rp = require('request-promise')
const cheerio = require('cheerio')
const puppeteer = require('puppeteer');
const { makeChunk } = require('./server/services/helper');

// ----------------------- daraz start ------------------------
const getDarazProductsInfo = (searchTerm, category, searchTerms) => {

  return getDarazProducts(searchTerm, category)
    .then(async (products) => {
      const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });  

      // Create chunk for avoiding opening many tabs at once;
      let runningChunkIndex = 0;
      console.log("-----------------------products")
      console.log(products)
      const productChunks = makeChunk(products, 6);
      console.log("------------------------chunks")
      console.log(productChunks)
      let processedProducts = [];

      return new Promise((resolve, reject) => {
        if (!productChunks.length) {
          return resolve([])
        }
        processChunks(resolve);
      });
      function processChunks(resolve) {
        let productinfoArrPromise = [];

        console.log("------------------------checkkkk")
        console.log(productChunks)
        productChunks[runningChunkIndex].forEach((product) => {
          productinfoArrPromise.push(getDarazProductDetails(browser, searchTerm, product, searchTerms))
        });

        Promise.all(productinfoArrPromise)
          .then((productsDetailHtml) => {
            productsDetailHtml.forEach((productDetailInfo) => {
              processedProducts.push(processDarazProductDetail(productDetailInfo.darazHtml, productDetailInfo.uri, searchTerm, searchTerms));
            });

            // After getting old result, process new data
            if (runningChunkIndex < productChunks.length - 1) {
              runningChunkIndex++;
              processChunks(resolve);
            }
            else {
              //if the product is null is not pass
              processedProducts = processedProducts.filter(product => product != null)
              resolve(processedProducts);
            }
          })
          .catch((e) => {
            console.error('Error: ', e)
            browser.close();
          })
      }
    })
}

//get the links of products
const getDarazProducts = async (searchTerm, category) => {
  var uri;
  if (searchTerm && category) {
    uri = `https://www.daraz.pk/${category}/?q=${searchTerm}`
  }
  else if (searchTerm) {
    uri = `https://www.daraz.pk/catalog/?q=${searchTerm}`
  }
  else {
    uri = `https://www.daraz.pk/${category}`
  }
  console.log("about to open browser")
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  console.log("-----about to open page")
  const page = await browser.newPage();
  await page.goto(uri);

  console.log("-------------goto page done")
  const bodyHandle = await page.$('.c3Pa4S');
  const darazHtml = await page.evaluate(body => body.innerHTML, bodyHandle);
  browser.close();
  const $ = cheerio.load(darazHtml);

  if ($('.c2p6A5').toArray().length !== 0) {
    const products = []
    $('.c2p6A5').each((i, elem) => {
      products[i] = $(elem).find('.c2Rbb9 > a').attr('href').replace('//','https://')
    })
    return products
  }
  return []
}

//only get the html
const getDarazProductDetails = async (browser, searchTerm, uri, searchTerms) => {
  console.log('uri', uri);

  console.log("about to open browser")

  return browser.newPage()
    .then(async (page) => {
      await page.goto(uri, {
        timeout: 300000
      });
      const bodyHandle = await page.$('body');
      const darazHtml = await page.evaluate(body => body.innerHTML, bodyHandle);
      page.close();
      return { uri, darazHtml }
    })
}
function parseDarazproduct(productRawBody, uri, searchTerm, searchTerms){
  const $ = cheerio.load(productRawBody);
  const name = $('.pdp-product-title').text().trim()
  const brand = $('.pdp-product-brand__brand-link').text().trim()
  const description = $('.detail-content').text().trim()
  const image = $('.gallery-preview-panel__image').attr('src')
  let price = $('.pdp-product-price > .pdp-price_type_normal').text().trim()
  price = price.replace(/\D/g, '')
  const categories = []
  $('.breadcrumb li').each((i, elem) => {
    categories[i] = $(elem).children().text()
  })
  let category = categories.join(' > ').trim()
  category = category.replace(/[|]/g, '');
  let match = getScore(searchTerm, {
    name: name.toLowerCase(),
    brand: brand.toLowerCase(),
    description: description.toLowerCase(),
    price: price,
  }, searchTerms);
  let matchPercentage = match.percentage
  let matchDetails = match.matchDetails
  const product = {
    name,
    brand,
    description,
    price,
    category,
    image,
    site: 'daraz.pk',
    uri,
    matchPercentage,
    matchDetails
  }
  return product
}
//get the details of product e.g brand, name, price
function processDarazProductDetail(productRawBody, uri, searchTerm, searchTerms) {
  product = parseDarazproduct(productRawBody, uri, searchTerm, searchTerms)
  if (!searchTerms.brand && !searchTerms.price) {
    console.log('--------------product without filter-------------');
    console.log(product);
    console.log('--------------product without filter    END----------');
    return product
  } else {
    return filterProducts(
      product,
      searchTerms
    )
  }
}

// ----------------------- daraz end ------------------------

// -------------------------------yayvo start -------------------------
const getYayvoProductsInfo = (searchTerm, category, searchTerms) => {

  return getYayvoProducts(searchTerm, category)
    .then(async (products) => {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      // Create chunk for avoiding opening many tabs at once;
      let runningChunkIndex = 0;
      console.log("-----------------------products")
      console.log(products)
      const productChunks = makeChunk(products, 6);
      console.log("------------------------chunks")
      console.log(productChunks)
      let processedProducts = [];

      return new Promise((resolve, reject) => {
        if (!productChunks.length) {
          return resolve([])
        }
        processChunks(resolve);
      });
      function processChunks(resolve) {
        let productinfoArrPromise = [];

        console.log("------------------------checkkkk")
        console.log(productChunks)
        productChunks[runningChunkIndex].forEach((product) => {
          productinfoArrPromise.push(getYayvoProductDetails(browser, searchTerm, product, searchTerms))
        });

        Promise.all(productinfoArrPromise)
          .then((productsDetailHtml) => {
            productsDetailHtml.forEach((productDetailInfo) => {
              processedProducts.push(processYayvoProductDetail(productDetailInfo.yayvoHtml, productDetailInfo.uri, searchTerm, searchTerms));
            });

            // After getting old result, process new data
            if (runningChunkIndex < productChunks.length - 1) {
              runningChunkIndex++;
              processChunks(resolve);
            }
            else {
              //if the product is null is not pass
              processedProducts = processedProducts.filter(product => product != null)
              resolve(processedProducts);
            }
          })
          .catch((e) => {
            console.error('Error: ', e)
            browser.close();
          })
      }
    })
}

//get the links of products
const getYayvoProducts = async (searchTerm, category) => {
  const uri = searchTerm ? `https://yayvo.com/search/result/?q=${searchTerm}` : `https://yayvo.com/${category}.html`
  console.log("about to open browser")
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  console.log("-----about to open page")
  const page = await browser.newPage();
  await page.goto(uri);

  console.log("-------------goto page done")
  const bodyHandle = await page.$('.category-products');
  const yayvoHtml = await page.evaluate(body => body.innerHTML, bodyHandle);
  browser.close();
  const $ = cheerio.load(yayvoHtml);
  const products = [];
  if ($('.products-grid').toArray().length !== 0) {
    $('.products-grid li.item').each((i, elem) => {
      products[i] = $(elem).find('a.product-image').attr('href')
    })
    return products;
  }
  return []
}

//only get the html
const getYayvoProductDetails = async (browser, searchTerm, uri, searchTerms) => {
  console.log('uri', uri);
  console.log("about to open browser")

  return browser.newPage()
    .then(async (page) => {
      await page.goto(uri, {
        timeout: 300000
      });
      const bodyHandle = await page.$('.main');
      const yayvoHtml = await page.evaluate(body => body.innerHTML, bodyHandle);
      page.close();
      return { uri, yayvoHtml }
    })
}
function parseYayvoproduct(productRawBody, uri, searchTerm, searchTerms){
  const $ = cheerio.load(productRawBody);
  const name = $('.product-shop .product-name h1').text().trim()
  const brand = $('.product-shop .brand-des-sec .brand-area .box').first().find('span').text().trim()
  const description = $('.brand-des-sec .short-description .std').text().trim()
  const image = $('.product-image a').first().attr('href')
  let price = $('.productDetailPrice .price-box .special-price .price').text().trim() ||
    $('.productDetailPrice .price-box .regular-price .price').text().trim()
  price = price.replace(/\D/g, '')
  const categories = []
  $('.breadcrumbs ul li').each((i, elem) => {
    categories[i] = $(elem).children().text()
  })
  let category = categories.join(' > ').trim()
  category = category.replace(/[|]/g, '');
  let match = getScore(searchTerm, {
    name: name.toLowerCase(),
    brand: brand.toLowerCase(),
    description: description.toLowerCase(),
    price: price,
  }, searchTerms);
  let matchPercentage = match.percentage
  let matchDetails = match.matchDetails
  const product = {
    name,
    brand,
    description,
    price,
    category,
    image,
    site: 'yayvo.pk',
    uri,
    matchPercentage,
    matchDetails
  }
  return product
}
//get the details of product e.g brand, name, price
function processYayvoProductDetail(productRawBody, uri, searchTerm, searchTerms) {
  product = parseYayvoproduct(productRawBody, uri, searchTerm, searchTerms)
  if (!searchTerms.brand && !searchTerms.price) {
    console.log('--------------product without filter-------------');
    console.log(product);
    console.log('--------------product without filter    END----------');
    return product
  } else {
    return filterProducts(
      product,
      searchTerms
    )
  }
}
// ----------------------------yayvo end ---------------------------


// ----------------------hummart start ---------------------
const getHummartProductsInfo = (searchTerm, category, searchTerms) => {

  return getHummartProducts(searchTerm, category)
    .then(async (products) => {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      // Create chunk for avoiding opening many tabs at once;
      let runningChunkIndex = 0;
      console.log("-----------------------products")
      console.log(products)
      const productChunks = makeChunk(products, 1);
      console.log("------------------------chunks")
      console.log(productChunks)
      let processedProducts = [];

      return new Promise((resolve, reject) => {
        if (!productChunks.length) {
          return resolve([])
        }
        processChunks(resolve);
      });
      function processChunks(resolve) {
        let productinfoArrPromise = [];

        console.log("------------------------checkkkk")
        console.log(productChunks)
        productChunks[runningChunkIndex].forEach((product) => {
          productinfoArrPromise.push(getHummartProductDetails(browser, searchTerm, product, searchTerms))
        });

        Promise.all(productinfoArrPromise)
          .then((productsDetailHtml) => {
            productsDetailHtml.forEach((productDetailInfo) => {
              processedProducts.push(processHummartProductDetail(productDetailInfo.hummartHtml, productDetailInfo.uri, searchTerm, searchTerms));
            });

            // After getting old result, process new data
            if (runningChunkIndex < productChunks.length - 1) {
              runningChunkIndex++;
              processChunks(resolve);
            }
            else {
              //browser.close();
              console.log("----------------+++++000---------------------------")
              console.log(processedProducts)
              console.log("----------------+++++000---------------------------")
              //if the product is null is not pass
              processedProducts = processedProducts.filter(product => product != null)
              resolve(processedProducts);
            }
          })
          .catch((e) => {
            console.error('Error: ', e)
            browser.close();
          })
      }
    })
}

//get the links of products
const getHummartProducts = async (searchTerm, category) => {
  const uri = searchTerm ? `https://hummart.com/catalogsearch/result/?q=${searchTerm}` :
    `https://hummart.com/${category}`
  console.log("about to open browser")
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  console.log("-----about to open page")
  const page = await browser.newPage();
  await page.goto(uri);
  console.log("-------------goto page done")
  const bodyHandle = await page.$('#layer-product-list');
  const hummartHtml = await page.evaluate(body => body.innerHTML, bodyHandle);
  browser.close();
  const $ = cheerio.load(hummartHtml);
  const products = [];
  if ($('.products-grid li.product-item').toArray().length !== 0) {
    $('.products-grid li.item').each((i, elem) => {
      products[i] = $(elem).find('.product-item-info a').first().attr('href')
    })
    return products;
  }
  return []
}

//only get the html of the product page
const getHummartProductDetails = async (browser, searchTerm, uri, searchTerms) => {
  console.log('uri', uri);
  console.log("about to open browser")

  return browser.newPage()
    .then(async (page) => {
      await page.goto(uri);
      const bodyHandle = await page.$('.page-wrapper');
      const hummartHtml = await page.evaluate(body => body.innerHTML, bodyHandle);
      page.close();
      // setTimeout(() => { page.close();}, 2000);
      return { uri, hummartHtml }
    })
}
function parseHummartproduct(productRawBody, uri, searchTerm, searchTerms) {
  const $ = cheerio.load(productRawBody);
  const name = $('.product-info-main .product .page-title span').text().trim()
  const brand = name.split(" ")[0]
  const description = $('.product.info.detailed .product.attribute.description .value').text().trim()
  const image = $($("[data-gallery-role='gallery'] .fotorama__img")[0]).attr("src")
  const categories = []
  $('.breadcrumbs > ul li').each((i, elem) => {
    categories[i] = $(elem).children().text() || $(elem).text()
  })
  const category = categories.join(' > ').trim()
  let price = $('.product-info-main .price-box span[data-price-type="finalPrice"] span').text().trim()
  price = price.replace(/\D/g, '')
  let match = getScore(searchTerm, {
    name: name.toLowerCase(),
    brand: brand.toLowerCase(),
    description: description.toLowerCase(),
    price: price.toLowerCase(),
  }, searchTerms);
  let matchPercentage = match.percentage
  let matchDetails = match.matchDetails
  const products = {
    name,
    brand,
    description,
    price,
    category,
    image,
    site: 'hummart.pk',
    uri,
    matchPercentage,
    matchDetails
  }
  return products
}
//get the details of product e.g brand, name, price
function processHummartProductDetail(productRawBody, uri, searchTerm, searchTerms) {
  products = parseHummartproduct(productRawBody, uri, searchTerm, searchTerms)
  if (!searchTerms.brand && !searchTerms.price) {
    console.log('--------------product without filter-------------');
    console.log(products);
    console.log('--------------product without filter    END----------');
    return products

  } else {
    return filterProducts(
      products,
      searchTerms
    )
  }
}
//---------------------------- hummart end ------------------------------- 


// ----------------------tazamart start ---------------------
const getTazaMartProductsInfo = (searchTerm, category, searchTerms) => {

  return getTazaMartProducts(searchTerm, category)
    .then(async (products) => {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      // Create chunk for avoiding opening many tabs at once;
      let runningChunkIndex = 0;
      console.log("-----------------------products")
      console.log(products)
      const productChunks = makeChunk(products, 6);
      console.log("------------------------chunks")
      console.log(productChunks)
      let processedProducts = [];

      return new Promise((resolve, reject) => {
        if (!productChunks.length) {
          return resolve([])
        }
        processChunks(resolve);
      });
      function processChunks(resolve) {
        let productinfoArrPromise = [];

        console.log("------------------------checkkkk")
        console.log(productChunks)
        productChunks[runningChunkIndex].forEach((product) => {
          productinfoArrPromise.push(getTazaMartProductDetails(browser, searchTerm, product, searchTerms))
        });

        Promise.all(productinfoArrPromise)
          .then((productsDetailHtml) => {
            productsDetailHtml.forEach((productDetailInfo) => {
              processedProducts.push(processTazaMartProductDetail(productDetailInfo.tazaMartHtml, productDetailInfo.uri, searchTerm, searchTerms));
            });

            // After getting old result, process new data
            if (runningChunkIndex < productChunks.length - 1) {
              runningChunkIndex++;
              processChunks(resolve);
            }
            else {
              //browser.close();
              console.log("----------------+++++000---------------------------")
              console.log(processedProducts)
              console.log("----------------+++++000---------------------------")
              //if the product is null is not pass
              processedProducts = processedProducts.filter(product => product != null)
              resolve(processedProducts);
            }
          })
          .catch((e) => {
            console.error('Error: ', e)
            browser.close();
          })
      }
    })
}

//get the links of products
const getTazaMartProducts = async (searchTerm, category) => {
  const uri = `https://www.tazamart.pk/${category}/?s=${searchTerm}&post_type=product`;
  console.log("about to open browser")
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  console.log("-----about to open page")
  const page = await browser.newPage();
  await page.goto(uri, { timeout: 90000 });
  console.log("-------------goto page done")
  const bodyHandle = await page.$('.woocommerce');
  const tazaMartHtml = await page.evaluate(body => body.innerHTML, bodyHandle);
  browser.close();
  const $ = cheerio.load(tazaMartHtml);
  const products = [];
  if ($(".col-xs-6.col-sm-3 a").toArray().length !== 0) {
    $('.col-xs-6.col-sm-3').each((i, elem) => {
      products[i] = $(elem).find('a').first().attr('href')
    })
    return products;
  }
  return []
}

//only get the html
const getTazaMartProductDetails = async (browser, searchTerm, uri, searchTerms) => {
  console.log('uri', uri);
  console.log("about to open browser")

  return browser.newPage()
    .then(async (page) => {
      await page.goto(uri, {
        timeout: 900000
      });
      const bodyHandle = await page.$('body');
      const tazaMartHtml = await page.evaluate(body => body.innerHTML, bodyHandle);
      page.close();
      return { uri, tazaMartHtml }
    })
}
//parsing for tazamart productinfo
function parseTazaMartproduct(productRawBody, uri, searchTerm, searchTerms) {
  const $ = cheerio.load(productRawBody);
  const name = $(".product-title").text().trim()
  const brand = $($(".col-xs-12.col-sm-8 .wb-posted_in a")[0]).text() // only pick and support first brand in the list 
  const description = $("#tab-description p").text()
  const image = $('.woocommerce .product-preview .images a').attr('href')
  const categories = []
  $('.breadcrumbs .breadcrumb li').each((i, elem) => {
    categories[i] = $(elem).find('a').text() || $(elem).text()
  })
  const category = categories.join(' > ').trim()
  let price = $('.woocommerce .woocommerce-price ins .woocommerce-Price-amount').text().trim() ||
    $('.woocommerce .woocommerce-price .woocommerce-Price-amount').text().trim()
  price = price.replace(/\D/g, '')
  let match = getScore(searchTerm, {
    name: name.toLowerCase(),
    brand: brand.toLowerCase(),
    description: description.toLowerCase(),
    price: price.toLowerCase(),
  }, searchTerms);
  let matchPercentage = match.percentage
  let matchDetails = match.matchDetails
  const products = {
    name,
    brand,
    description,
    price,
    category,
    image,
    site: 'tazamart.pk',
    uri,
    matchPercentage,
    matchDetails,
    searchTerm,
    searchTerms
  }
  return products
}


//get the details of product e.g brand, name, price
function processTazaMartProductDetail(productRawBody, uri, searchTerm, searchTerms) {
  let products  = parseTazaMartproduct(productRawBody, uri, searchTerm, searchTerms)
  if (!searchTerms.brand && !searchTerms.price) {
    return products
  } else {
    return filterProducts(
      products,
      searchTerms
    )
  }
}
// ----------------------tazamart end---------------------


//////////////////////////// qne start/////////////////////////////////
const getQneProductsInfo = (searchTerm, category, searchTerms) => {

  return getQneProducts(searchTerm, category)
    .then(async (products) => {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      // Create chunk for avoiding opening many tabs at once;
      let runningChunkIndex = 0;
      console.log("-----------------------products")
      console.log(products)
      const productChunks = makeChunk(products, 6);
      console.log("------------------------chunks")
      console.log(productChunks)
      let processedProducts = [];

      return new Promise((resolve, reject) => {
        if (!productChunks.length) {
          return resolve([])
        }
        processChunks(resolve);
      });
      function processChunks(resolve) {
        let productinfoArrPromise = [];

        console.log("------------------------checkkkk")
        console.log(productChunks)
        productChunks[runningChunkIndex].forEach((product) => {
          productinfoArrPromise.push(getQneProductDetails(browser, searchTerm, product, searchTerms))
        });

        Promise.all(productinfoArrPromise)
          .then((productsDetailHtml) => {
            productsDetailHtml.forEach((productDetailInfo) => {
              processedProducts.push(processQneProductDetail(productDetailInfo.qneHtml, productDetailInfo.uri, searchTerm, searchTerms));
            });

            // After getting old result, process new data
            if (runningChunkIndex < productChunks.length - 1) {
              runningChunkIndex++;
              processChunks(resolve);
            }
            else {
              //browser.close();
              console.log("----------------+++++000---------------------------")
              console.log(processedProducts)
              console.log("----------------+++++000---------------------------")

              //if the product is null is not pass
              processedProducts = processedProducts.filter(product => product != null)
              resolve(processedProducts);
            }
          })
          .catch((e) => {
            console.error('Error: ', e)
            browser.close();
          })
      }
    })
}

//get the links of products
const getQneProducts = async (searchTerm, category) => {
  const uri = searchTerm ? `https://qne.com.pk/search.php?q=${searchTerm}` : `https://qne.com.pk/${category}`
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  console.log("-----about to open page")
  const page = await browser.newPage();
  await page.goto(uri, { timeout: 90000 });
  console.log("-------------goto page done")
  const bodyHandle = await page.$('.productShelf');
  const qneHtml = await page.evaluate(body => body.innerHTML, bodyHandle);
  browser.close();
  const $ = cheerio.load(qneHtml);
  const products = [];
  if ($('.productList > .productPreview').toArray().length !== 0) {
    $('.productList > .productPreview').each((i, elem) => {
      products[i] = $(elem).find('.productInformation > .productVisuals > a').attr('href')
    })
    return products
  }
  return []
}

//only get the html of the product
const getQneProductDetails = async (browser, searchTerm, uri, searchTerms) => {
  console.log('uri', `https://qne.com.pk/${uri}`);
  console.log("about to open browser")

  return browser.newPage()
    .then(async (page) => {
      await page.goto(`https://qne.com.pk/${uri}`, {
        timeout: 900000
      });
      const bodyHandle = await page.$('.col-md-9.col-sm-8.col-xs-12');
      const qneHtml = await page.evaluate(body => (body && body.innerHTML), bodyHandle);
      page.close();
      return { uri, qneHtml }
    })
}
function parseQneproduct(productRawBody, uri, searchTerm, searchTerms){
  const $ = cheerio.load(productRawBody);
  const name = $('.detail-info > .title30').text().trim()
  const brand = $('.info-extra > a').first().text().trim()
  const details = []
  $('.content-tags-detail').children().each((i, elem) => {
    details[i] = $(elem).text().trim()
  })
  const description = details.join('\n').trim()
  const image = 'https://qne.com.pk' + $('.detail-gallery > .mid > img').attr('src').substr(2)
  const category = $('.info-extra > a').last().text().trim()
  const price = parseFloat($(".product-price .productDiscountedPrice span").text().replace('Rs.', ''))
  let match = getScore(searchTerm, {
    name: name.toLowerCase(),
    brand: brand.toLowerCase(),
    description: description.toLowerCase(),
    price: price,
  }, searchTerms);
  let matchPercentage = match.percentage
  let matchDetails = match.matchDetails

  const products = {
    name,
    brand,
    description,
    price,
    category,
    image,
    site: 'Qne.pk',
    uri,
    matchPercentage,
    matchDetails,
    searchTerm,
    searchTerms
  }
  return products
}
//get the details of product e.g brand, name, price
function processQneProductDetail(productRawBody, uri, searchTerm, searchTerms) {
  if (!productRawBody) return null
  products = parseQneproduct(productRawBody, uri, searchTerm, searchTerms)
  if (!searchTerms.brand && !searchTerms.price) {
    console.log('--------------product without filter-------------');
    console.log(products);
    console.log('--------------product without filter    END----------');
    return products
  } else {
    return filterProducts(
      products,
      searchTerms
    )
  }

}

///////////////////////////// qne end///////////////////////////////

// ----------------------mycart start ---------------------

const getMyCartProductsInfo = (searchTerm, category, searchTerms) => {

  return getMyCartProducts(searchTerm, category)
    .then(async (products) => {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      // Create chunk for avoiding opening many tabs at once;
      let runningChunkIndex = 0;
      console.log("-----------------------products")
      console.log(products)
      const productChunks = makeChunk(products, 6);
      console.log("------------------------chunks")
      console.log(productChunks)
      let processedProducts = [];

      return new Promise((resolve, reject) => {
        if (!productChunks.length) {
          return resolve([])
        }
        processChunks(resolve);
      });
      function processChunks(resolve) {
        let productinfoArrPromise = [];

        console.log("------------------------checkkkk")
        console.log(productChunks)
        productChunks[runningChunkIndex].forEach((product) => {
          productinfoArrPromise.push(getMyCartProductDetails(browser, searchTerm, product, searchTerms))
        });

        Promise.all(productinfoArrPromise)
          .then((productsDetailHtml) => {
            productsDetailHtml && productsDetailHtml.forEach((productDetailInfo) => {
              processedProducts.push(processMyCartProductDetail(productDetailInfo.myCartHtml, productDetailInfo.uri, searchTerm, searchTerms));
            });

            // After getting old result, process new data
            if (runningChunkIndex < productChunks.length - 1) {
              runningChunkIndex++;
              processChunks(resolve);
            }
            else {
              //browser.close();
              console.log("----------------+++++000---------------------------")
              console.log(processedProducts)
              console.log("----------------+++++000---------------------------")
              //if the product is null is not pass
              processedProducts = processedProducts.filter(product => product != null)
              resolve(processedProducts);
            }
          })
          .catch((e) => {
            console.error('Error: ', e)
            browser.close();
          })
      }
    })
}

//get the links of products
const getMyCartProducts = async (searchTerm, category) => {
  const uri = `https://www.mycart.pk/catalogsearch/result/?q=${searchTerm}&cat=${category}`
  console.log("about to open browser")
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  console.log("-----about to open page")
  const page = await browser.newPage();
  await page.goto(uri, { timeout: 90000 });
  console.log("-------------goto page done")
  const bodyHandle = await page.$('.products-grid');
  const myCartHtml = await page.evaluate(body => body.innerHTML, bodyHandle);
  browser.close();
  const $ = cheerio.load(myCartHtml);
  if ($('li.item').toArray().length !== 0) {
    console.log("--------------------------test 2")
    const products = []
    $('li.item').each((i, elem) => {
      products[i] = $(elem).find('a.product-image').attr('href')
    })
    console.log("------------------test 3")
    console.log(products)
    console.log("------------------test 4")

    return products
  }
  return []
}

//only get the html of the product
const getMyCartProductDetails = async (browser, searchTerm, uri, searchTerms) => {
  console.log('uri', uri);
  console.log("about to open browser")

  return browser.newPage()
    .then(async (page) => {
      await page.goto(uri, {
        timeout: 900000
      });
      const bodyHandle = await page.$('body');
      const myCartHtml = await page.evaluate(body => body.innerHTML, bodyHandle);
      page.close();
      return { uri, myCartHtml }
    })
}
//
function parseMyCartproduct(productRawBody, uri, searchTerm, searchTerms){
  const $ = cheerio.load(productRawBody);
  const titleArr = $('.product-name > h1[itemprop=name]').text().trim().split('-')
  const brand = titleArr[0].trim()
  titleArr.splice(0, 1)
  const name = titleArr.join('-').trim()
  const description = $('.short-description > div[itemprop=description]').text()
  const image = $('.fancy-images').first().attr('href')
  const categories = []
  $('.col-sm-12.a-left > ul > li').each((i, elem) => {
    categories[i] = $(elem).text().trim()
  })
  const category = categories.join(' > ').trim()
  const price = $('meta[itemprop=price]').attr('content').trim()
  let match = getScore(searchTerm, {
    name: name.toLowerCase(),
    brand: brand.toLowerCase(),
    description: description.toLowerCase(),
    price: price.toLowerCase(),
  }, searchTerms);
  let matchPercentage = match.percentage
  let matchDetails = match.matchDetails
  const products = {
    name,
    brand,
    description,
    price,
    category,
    image,
    site: 'mycart.pk',
    uri,
    matchPercentage,
    matchDetails,
    searchTerm,
    searchTerms
  }
  return products
}
//get the details of product e.g brand, name, price
function processMyCartProductDetail(productRawBody, uri, searchTerm, searchTerms) {
  products = parseMyCartproduct(productRawBody, uri, searchTerm, searchTerms)
  if (!searchTerms.brand && !searchTerms.price) {
    console.log('--------------product without filter-------------');
    console.log(products);
    console.log('--------------product without filter    END----------');
    return products

  } else {
    return filterProducts(
      products,
      searchTerms
    )
  }


}
// ----------------------mycart end---------------------

// get the score of name,brand ,description
const getScore = (searchTerm, product, searchTerms) => {
  searchTerm = searchTerm.toLowerCase()
  let match = {isNameMatch: false, isBrandMatch: false, isPriceMatch: false, isDescriptionMatch: false}
  let percentage = 0

  if (searchTerms.name && product.name && product.name.toLowerCase().indexOf(searchTerms.name.toLowerCase()) != -1) {
    percentage += 25
    match.isNameMatch = true
  }
  if (searchTerms.brand && searchTerms.brand &&  product.brand.toLowerCase().indexOf(searchTerms.brand.toLowerCase()) != -1) {
    percentage += 25
    match.isBrandMatch = true
  }
  if (product.price == searchTerms.price) {
    percentage += 25
    match.isPriceMatch = true
  }
  if (searchTerms.description && product.description && product.description.toLowerCase().indexOf(searchTerms.description.toLowerCase()) != -1) {
    percentage += 25
    match.isDescriptionMatch = true
  }

  const productInfo = { percentage, matchDetails: match }
  return productInfo
}

const filterProducts = (product, searchTerms) => {
  console.log('+++++++++++++produect filter start++++++++++++++++++');
  console.log(product);
  console.log('+++++++++++++produect filter END++++++++++++++++++');
  if (searchTerms.brand && (product.brand.toLowerCase() === searchTerms.brand.toLowerCase())) {
    return product;
  } else if (searchTerms.brand) {
    return null
  }

  if (searchTerms.name && searchTerms.name.toLowerCase() === product.name.toLowerCase()) {
    return product;
  } else if (searchTerms.name) {
    return null
  }
  return null;
}

module.exports = {
  getDarazProductsInfo,
  getQneProductsInfo,
  getMyCartProductsInfo,
  getYayvoProductsInfo,
  getHummartProductsInfo,
  getTazaMartProductsInfo,

  getQneProductDetails,
  parseQneproduct,

  getMyCartProductDetails,
  parseMyCartproduct,

  getYayvoProductDetails,
  parseYayvoproduct,

  getHummartProductDetails,
  parseHummartproduct,

  getTazaMartProductDetails,
  parseTazaMartproduct

}