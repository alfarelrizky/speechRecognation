<template>
  
  <q-page class="q-mx-lg q-my-lg flex-center row">
    <q-intersection
      v-for="item in data"
      :key="item.id"
      transition="scale"
      class="col-md-3 q-mx-sm q-my-xs cursor-pointer"
      once
    >
      <q-card
        class="my-card text-white"
        style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
        @click="detail(item.id)"
      >
        <q-img :src="img(item.poster_path)">
          <div class="absolute-bottom text-h6">
            {{item.title}}
          </div>
        </q-img>
        <q-card-section>
          <div class="text-subtitle2">Popularity {{ item.popularity }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ formatterShorten(item.overview, 100) }}
        </q-card-section>
      </q-card>
    </q-intersection>
  </q-page>
</template>

<script>
  export default {
    name: "IndexPage",
  };
</script>

<script setup>
  import { defineComponent, ref, computed, onMounted, onUpdated } from 'vue'
  import { useStore } from "vuex";
  
  const store = useStore();

  const IMAGE_URL = ref("https://image.tmdb.org/t/p/w500");
  
  onMounted(async () => {
    await store.dispatch("speechRecognation/getList");
  });

  const formatterShorten = (value, length) => {
    return value.slice(0, length) + "...";
  }

  const img = (value) => {
    return value == '' ? `${IMAGE_URL.value}/a` : `${IMAGE_URL.value}${value}`;
  }

  const search = computed(() => {
    return store.getters["speechRecognation/getSearch"];
  });

  const data = computed(() => {
    return store.getters["speechRecognation/getResult"];
  });

  const detail = (id) => {
    window.location.href = `#/detail/${id}`;
  }
</script>