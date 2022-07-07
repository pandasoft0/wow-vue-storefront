import { SearchQuery } from 'storefront-query-builder'
import config from 'config'

export function prepareAllQuery () {
  let relatedProductsQuery = new SearchQuery()
  relatedProductsQuery = relatedProductsQuery
    .applyFilter({ key: 'status', value: { 'in': [1] } })
    .applyFilter({ key: 'special_ms', value: { 'in': [1] } })
  return relatedProductsQuery
}
