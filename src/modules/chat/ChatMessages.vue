<template>
    <div
      class="message-bubble"
      :class="me"
    >
      <span
        class="from"
        :class="me"
      >{{ message.user }} {{ message.date }} </span>
      <span
        class="to"
        :class="me"
      >{{ message.date }} </span>

      <br :class="me">
      <span
        class="message-text"
      >{{ message.message }}</span>
    </div>
</template>

<script>
import {onlineHelper} from "@vue-storefront/core/helpers";
import {mapState} from "vuex";

export default {
  props: ['message'],
  computed: {
    isOnline (value) {
      return onlineHelper.isOnline
    },
    ...mapState({
      isOpenLogin: state => state.ui.signUp,
      currentUser: state => state.user.current
    }),
    me() {
      const id_user = this.message.id_user;
      let result = false;
      if (this.currentUser.id.toString() === id_user.toString()) {
        result = true;
      }
      return result ? 'me' : '';
    },
  },
  methods: {

  }
};
</script>
<style scoped>
.message-bubble {
  display: block;
  max-width: 50%;
  margin-bottom: 4px;
  float: left;
  clear: both;
}
.message-text {
  padding: 8px;
  margin: 4px;
  text-align: left;
  background-color: #dfdfdf;
  border-radius: 4px;
}
.message-bubble.me {
  float: right;
}
.message-bubble.me .message-text {
  background-color: #9ec6f5;
}
.from {
  float: left;
  margin: 4px;
  font-size: 10px;
  color: #9DA7AF;
}
.to {
  margin: 4px;
  font-size: 10px;
  color: #9DA7AF;
  text-align: right;
}
.to {
  display: none!important;
}
.to.me {
  display: block!important;
}
.from.me {
  display: none;
}
.message-bubble span {
  display: block;
}
.message-bubble.me br.me {
  display: none;
}
</style>
