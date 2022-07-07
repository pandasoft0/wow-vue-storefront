<template>
  <div id="home">
    <head-image />
    <div class="tfx-15">
      <products-slider
        :products="products"
        :config="sliderConfig"
        :title="titleslider"
      />
    </div>
    <div class="tfx-15">
      <products-slider
        :products="productsnew"
        :config="sliderConfignew"
        :title="titleslidernew"
      />
    </div>
    <section class="container tfx-15">
      <div class="row center-xs">
        <header class="col-md-12">
          <h2 class="align-center cl-accent">
            {{ $t('More services') }}
          </h2>
        </header>
      </div>
      <tile-links />
      <div class="row center-xs">
        <a href="/cleaning-services-59" class="cl-primary btn-service mt35 mb20">{{ $t('More services') }}</a>
      </div>
    </section>
    <div class="lft-bg-ft hidden-xs"></div>
    <div class="rgh-bg-ft hidden-xs"></div>
    <div class="ctn-bg-ft hidden-xs"></div>
    <section class="container tfx-65 tfx-15 hidden-xs">
      <div class="row center-xs">
        <header class="col-md-12">
          <h2 class="align-center cl-accent">
            {{ $t('How does it work') }}
          </h2>
        </header>
      </div>
      <div class="row center-xs mt25">
        <div class="col-md-12 work_bg"></div>
      </div>
      <div class="row center-xs">
        <div class="col-md-4 work_bg_tx">Order a service on the site</div>
        <div class="col-md-4 work_bg_tx work_bg_tx2">The specialist will instantly receive your order</div>
        <div class="col-md-4 work_bg_tx work_bg_tx3">Our experts will do everything on time</div>
      </div>
    </section>
    <Onboard />
  </div>
</template>
<script>
// query constructor
import { isServer, onlineHelper } from '@vue-storefront/core/helpers'
import LazyHydrate from 'vue-lazy-hydration'

// Theme core components
//import ProductListing from 'theme/components/core/ProductListing'
import HeadImage from 'theme/components/core/blocks/MainSlider/HeadImage'
// Theme local components
import Onboard from 'theme/components/theme/blocks/Home/Onboard'
//import PromotedOffers from 'theme/components/theme/blocks/PromotedOffers/PromotedOffers'
import TileLinks from 'theme/components/theme/blocks/TileLinks/TileLinks'
import { Logger } from '@vue-storefront/core/lib/logger'
import { mapGetters } from 'vuex'
import config from 'config'
import { registerModule } from '@vue-storefront/core/lib/modules'
import { RecentlyViewedModule } from '@vue-storefront/core/modules/recently-viewed'
import ProductsSlider from 'theme/components/core/ProductsSlider'
import { prepareOffersQuery } from '@vue-storefront/core/modules/catalog/queries/offers'
import { prepareAllQuery } from '@vue-storefront/core/modules/catalog/queries/all'
export default {
  data () {
    return {
      loading: true,
      products: [],
      productsnew: [],
      sliderConfig: {
        perPage: 1,
        perPageCustom: [[576, 2], [1024, 4]],
        paginationEnabled: true,
        centerMode: true,
        scrollPerPage: true,
        loop: true
      },
      titleslider:this.$i18n.t('Our services'),
      sliderConfignew: {
        perPage: 1,
        perPageCustom: [[576, 2], [1024, 4]],
        paginationEnabled: true,
        loop: true
      },
      titleslidernew:this.$i18n.t('Promotional Offers')
    }
  },
  components: {
    HeadImage,
    Onboard,
    //ProductListing,
    ProductsSlider,
    //PromotedOffers,
    TileLinks,
    LazyHydrate
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
   // ...mapGetters('homepage', ['getEverythingNewCollection']),

    categories () {
      return this.getCategories
    },
    isOnline () {
      return onlineHelper.isOnline
    },
    isLazyHydrateEnabled () {
      //return config.ssr.lazyHydrateFor.some(
     //   field => ['homepage', 'homepage.new_collection'].includes(field)
     // )
    },
    currentIndex: {
      cache: false,
      get () {
       // return this.$refs.carousel ? this.$refs.carousel.currentPage : 0
      }
    }
  },
  beforeCreate () {
    registerModule(RecentlyViewedModule)
  },
  async beforeMount () {
    /*if (this.$store.state.__DEMO_MODE__) {
      const onboardingClaim = await this.$store.dispatch('claims/check', { claimCode: 'onboardingAccepted' })
      if (!onboardingClaim) { // show onboarding info
        this.$bus.$emit('modal-toggle', 'modal-onboard')
        this.$store.dispatch('claims/set', { claimCode: 'onboardingAccepted', value: true })
      }
    }*/

    this.ListAll();
    this.ListOffers();
  },
  mounted () {
    if (!this.isLoggedIn && localStorage.getItem('redirect')) this.$bus.$emit('modal-show', 'modal-signup')
  },
  watch: {
    isLoggedIn () {
      const redirectObj = localStorage.getItem('redirect')
      if (redirectObj) this.$router.push(redirectObj)
      localStorage.removeItem('redirect')
    }
  },
  async asyncData ({ store, route, context }) { // this is for SSR purposes to prefetch data
    if (context) context.output.cacheTags.add(`home`)
    Logger.info('Calling asyncData in Home Page (core)')()

    await Promise.all([
      //store.dispatch('homepage/fetchNewCollection'),
      store.dispatch('promoted/updateHeadImage'),
      //store.dispatch('promoted/updatePromotedOffers')
    ])
  },
  metaInfo () {
    return {
      title: this.$route.meta.title || this.$i18n.t('Home Page'),
      meta: this.$route.meta.description ? [{ vmid: 'description', name: 'description', content: this.$route.meta.description }] : []
    }
  },
  methods: {
    async ListOffers () {
      let inspirationsQuery = prepareOffersQuery()

      const { items } = await this.$store.dispatch('product/findProducts', {
        query: inspirationsQuery,
        size: 12,
        sort: 'created_at:desc',
        options: {
          populateRequestCacheTags: false,
          prefetchGroupProducts: false
        }
      })
      if (items.length) {
        this.products = items
      }
    },
    async ListAll () {

      let inspirationsQueryAll = prepareAllQuery()

      const { items } = await this.$store.dispatch('product/findProducts', {
        query: inspirationsQueryAll,
        size: 12,
        populateRequestCacheTags: false,
        prefetchGroupProducts: false
      });
      if (items.length) {
        this.productsnew = items
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .new-collection {
    @media (max-width: 767px) {
      padding-top: 0;
    }
  }
  .main-prd .product-listing{
    width: 100%;
  }
  .new-collection{
    margin-top: 40px;
  }
  .tfx-15{
    margin-top: 45px;
  }
  .tfx-65{
    margin-bottom: 85px;
  }
  .btn-service{
    background: #38D0C3;
    border-radius: 3px;
    color: white;
    padding: 15px 30px 15px 30px;
    font-size: 18px;
    font-weight: bold;
  }

  .btn-service:hover{
    background: #32b6ab;

  }
  .work_bg {
    background-size: auto;
    background-position: bottom center;
    background-repeat: no-repeat;
    background-image: url('/assets/mwrk1.png');
    height: 152px;
  }
  .work_bg_tx{
    font-weight: bold;
    padding: 20px;
    font-size: 18px;
    line-height: 35px;
    color: #4f4f4f;
  }
  .work_bg_tx2{
    padding-left: 70px;
  }
  .work_bg_tx3{
    padding-left: 110px;
  }
  .lft-bg-ft{
    background-size: auto;
    background-position: bottom center;
    background-repeat: no-repeat;
    background-image: url('/assets/mwrk3.png');
    position: absolute;
    width: 253px;
    height: 480px;
    bottom: 380px;
  }
  .rgh-bg-ft{
    background-size: auto;
    background-position: bottom center;
    background-repeat: no-repeat;
    background-image: url('/assets/mwrk2.png');
    position: absolute;
    width: 185px;
    height: 331px;
    bottom: 450px;
    right: 0;
  }
  .ctn-bg-ft{
    background-size: auto;
    background-position: bottom center;
    background-repeat: no-repeat;
    background-image: url('/assets/mwrk4.png');
    position: absolute;
    width: 168px;
    height: 238px;
    top: 900px;
  }
</style>
