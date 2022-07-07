<template>
  <div class="row center-xs">
    <div
      class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-3 service_tiles"
      v-for="(tile, index) in service_tiles"
      :key="index"
    >
      <router-link
        class="block no-underline product-link"
        :to="'/'+tile.slug"
        data-testid="productLink"
      >
        <div
          class=" center-xs middle-xs"
        >
          <div>
          <img :src="'/assets/ig/'+(tile.slug)+'_icon.svg'"
            class="tile-image-f"
          >
          </div>
          <div class="cl-secondary service_tiles_txt mt10">{{ tile.name }}</div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import {prepareAllQueryFx} from "@vue-storefront/core/modules/catalog/queries/allfx";

export default {
  name: 'TileLinks',
  data () {
    return {
      service_tiles: []
    }
  },
  async beforeMount () {
    this.ListAllsml();
  },
  methods: {
    async ListAllsml() {
      let inspirationsQueryAll = prepareAllQueryFx([60,68,72,62,57,69,70,56])
      const {items} = await this.$store.dispatch('product/findProducts', {
        query: inspirationsQueryAll,
        size: 12,
        populateRequestCacheTags: false,
        prefetchGroupProducts: false
      });
      if (items.length) {
        this.service_tiles = items
      }
    }
  }
}

</script>

<style lang='scss' scoped>
@import '~theme/css/animations/transitions';

.tile {
  display: flex;
  overflow: hidden;
}

.tile-image {
  width: 100%;
  height: 100%;
  transition: transform 0.3s $motion-main;

  &:hover,
  &:focus {
    transform: scale(1.2);
  }
}
.service_tiles {
  padding: 0;
  border: 1px solid #38D0C3;
  min-height: 180px;
  margin: 5px;
  @media (min-width: 1200px) {
    max-width: 24%;
  }
  @media (max-width: 576px) {
    max-width: 90%;
  }
}
.service_tiles_txt {
  font-size: 18px;
}
.tile-image-f{
  margin-top: 40px;
}

.service_tiles:hover {
  background: rgba(49, 214, 200, 0.2);
  border: 1px solid #38D0C3;
  box-sizing: border-box;
  cursor: pointer;
}
</style>
