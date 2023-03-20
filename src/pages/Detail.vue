<template>
  <q-page v-if="!loading" class="q-mx-lg q-my-lg row">
    <div class="col-md-3 col-sm-12">      
      <q-card class="my-card">
        <q-img :src="`${IMAGE_URL}${data.poster_path}`">
        </q-img>
      </q-card>
    </div>
    <div class="col-md-9 col-sm-12 q-px-sm"> 
      <div class="q-my-md">
        <div class="text-h2 text-weight-bold q-mb-md">
          {{ data.title }}
          <span color="purple-12">{{ data.release_date ?`(${formatterYear(data.release_date)})` : '' }}</span>
        </div>
        <q-badge
          v-for="item in data.genres"
          class="q-mx-xs"
          color="primary" 
          outline 
          :key="item.id"
          :label="item.name" 
        />
      </div>     
      <div class="q-mb-sm text-caption text-subtitle1" style="color:black;font-style: italic;opacity: 0.7;font-size: 15px;">{{ data.tagline }}</div>
      <div class="q-mb-md">
        <div class="text-h6">Overview</div>
        <div class="text-body2">{{ data.overview }}</div>
      </div>
      <div class="q-mb-md">
        <div class="text-h6">Series Cast</div>
        <div class="row">
          <div 
            v-for="item in dataCast"
            :key="item.id"
            class="col-md-2 col-sm-12 q-pa-sm"
          >
            <q-card class="my-card">
              <q-img :src="`${IMAGE_URL}${item.profile_path}`">
                <div class="absolute-bottom text-body2">
                  {{item.name}}
                </div>
              </q-img>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
  <q-page v-else class="q-mx-lg q-my-lg row">
    Loading . . .
  </q-page>
</template>

<script>
  export default {
    name: "IndexPage",
  };
</script>

<script setup>
  import { useQuasar } from 'quasar'
  import { defineComponent, ref, computed, onMounted, onUpdated } from 'vue'
  import { useRoute } from 'vue-router'
  import { useStore } from "vuex";
  
  const $q = useQuasar()
  const store = useStore();
  const route = useRoute()

  const IMAGE_URL = ref("https://image.tmdb.org/t/p/w500");
  const loading = ref(true);
  
  onMounted(async () => {
    $q.loading.show({ message: 'Tunggu Dulu ya..'})
    loading.value = true;
    await store.dispatch("speechRecognation/getDetailMovie", route.params.id);
    $q.loading.hide()
    loading.value = false;
  });

  const data = computed(() => {
    return store.getters["speechRecognation/getDetail"];
  });

  const dataCast = computed(() => {
    return store.getters["speechRecognation/getCast"];
  });

  const formatterYear = (value) => {
    return value.split("-")[0];
  };
</script>