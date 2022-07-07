<template>
  <div class="message-input">
  <textarea
      ref="messageInput"
      placeholder="message..."
      maxlength="20000"
      @keydown.enter="sendMessage"
    ></textarea>
  </div>
</template>
<script>
import {onlineHelper} from "@vue-storefront/core/helpers";
import {mapState} from "vuex";

export default {
  name: 'chat-form',
  data() {
    return {};
  },
  computed: {
    isOnline (value) {
      return onlineHelper.isOnline
    },
    ...mapState({
      isOpenLogin: state => state.ui.signUp,
      currentUser: state => state.user.current
    }),
  },
  methods: {
    sendMessage(event) {
      if (!event.shiftKey) {
        event.preventDefault();
      } else {
        return;
      }
      // If the message body is empty, do not submit
      if (event.target.value.length === 0) {
        return;
      }
      var currentdate = new Date();
      var datetime = currentdate.getDate() + "."
        + (currentdate.getMonth()+1)  + "."
        + currentdate.getFullYear() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes();
      this.$emit('messagesent', {
        id_user: this.currentUser.id,
        user: this.currentUser.firstname+' '+this.currentUser.lastname,
        date: datetime,
        message: event.target.value
      });

      event.target.value = '';
    }
  }
};
</script>


<style scoped>
.message-input {
  display: table-row;
  width: 100%;
  height: 26px;
}
textarea {
  width: 95%;
  height: 30px;
  padding: 0 5px;
  margin: 0;
  box-sizing: border-box;
  line-height: 20pt;
  resize: none;
  outline: none;
  font-size: 14px;
  border: solid 1px #AAAAAA;
  border-radius: 3px;
  font-family: Helvetica;
}
</style>
