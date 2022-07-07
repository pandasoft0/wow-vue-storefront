import { SearchQuery } from 'storefront-query-builder'
import config from 'config'

export function prepareOffersQuery () {
  let relatedProductsQuery = new SearchQuery()
  relatedProductsQuery = relatedProductsQuery
    .applyFilter({ key: 'status', value: { 'in': [1] } })
    .applyFilter({ key: 'ms', value: { 'in': [1] } })
  return relatedProductsQuery
}
