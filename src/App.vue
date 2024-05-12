<!-- Importando a página LogIn -->

<template>
  <div id="app">
    <LogIn />
  </div>
</template>

<script>
import LogIn from "./components/LogIn.vue";

export default {
  name: "app",

  components: {
    LogIn,
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap");

body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: "Poppins", sans-serif;
  font-size: 1.6rem;
  color: #222;
  background-image: linear-gradient(to right, #434343 0%, black 100%);
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
