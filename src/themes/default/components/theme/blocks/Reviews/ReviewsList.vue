<template>
  <div>
    <div class="mt50 h5" v-if="!reviews || reviews.length === 0">
      {{ $t('No reviews have been posted yet. Please don\'t hesitate to share Your opinion and write the first review!') }}
    </div>
    <div class="mt50" v-for="(item, index) in reviews" :key="index">
      <h4 class="weight-400 m0">
        {{ item.title }}
      </h4>
      <p class="cl-tertiary mt10 mb20 fs-medium-small">
        {{ item.nickname }}, {{ item.created_at | date(null, storeView) }}
      </p>
      <p class="cl-gray lh25">
        {{ item.detail }}
      </p>
    </div>
  </div>
</template>

<script>
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import {processURLAddress, reviewJsonLd} from '@vue-storefront/core/helpers'
import {ReviewsService} from "@vue-storefront/core/data-resolver";
import {TaskQueue} from "@vue-storefront/core/lib/sync";
import getApiEndpointUrl from "@vue-storefront/core/helpers/getApiEndpointUrl";
import {Logger} from "@vue-storefront/core/lib/logger";
export default {
  props: {
    perPage: {
      type: Number,
      required: false,
      default: 4
    },
    items: {
      type: Array,
      default: () => []
    },
    productName: {
      type: String,
      default: ''
    },
    product: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      reviews: []
    }
  },
  async beforeMount () {
    this.getlists();
  },
  computed: {

    storeView () {
       return currentStoreView()
    },
  },
  methods: {
    async getlists () {
      try {
        const res = await fetch (processURLAddress(`/api/review/lists?productId=${encodeURIComponent(this.product.id)}`))
        const resData = await res.json()
        if (resData.code === 200) {
          this.reviews = resData.result
        } else {
          throw new Error(resData.code)
        }
      } catch (e) {
        throw new Error(e)
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$mine-shaft: color(mine-shaft);
$white: color(white);

.inactive {
  opacity: 0.5;
  pointer-events: none;
}
.material-icons {
  font-size: 30px;
  line-height: 30px;
}
.pagination-page {
  a {
    &:hover {
      background-color: $mine-shaft;
      color: $white;
    }
  }
  @media (max-width: 767px) {
    margin: 0;
  }
  a, span {
    @media (max-width: 767px) {
      padding: 10px 12px;
      font-size: 16px;
    }
  }
}
</style>
