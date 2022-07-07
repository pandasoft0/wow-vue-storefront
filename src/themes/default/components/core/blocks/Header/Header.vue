<template>
  <div class="header">
    <header
      class="fixed w-100 brdr-bottom-1 bg-cl-primary brdr-cl-secondary"
      :class="{ 'is-visible': navVisible }"
    >
      <div class="container px15">
        <div class="row between-xs middle-xs" v-if="!isCheckoutPage || isThankYouPage">
          <div class="col-md-4 col-xs-2 middle-xs">
            <div>
              <hamburger-icon class="p15 icon bg-cl-secondary pointer" />
            </div>
          </div>
          <div class="col-xs-2 visible-xs">
            <search-icon class="p15 icon pointer" />
          </div>
          <div class="col-md-4 col-xs-4 center-xs pt5">
            <div>
              <logo width="auto" height="41px" />
            </div>
          </div>
          <div class="col-xs-2 visible-xs">
            <wishlist-icon class="p15 icon pointer" />
          </div>
          <div class="col-md-4 col-xs-2 end-xs">
            <div class="inline-flex right-icons">
              <search-icon class="p15 icon hidden-xs pointer" />
              <wishlist-icon class="p15 icon hidden-xs pointer" />
              <compare-icon class="p15 icon hidden-xs pointer" />
              <microcart-icon class="p15 icon pointer" />
              <account-icon class="p15 icon hidden-xs pointer" />
            </div>
          </div>
        </div>
        <div class="row between-xs middle-xs px15 py5" v-if="isCheckoutPage && !isThankYouPage">
          <div class="col-xs-5 col-md-3 middle-xs">
            <div>
              <router-link
                :to="localizedRoute('/')"
                class="cl-tertiary links"
              >
                {{ $t('Return to shopping') }}
              </router-link>
            </div>
          </div>
          <div class="col-xs-2 col-md-6 center-xs">
            <logo width="auto" height="41px" />
          </div>
          <div class="col-xs-5 col-md-3 end-xs">
            <div>
              <a
                v-if="!currentUser"
                href="#"
                @click.prevent="gotoAccount"
                class="cl-tertiary links"
              >{{ $t('Login to your account') }}</a>
              <span v-else>{{ $t('You are logged in as {firstname}', currentUser) }}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
    <!--<div class="header-placeholder" />-->
    <div class="logomainpagemb_cntr">
      <img width="auto" height="100px" class="logomainpagemb" src="/assets/_WoW_logo_white.svg">
    </div>
    <div class="container container-reltv">
      <div class="inline-flex right-icons right-icons-top">
        <search-icon class="p15 icon hidden-xs pointer" />
        <wishlist-icon class="p15 icon hidden-xs pointer" />
        <compare-icon class="p15 icon hidden-xs pointer" />
        <microcart-icon class="p15 icon pointer" />
        <account-icon class="p15 icon hidden-xs pointer" />
        <language-switcher />
        <hamburger-icon class="p15 icon bg-cl-secondary pointer" />
      </div>
    </div>
  </div>

</template>

<script>
import { mapState } from 'vuex'
import CurrentPage from 'theme/mixins/currentPage'
import AccountIcon from 'theme/components/core/blocks/Header/AccountIcon'
import CompareIcon from 'theme/components/core/blocks/Header/CompareIcon'
import HamburgerIcon from 'theme/components/core/blocks/Header/HamburgerIcon'
import Logo from 'theme/components/core/Logo'
import MicrocartIcon from 'theme/components/core/blocks/Header/MicrocartIcon'
import SearchIcon from 'theme/components/core/blocks/Header/SearchIcon'
import WishlistIcon from 'theme/components/core/blocks/Header/WishlistIcon'
import LanguageSwitcher from '../../LanguageSwitcher.vue'

export default {
  name: 'Header',
  components: {
    AccountIcon,
    LanguageSwitcher,
    CompareIcon,
    HamburgerIcon,
    Logo,
    MicrocartIcon,
    SearchIcon,
    WishlistIcon
  },
  mixins: [CurrentPage],
  data () {
    return {
      navVisible: false,
      isScrolling: false,
      scrollTop: 0,
      lastScrollTop: 0,
      navbarHeight: 54
    }
  },
  computed: {
    ...mapState({
      isOpenLogin: state => state.ui.signUp,
      currentUser: state => state.user.current
    }),
    isThankYouPage () {
      return this.$store.state.checkout.isThankYouPage
        ? this.$store.state.checkout.isThankYouPage
        : false
    },
  },
  created() {
    this.fetchpush();
  },
  beforeMount () {
    window.addEventListener(
      'scroll',
      () => {
        this.isScrolling = true
      },
      { passive: true }
    )

    setInterval(() => {
      if (this.isScrolling) {
        this.hasScrolled()
        this.isScrolling = false
      }
    }, 250)
  },
  methods: {
    gotoAccount () {
      this.$bus.$emit('modal-toggle', 'modal-signup')
    },
    hasScrolled () {
      this.scrollTop = window.scrollY
      if (
        (this.scrollTop > this.lastScrollTop &&
        this.scrollTop > this.navbarHeight) ||
        this.scrollTop <= 100
      ) {
        this.navVisible = false
      } else {
        this.navVisible = true
      }
      this.lastScrollTop = this.scrollTop
    },
    fetchpush() {
      //Pusher.logToConsole = true;
      /*if(this.currentUser.id) {
        let pusher = new Pusher('fda2bd887d53247aa0c7', {
          cluster: 'eu'
        });
        let inv1 = this;
        pusher.subscribe('cl-chat' + this.idOrder);

        pusher.bind('mesuser', function (data) {
          inv1.$store.dispatch('notification/spawnNotification', {
            type: 'success',
            hasNoTimeout: true,
            message: 'New messages in order #' + inv1.idOrder,
            action1: {label: inv1.$t('OK')}
          })

        });
      }*/
    },
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$color-icon-hover: color(secondary, $colors-background);

.logomainpagemb {
  height: 100px;
  display: none;
  @media (max-width: 766px) {
    display: block;
  }
}
.logomainpagemb_cntr {
  display: flex;
  align-items: center;
  justify-content: left;
  padding-left: 50px;
}
header {
  height: 54px;
  top: -55px;
  z-index: 3;
  transition: top 0.2s ease-in-out;
  &.is-visible {
    top: 0;
  }
}
.icon {
  opacity: 0.6;
  &:hover,
  &:focus {
    background-color: $color-icon-hover;
    opacity: 1;
  }
}
.right-icons {
  //for edge
  float: right;
}
.header-placeholder {
  height: 54px;
}
.links {
  text-decoration: underline;
}
@media (max-width: 767px) {
  .row.middle-xs {
    margin: 0 -15px;

    &.py5 {
      margin: 0;
    }
  }
  .col-xs-2:first-of-type {
    padding-left: 0;
  }
  .col-xs-2:last-of-type {
    padding-right: 0;
  }
  a,
  span {
    font-size: 12px;
  }
  .logomainpagemb_cntr{
    background: #38D0C3;
    -webkit-box-shadow: 4px 0px 10px rgba(0, 0, 0, 0.3);
    box-shadow: 4px 0px 10px rgba(0, 0, 0, 0.3);
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .service_tiles{
    margin-left: 30px;
    margin-right: 30px;
  }

  .right-icons-top{
    top: 60px!important;
  }
  .container-reltv{
    position: initial!important;
  }
}
.right-icons-top{
  position: absolute;
  z-index: 4;
  right: 20px;
  top: 15px;
}
.container-reltv{
    position: relative;
}
@media (max-width: 420px) {
  .logomainpagemb_cntr {
    padding-left: 10px;
  }
}
</style>
