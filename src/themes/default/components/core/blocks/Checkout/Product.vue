<template>
  <div class="row p25 between-xs">
    <div class="blend">
      <product-image :image="image" />
    </div>
    <div class="col-xs">
      <div class="row">
        <div class="col-xs-12 col-md-12 serif">

            <span class="h4 cl-error" v-if="product.special_price">{{ (product.price_incl_tax * product.qty) + ret_custom_price | price(storeView) }} </span>
            <span class="price-original h5" v-if="product.special_price">{{ product.original_price_incl_tax * product.qty | price(storeView) }}</span>
            <span v-if="!product.special_price && product.price_incl_tax " class="h4">{{ (product.price_incl_tax * product.qty) + ret_custom_price | price(storeView) }}</span>

        </div>
        <div class="col-xs-12 col-md-12 pb15">
          <div class="mb15">
            <div class="h4 weight-400 cl-accent serif">
              {{ product.name | htmlDecode }}
            </div>
            <div class="h6 cl-bg-tertiary pt5 options" v-if="ret_custom_options">
              <div v-for="opt in ret_custom_options" :key="opt.valoptionid">
                <span class="opn">{{ opt.mainoptionname }} </span>
                <b><span class="opv" v-html="opt.valoptionname" /></b>
                <span v-if="opt.valoptionprice">
                  <span class="opv" v-if="product.special_price">+{{opt.valoptionprice - (opt.valoptionprice*(100-(product.price_incl_tax*100/product.original_price_incl_tax))/100) | price(storeView) }}</span>
                  <span class="opv" v-if="!product.special_price">+{{ opt.valoptionprice | price(storeView) }}</span>
                </span>
              </div>
            </div>
            <div class="error" v-if="product.errors && Object.keys(product.errors).length > 0">
              {{ product.errors | formatProductMessages }}
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { Product } from '@vue-storefront/core/modules/checkout/components/Product'
import { onlineHelper } from '@vue-storefront/core/helpers'
import ProductImage from 'theme/components/core/ProductImage'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

export default {
  computed: {
    storeView () {
      return currentStoreView()
    },
    isOnline () {
      return onlineHelper.isOnline
    },
    image () {
      return {
        loading: this.thumbnail,
        src: this.thumbnail
      }
    },
    ret_custom_price () {
      let pres = 0;
      if (this.product.product_option) {
        const custom_options_incart = this.product.product_option.extension_attributes.custom_options;
        if (this.product.custom_options) {
          let prminus = 100-(this.product.special_price*100/this.product.original_price);
          for (const mainoption of this.product.custom_options) {
            for (const valoption of mainoption.values) {
              const cval = custom_options_incart[mainoption.option_id];
              if (typeof cval !== 'undefined') {
                if (cval.option_value) {
                  const resarr = cval.option_value.split(',');
                  if (resarr.indexOf(valoption.option_type_id) != -1) {
                    if(this.product.special_price > 0){
                      pres = pres + valoption.price - (valoption.price * prminus / 100);
                    } else {
                      pres = pres + valoption.price
                    }
                  }
                }
              }
            }
          }
        }
      }
      console.log(this.product);
      return pres;
    },

    ret_custom_options () {
      let res = [];
      let reschld = [];
      let reschldop  = {};
      if( this.product.product_option) {
        const custom_options_incart = this.product.product_option.extension_attributes.custom_options;
        if (this.product.custom_options) {
          for (const mainoption of this.product.custom_options) {
            for (const valoption of mainoption.values) {
              const cval = custom_options_incart[mainoption.option_id];
              reschld.push(cval);
              reschldop[valoption.option_type_id] = valoption.quantity;
              //console.log(valoption);
              if (typeof cval !== 'undefined') {
                if (cval.option_value) {
                  const resarr = cval.option_value.split(',');
                  if (resarr.indexOf(valoption.option_type_id) != -1) {
                    //if (mainoption.type === 'select') {
                      res.push({
                        mainoptionname: mainoption.title,
                        valoptionname: valoption.title,
                        valoptionid: valoption.option_type_id,
                        valoptionprice: valoption.price,
                      });
                    //}
                  }
                }
              }
            }
          }
        }
      }
      return res;
    }
  },
  mixins: [Product],
  components: {
    ProductImage
  }
}
</script>

<style scoped>
.price-original {
  text-decoration: line-through;
}
.blend {
  flex: 0 0 121px;
}
</style>
