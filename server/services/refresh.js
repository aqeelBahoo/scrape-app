const puppeteer = require('puppeteer');
search = require('../../search')
module.exports = {
    "refreshItem" : async (item) => {
        console.log('***** 1.0')
        site = item.list.site
        uri = item.list.uri
        searchTerm = item.list.searchTerm
        searchTerms = item.list.searchTerms
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        refreshSiteMethods[site.toLowerCase()](browser, uri, searchTerm, searchTerms)

    }
}


//util functions

 refreshSiteMethods = {
     "qne.pk": function (browser, uri, searchTerm, searchTerms) {
        // uri = `https://qne.com.pk/${uri}`
        search.getQneProductDetails(browser, {}, uri, {}).then((resp) => {
            console.log('** uri : ', resp.uri)
            console.log('** uri : ', resp.qneHtml)
            product = search.parseQneproduct(resp.qneHtml, uri, searchTerm, searchTerms)
            console.log('*** poduct :', product)
        })
     },
     "mycart.pk": function (browser, uri, searchTerm, searchTerms) {
        productRawBody = search.getmycartProductDetails(browser, {}, uri, {})
        product = search.parseMyCartproduct(productRawBody, uri, searchTerm, searchTerms)
        console.log(product)
     },
     "yayvo.com": function (browser, uri, searchTerm, searchTerms) {
        productRawBody = search.getYayvoProductDetails(browser, {}, uri, {})
        product = search.parseYayvoproduct(productRawBody, uri, searchTerm, searchTerms)
        console.log(product)
     },
     "hummart.com": function (browser, uri, searchTerm, searchTerms) {
        productRawBody = search.getHummartProductDetails(browser, {}, uri, {})
        product = search.parseHummartproduct(productRawBody, uri, searchTerm, searchTerms)
        console.log(product)
     },
     "tazamart.com": function (browser, uri, searchTerm, searchTerms) {
        productRawBody = search.getTazaMartProductDetails(browser, {}, uri, {})
        product = search.parseTazaMartproduct(productRawBody, uri, searchTerm, searchTerms)
        console.log(product)
     },

 }