import { SearchQuery } from 'storefront-query-builder'
import config from 'config'

export function prepareAllQueryFx (related_products) {
  let relatedProductsQuery = new SearchQuery()
  relatedProductsQuery = relatedProductsQuery
    .applyFilter({ key: 'status', value: { 'in': [1] } })
    .applyFilter({ key: 'id', value: { 'in': related_products } })
  return relatedProductsQuery
}
