<template src="./AdminSearch.html">
</template>

<script>
import * as api from '../../../utils/api'
import { AdminMixins } from '../../mixins/AdminMixins'
import router from '../../../router'
import * as allCategories from '../../../utils/categories'
import swal from 'sweetalert'

export default {
  name: 'AdminSearch',
  mixins: [AdminMixins],
  data () {
    return {
      searchTerm: {},
      query: '',
      categories: [],
      name: '',
      selectedSite: '0',
      price: '',
      brand: '',
      description: '',
      selectedCategory: '',
      isReqPending: false,
      darazValue: '',
      myCartValue: '',
      tazaMartValue: '',
      allCategories: allCategories
    }
  },
  methods: {
    requestError () {
      swal('No search found! !', 'Try Again!', 'error')
      this.isReqPending = false
    },
    searchNotFoundMessage () {
      swal('Search Item Not Found!', '', 'error')
      this.isReqPending = false
    },
    onSiteChange (site) {
      const sites = {
        '1': 'daraz',
        '2': 'myCartPk',
        '3': 'qnePk',
        '4': 'yayvo',
        '5': 'humMart',
        '6': 'tazaMart'
      }
      this.categories = this.selectedSite !== '0'
        ? allCategories[sites[this.selectedSite]]
        : []
    },
    search () {
      if (!this.query.trim() && !this.selectedCategory) {
        return
      }
      this.isReqPending = true
      this.resetList()
      const searchTerms = {
        name: this.name || null,
        brand: this.brand || null,
        price: this.price || null,
        description: this.description || null
      }
      const searchProducts = {
        '0': this.searchInAllSites,
        '1': api.getDarazProductsInfo,
        '2': api.getMyCartProductsInfo,
        '3': api.getQneProductsInfo,
        '4': api.getYayvoProductsInfo,
        '5': api.getHumMartProductsInfo,
        '6': api.getTazaMartProductsInfo
      }
      this.searchTerm = this.query
      /* if (this.query && this.description) {
        this.searchTerm = `${this.query} ${this.description}`
      }
      if (this.query && this.description && this.brand) {
        this.searchTerm = `${this.query} ${this.description} ${this.brand}`
      }
      if (this.query && this.description && this.brand && this.price) {
        this.searchTerm = `${this.query} ${this.description} ${this.brand} ${
          this.price
        }`
      } */
      searchProducts[this.selectedSite](
        this.searchTerm,
        this.selectedCategory,
        searchTerms
      )
        .then(results => {
          this.selectedCategory = ''
          if (results.length === 0) {
            this.searchNotFoundMessage()
            return
          }
          this.saveList(results)
          router.push({ name: 'AdminSearchItemList' })
        })
        .catch(_ => {
          this.requestError()
        })
    },
    searchInAllSites (searchTerms) {
      const promises = []
      promises.push(
        new Promise(resolve => {
          api
            .getDarazProductsInfo(this.searchTerm, this.darazValue, searchTerms)
            .then(results => {
              this.saveList(results)
              resolve()
            })
        })
      )

      promises.push(
        new Promise(resolve => {
          api
            .getQneProductsInfo(this.searchTerm, null, searchTerms)
            .then(qneResults => {
              this.saveList(qneResults)
              resolve()
            })
        })
      )

      promises.push(
        new Promise(resolve => {
          api
            .getMyCartProductsInfo(
              this.searchTerm,
              this.myCartValue,
              searchTerms
            )
            .then(myCartResults => {
              this.saveList(myCartResults)
              resolve()
            })
        })
      )

      /* promises.push(new Promise((resolve) => {
          api.getYayvoProductsInfo(this.searchTerm, null, searchTerms).then(result => {
            this.saveList(myCartResults)
            resolve()
          })
        })) */
      promises.push(
        new Promise(resolve => {
          api
            .getHumMartProductsInfo(this.searchTerm, null, searchTerms)
            .then(result => {
              this.saveList(result)
              resolve()
            })
        })
      )
      promises.push(
        new Promise(resolve => {
          api
            .getHumMartProductsInfo(
              this.searchTerm,
              this.tazaMartValue,
              searchTerms
            )
            .then(result => {
              this.saveList(result)
              resolve()
            })
        })
      )
      Promise.all(promises).then(() =>
        router.push({ name: 'AdminSearchItemList' })
      )
    }
  },
  mounted () {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.desc {
  font-style: italic;
  font-size: 14px;
}
</style>
