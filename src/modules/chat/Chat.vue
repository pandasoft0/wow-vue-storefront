<template>
  <div class="chat-container">
    <div class="headingchat">
      <h1 class="h1chat">Chats</h1>
    </div>
    <div class="bodychat">
      <div class="tablechat">
        <div class="chat-log">
          <div v-for="message in messages">
            <chat-messages :message="message"></chat-messages>
          </div>
        </div>
        <chat-form
          v-on:messagesent="addMessage" :user="currentUser.firstname"
        ></chat-form>
      </div>
    </div>
  </div>
</template>
<script>
import {mapGetters, mapState} from "vuex";
import {onlineHelper, productJsonLd} from "@vue-storefront/core/helpers";
import ChatMessages from 'src/modules/chat/ChatMessages.vue'
import ChatForm from 'src/modules/chat/ChatForm.vue'
import {UserService} from "@vue-storefront/core/data-resolver";


import io from 'socket.io-client';
const socket = io('http://3.126.231.36:3010', {rejectUnauthorized: false });

export default {
  name: 'Chat',
  components: {
    ChatMessages,
    ChatForm
  },
  data () {
    return {
      messages: []
    }
  },
  created() {
    this.fetchMessages();
    socket.on('connect', function(){
      let user = 2;
      let room = 1;
      socket.emit('createroom', "chat"+room);
      socket.emit('adduser', user);
    });
    socket.on('chat-message', (data) => {
      console.log('upd socket');
      this.messages.push({
        id_user: data.id_user,
        user: data.user,
        date: data.date,
        message: data.message
      });
    });
  },
  props: {
    "id-order": Number
  },
  methods: {
    async fetchMessages() {
      const resp = await UserService.getMessages(this.idOrder)
      if (resp.resultCode === 200) {
        this.messages = resp.result;
      }
      //axios.get('/messages').then(response => {
      //  this.messages = response.data;
      //});
    },

    async addMessage(message) {
      this.messages.push(message);
      socket.emit('chat-message', {
        id_user: this.currentUser.id,
        user: message.user,
        date: message.date,
        message: message.message
      });
      const resp = await UserService.addMessage(this.idOrder, this.currentUser.id, message.user, message.date, message.message)
      if (resp.resultCode === 200) {
        //this.messages = resp.result;
      }
      //axios.post('/messages', message).then(response => {
     //   console.log(response.data);
     // });
    }
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
}

</script>
<style>
.h1chat {
  display: table-cell;
  vertical-align: middle;
  margin: 0;
  font-size: 16px;
  font-weight: normal;
}
.chat-container {
  min-height: 500px;
  background-color: #FFFFFF;
  border: solid 1px #f2f2f2;
}
.headingchat {
  display: table;
  width: 100%;
  height: 28px;
  text-align: center;
  background-color: #CDCDCD;
  border-radius: 3px 3px 0 0;
  -ms-user-select: none;
  user-select: none;
  background: linear-gradient(#EDEDED 0%, #CDCDCD 75%);
}
.bodychat {
  display: block;
  width: auto;
  height: inherit;
  overflow: hidden;
}
.tablechat {
  display: table;
  width: 100%;
  height: 100%;
  padding: 10px;
}
 .chat-log {
   display: block;
   min-height: 450px;
   width: 100%;
   padding: 2% 4%;
   box-sizing: border-box;
 }
.chat-log::-webkit-scrollbar {
  display: none;
}
</style>
