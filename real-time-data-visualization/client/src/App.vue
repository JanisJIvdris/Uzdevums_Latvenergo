<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import {
  defineComponent, onMounted, ref, watch,
} from 'vue';
import webSocketService from '@/services/WebSocketService';

export default defineComponent({
  name: 'App',
  setup() {
    // Reactive reference to track token
    const token = ref(localStorage.getItem('token'));

    // Watch for changes in the token
    watch(
      () => localStorage.getItem('token'),
      (newToken) => {
        token.value = newToken;
        if (newToken) {
          webSocketService.connect();
        }
      },
      { immediate: true },
    );

    onMounted(() => {
      if (token.value) {
        webSocketService.connect();
      }
    });

    return {};
  },
});
</script>

<style>
/* Global styles can be inserted here*/
</style>
