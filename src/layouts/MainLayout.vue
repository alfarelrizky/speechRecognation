<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
        />

        <q-toolbar-title
          class="cursor-pointer"
          @click="home"
        >
          Search Film
        </q-toolbar-title>

        <div class="q-my-sm">
          <q-input 
            v-model="textSpeechOutput"
            class="q-px-none"
            :class="isListen && 'textSpeechOutput'"
            rounded 
            outlined
            dense
            clearable
            @change="textSpeechChange"
          >
            <template v-slot:append>
              <q-btn
                v-if="!isListen"
                name="listen"
                class="q-mx-none"
                flat
                round
                @click="speech"
              >
                <q-icon name="mic" />
              </q-btn>
              <q-btn
                v-if="isListen"
                name="stop"
                class="q-mx-none"
                flat
                round
                @click="stopSpeech"
              >
                <q-icon color="red" name="stop" />
              </q-btn>
            </template>
          </q-input>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>


<script>
export default {
  name: "MainLayout",
};
</script>

<script setup>
  import { defineComponent, ref, computed, onMounted, onUpdated } from 'vue'
  import EssentialLink from 'components/EssentialLink.vue'
  import { useStore } from "vuex";

  const store = useStore();

  // global
  const isListen = ref(false);
  const recognition = ref({});

  onMounted(() => {
    // check apa kah support speech recognition atau engga
    if (! "webkitSpeechRecognition" in window) {
      alert('Speech Recognition Not Available');
    }

    // init speech
    const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
    recognition.value = new SpeechRecognition();
    recognition.value.continuous = true;
    recognition.value.lang = 'id';
    recognition.value.interimResults = false;

    // callback
    recognition.value.onstart = function () {
      isListen.value = true;
      // actions to be performed when speech recognition starts
    };

    recognition.value.onspeechend = async function () {
      // stop speech recognition when the person stops talking
      recognition.value.stop();
      isListen.value = false;
      await store.dispatch("speechRecognation/getList");
    }

    recognition.value.onError = (err) => {
      isListen.value = false;
      console.log(err);
    }

    recognition.value.onresult = async function (event) {
      try {
        textSpeechOutput.value = event.results[event.results.length - 1][0].transcript
        isListen.value = false;
        await store.dispatch("speechRecognation/getList");
        recognition.value.stop();
      } catch (error) {
        alert(error)
      }
    }
  });

  const textSpeech = ref('');

  const textSpeechOutput = computed({
    get() {
      return isListen.value ? 'Mendengarkan...' : store.getters["speechRecognation/getSearch"];
    },
    set(value) {
      textSpeech.value = value;
      store.commit("speechRecognation/setSearch", value);
    }
  });

  const speech = () => {
    try {
      isListen.value = true;
      recognition.value.start();
    } catch (error) {
      alert(error)
    }
  };

  const stopSpeech = async() => {
    try {
      isListen.value = false;
      recognition.value.stop();
      await store.dispatch("speechRecognation/getList");
    } catch (error) {
      alert(error)
    }
  };

  const textSpeechChange = async(value) => {
    try {
      if (value) await store.dispatch("speechRecognation/getList");
    } catch (error) {
      alert(error)
    }
  };

  const home = () => {
    try {
      window.location.href = `#/`;
    } catch (error) {
      alert(error)
    }
  };
</script>

<style>
  .q-field__control{
    box-shadow: 2px 2px #094580;
  }
</style>