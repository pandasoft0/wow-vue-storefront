<template>
  <div class="product align-center w-100 pb20" v-observe-visibility="visibilityChanged">
    <div class="product__icons">
      <AddToWishlist :product="product">
        <div
          class="product__icon"
          :class="{'product__icon--active': isOnWishlist }"
          :title="isOnWishlist ? $t('Remove') : $t('Add to favorite') "
        >
          <i class="material-icons">{{ favoriteIcon }}</i>
        </div>
      </AddToWishlist>
    </div>
    <router-link
      class="block no-underline product-link"
      :to="productLink"
      data-testid="productLink"
    >
      <div
        class="product-cover bg-cl-secondary"
        :class="[{ sale: labelsActive && isOnSale }, { new: labelsActive && isNew }]"
      >
        <product-image
          class="product-cover__thumb"
          :image="thumbnailObj"
          :alt="product.name | htmlDecode"
          :calc-ratio="false"
          data-testid="productImage"
        />
      </div>
      <div class="prod_title_fx_rl">
        <p class="mb0 cl-accent prod_title_fx mt10" v-if="!onlyImage">
          {{ product.name | htmlDecode }}
        </p>
      </div>
      <div class="prod_price-fx">
        <span
          class="price-original mr5 lh30 cl-secondary"
          v-if="product.special_price && parseFloat(product.original_price_incl_tax) > 0 && !onlyImage"
        >{{ product.original_price_incl_tax | price(storeView) }}</span>

        <span
          class="price-special lh30 cl-accent weight-700"
          v-if="product.special_price && parseFloat(product.special_price) > 0 && !onlyImage"
        >{{ product.price_incl_tax | price(storeView) }}</span>

        <span
          class="lh30 cl-secondary"
          v-if="!product.special_price && parseFloat(product.price_incl_tax) > 0 && !onlyImage"
        >{{ product.price_incl_tax | price(storeView) }}</span>
      </div>
    </router-link>
  </div>
</template>

<script>
import rootStore from '@vue-storefront/core/store'
import { ProductTile } from '@vue-storefront/core/modules/catalog/components/ProductTile.ts'
import config from 'config'
import ProductImage from './ProductImage'
import AddToWishlist from 'theme/components/core/blocks/Wishlist/AddToWishlist'
import { IsOnWishlist } from '@vue-storefront/core/modules/wishlist/components/IsOnWishlist'
import { IsOnCompare } from '@vue-storefront/core/modules/compare/components/IsOnCompare'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

export default {
  mixins: [ProductTile, IsOnWishlist, IsOnCompare],
  components: {
    ProductImage,
    AddToWishlist,

  },
  props: {
    labelsActive: {
      type: Boolean,
      default: true
    },
    onlyImage: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    thumbnailObj () {
      return {
        src: this.thumbnail,
        loading: this.thumbnail
      }
    },
    favoriteIcon () {
      return this.isOnWishlist ? 'favorite' : 'favorite_border'
    },
    storeView () {
      return currentStoreView()
    }
  },
  methods: {
    onProductPriceUpdate (product) {
      if (product.sku === this.product.sku) {
        Object.assign(this.product, product)
      }
    },
    visibilityChanged (isVisible, entry) {
      if (
        isVisible &&
        config.products.configurableChildrenStockPrefetchDynamic &&
        config.products.filterUnavailableVariants &&
        this.product.type_id === 'configurable' &&
        this.product.configurable_children &&
        this.product.configurable_children.length > 0
      ) {
        const skus = [this.product.sku]
        for (const confChild of this.product.configurable_children) {
          const cachedItem = rootStore.state.stock.cache[confChild.id]
          if (typeof cachedItem === 'undefined' || cachedItem === null) {
            skus.push(confChild.sku)
          }
        }
        if (skus.length > 0) {
          rootStore.dispatch('stock/list', { skus: skus }) // store it in the cache
        }
      }
    }
  },
  beforeMount () {
    this.$bus.$on('product-after-priceupdate', this.onProductPriceUpdate)
  },
  beforeDestroy () {
    this.$bus.$off('product-after-priceupdate', this.onProductPriceUpdate)
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/animations/transitions';
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';

$bg-secondary: color(secondary, $colors-background);
$border-secondary: color(secondary, $colors-border);
$color-white: color(white);

.product {
  position: relative;
  @media (max-width: 767px) {
    padding-bottom: 10px;
  }
  &__icons {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    padding-right: 20px;
    padding-top: 10px;
  }
  &__icon {
    padding-top: 10px;
    opacity: 0;
    z-index: 2;
    transition: 0.3s opacity $motion-main;
    @media (max-width: 767px) {
      opacity: 1;
    }
    &--active {
      opacity: 1;
    }
  }
  &:hover {
    .product__icon {
      opacity: 1;
    }
  }
}

.price-original {
  text-decoration: line-through;
}

%label {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-color: $border-secondary;
  text-transform: uppercase;
  color: $color-white;
  font-size: 12px;
}

.product-cover {
  overflow: hidden;

  &__thumb {
    padding-bottom: calc(143.88% / (164.5 / 100));
    @media screen and (min-width: 768px) {
      /*padding-bottom: calc(300% / (276.5 / 115));*/
    }
    opacity: 1;
    will-change: opacity, transform;
    transition: 0.3s opacity $motion-main, 0.3s transform $motion-main;
  }

  @media screen and (min-width: 768px) {
    &:hover {
      .product-cover__thumb {
        opacity: 1;
        transform: scale(1.1);
      }
      &.sale::after,
      &.new::after {
        opacity: 1;
      }
    }
  }

  &.sale {
    &::after {
      @extend %label;
      content: 'Sale';
    }
  }
  &.new {
    &::after {
      @extend %label;
      content: 'New';
    }
  }
}
  .prod_title_fx{
    background: #38D0C3;
    opacity: 0.8;
    color: white;
    position: absolute;
    width: calc(100% - 10px);
    line-height: 25px;
    top: -50px;
    margin-left: 5px;
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .prod_title_fx_rl{
    position: relative;
    margin-bottom: 30px;
  }
  .prod_price-fx {
     position: absolute;
    top: 50px;
    background: #38D0C3;
    opacity: 0.8;
    color: white;
    line-height: 18px;
    padding-left: 10px;
    padding-right: 10px;
  }
  .prod_price-fx span {
    color: white;
  }
</style>
