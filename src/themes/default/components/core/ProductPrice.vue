<template>
  <div class="mb40 price serif">
    <div
      class="h3 cl-secondary"
      v-if="initialPrice.special && price.default && price.original"
    >
      <span
        class="h2 cl-mine-shaft weight-700"
      >{{ price.special | price(storeView) }}</span>&nbsp;
      <span
        class="price-original h3"
      >{{ price.original | price(storeView) }} </span>
      <span class="fromprice">{{ price.textres}}</span>
    </div>
    <div
      class="h2 cl-mine-shaft weight-700"
      v-if="!initialPrice.special && price.default"
    >
      {{ price.default | price(storeView) }}<span class="fromprice">{{ price.textres}}</span>
    </div>
  </div>
</template>
<script>
  import { getCustomOptionValues, getCustomOptionPriceDelta } from '@vue-storefront/core/modules/catalog/helpers/customOption'
  import { getBundleOptionsValues, getBundleOptionPrice } from '@vue-storefront/core/modules/catalog/helpers/bundleOptions'
  import get from 'lodash-es/get'
  import { currentStoreView } from '@vue-storefront/core/lib/multistore'

  export default {
    name: 'ProductPrice',
    props: {
      product: {
        type: Object,
        default: () => ({})
      },
      customOptions: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      bundleOptionsPrice () {
        const allBundeOptions = this.product.bundle_options || []
        const selectedBundleOptions = Object.values(get(this.product, 'product_option.extension_attributes.bundle_options', {}))
        const price = getBundleOptionPrice(
          getBundleOptionsValues(selectedBundleOptions, allBundeOptions)
        )
        return price
      },
      customOptionsPriceDelta () {


        const priceDelta = getCustomOptionPriceDelta(
          getCustomOptionValues(Object.values(this.customOptions), this.product.custom_options || []),
          this.product
        )

        return priceDelta
      },
      price () {
       //console.log( this.product);
       // console.log(this.product.custom_options);

        let customOptionPrice = this.product.custom_options ? this.customOptionsPriceDelta.priceInclTax : 0
        let customOptionPriceD = customOptionPrice;
        if(this.initialPrice.default < this.initialPrice.original && this.initialPrice.original > 0){
          let prminus = 100-(this.initialPrice.default*100/this.initialPrice.original);
          if(customOptionPrice > 0) {
            customOptionPriceD = customOptionPrice - (customOptionPrice * prminus / 100);
          }
        }

        const special = (this.initialPrice.default + customOptionPriceD) * this.product.qty
        const original = (this.initialPrice.original + customOptionPrice) * this.product.qty
        const defaultPrice = this.product.qty > 0
          ? (this.initialPrice.default + customOptionPriceD) * this.product.qty
          : this.initialPrice.default

        if (this.bundleOptionsPrice.priceInclTax > 0) {
          return {
            special,
            original,
            default: this.bundleOptionsPrice.priceInclTax
          }
        }
        const textres = this.product.custom_options ? '' : this.product.length_class;

        return {
          special,
          original,
          textres,
          default: defaultPrice
        }
      },

      initialPrice () {
        return {
          default: this.product.price_incl_tax || this.product.priceInclTax || 0,
          original: this.product.original_price_incl_tax || this.product.originalPriceInclTax || 0,
          special: this.product.special_price || this.product.specialPrice || 0
        }
      },
      storeView () {
        return currentStoreView()
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~theme/css/variables/colors';
  @import '~theme/css/helpers/functions/color';
  $color-primary: color(primary);
  .price-original {
    text-decoration: line-through;
  }

  .price {
    @media (max-width: 767px) {
      color: $color-primary;
    }
  }
  .fromprice{
    font-weight: 400;
    font-size: 16px;
    font-family: 'Roboto', sans-serif;
    margin-left: 10px;
  }
</style>
