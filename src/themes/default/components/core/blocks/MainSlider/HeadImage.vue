<template>
  <section class="head-image w-100 bg-cl-th-accent cl-white">
    <div class="container w-100 h-100 cl-black" v-lazy:background-image="currentImage.image" v-if="currentImage">
      <div class="in_hdr">
        <img width="auto" height="100px" class="logomainpage" src="/assets/_WoW_logo_white.svg">
        <div class="in_hdr_bg"></div>
        <div class="head-image-content">
          <h1 class="title" data-testid="mainSliderTitle">
            {{ currentImage.title }}
          </h1>
          <div class="head-image-content"></div>
          <p
            class="subtitle mb0 serif h3"
            data-testid="mainSliderSubtitle"
          >
            {{ currentImage.subtitle }}
          </p>
          <img width="auto" height="100px" class="logomainpage_mob" src="/assets/logo.png">
        </div>
        <!-- <div class="align-center inline-flex">
          <button-outline :link="currentImage.link" color="light">
            {{ currentImage.button_text }}
          </button-outline>
        </div> -->
      </div>
    </div>
  </section>
</template>

<script>
// import ButtonOutline from 'theme/components/theme/ButtonOutline'
import { mapGetters } from 'vuex'

export default {
  components: {
    // ButtonOutline
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      currentImage: 'promoted/getHeadImage'
    })
  }
}
</script>

<style lang="scss" scoped>

.head-image {
  display: none;
  @media (min-width: 767px) {
    display: inherit;
  }

  .head-image-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 32%;
    padding-top: 10%;
    width: 40%;
    text-align: center;

    .title {
      font-size: 2.9rem;
      margin-bottom: 0;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      -webkit-tap-highlight-color: transparent;
      color: #4f4f4f;
    }

    .subtitle {
      font-size: 0.8rem;
      max-width: 340px;
      font-family: 'Roboto', sans-serif;
      line-height: 1.2rem;
    }
  }
}

.head-image {
  height: 480px;
}
.in_hdr{
  position: relative;
  height: 100%;
}


.in_hdr_bg{
  background: #38D0C3;
  -webkit-box-shadow: 4px 0px 10px rgba(0, 0, 0, 0.3);
  box-shadow: 4px 0px 10px rgba(0, 0, 0, 0.3);
  position: absolute;
  height: 100%;
  width: 600px;
  left:-200px;
  -ms-transform: skew(-28deg, 0deg);
  -webkit-transform: skew(-28deg, 0deg);
  transform: skew(-28deg, 0deg);
}
.in_hdr .logomainpage{
  z-index: 2;
  top: 33%;
  position: absolute;
  height: 120px;
  left: 80px;
}
.logomainpage_mob{
  display: none;
}
.logomainpage{
  top: 20px;
  position: absolute;
  height: 100px;
  left: 12%;
}
.container {
  background-size: cover;
  background-position: bottom center;
  background-repeat: no-repeat;
}
.row {
  height: 480px;
}
@media (max-width: 85em) {
  .head-image-content {
    margin-left: 38%!important;
    padding-top: 8%!important;
  }
}
@media (max-width: 75em) {
  .head-image {
    height: 320px;
  }
  .title {
    font-size: 26px!important;
  }
  .head-image-content {
    max-width: 45%!important;
    margin-left: 30%!important;
    padding-top: 11%!important;
  }
  .subtitle {
    font-size: 18px;
  }
  .row {
    height: 320px;
  }
  .in_hdr_bg{
    width: 500px;
    left:-200px;
  }
  .in_hdr .logomainpage{
    z-index: 2;
    top: 33%;
    height: 80px;
    left: 50px;
  }
}
@media (max-width: 64em) {
  .head-image {
    height: 280px;
  }
  .container {
    background-position: left;
  }
  .title {
    font-size: 28px!important;
  }
  .head-image-content {
    max-width: 45%!important;
    margin-left: 35%!important;
    padding-top: 10%!important;
  }
  .subtitle {
    font-size: 18px;
  }
  .button {
    font-size: 16px;
  }
  .row {
    height: 280px;
  }
  .in_hdr_bg{
    width: 420px;
    left:-200px;
  }
  .in_hdr .logomainpage{
    z-index: 2;
    top: 33%;
    height: 75px;
    left: 30px;
  }
}

</style>
