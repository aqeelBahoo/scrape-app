var itemList = []
export const AdminMixins = {
  data () {
    return {
    }
  },
  methods: {
    saveList (list) {
      itemList = itemList.concat(list)
    },
    getList () {
      return itemList
    },
    resetList () {
      itemList = []
    }
  }
}
