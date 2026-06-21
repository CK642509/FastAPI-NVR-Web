<script setup lang="ts"></script>

<template>
  <v-app>
    <v-app-bar color="surface" flat density="comfortable">
      <template #prepend>
        <v-icon icon="mdi-cctv" class="ml-2" />
      </template>
      <v-app-bar-title class="font-weight-bold">FastAPI-NVR</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
