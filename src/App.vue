<script>
export default {
  name: 'App',
};
</script>

<template>
  <div class="w-screen">
    <div>
      <div class="container">
        <div class="flex gap-5">
          <router-link to="/">Form</router-link>
          <router-link to="/inputs">Inputs</router-link>
          <router-link to="/date-pickers">Date Pickers</router-link>
        </div>
      </div>
    </div>
    <router-view></router-view>
    <div tabindex="0"></div>
  </div>
</template>
