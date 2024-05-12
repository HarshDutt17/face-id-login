<template>
  <article>
    <!-- Slide activates or deactivates the transition between the login and sign-up forms -->
    <div class="wrapper" :class="{ 'slide-enter-signup': slide }">
      <div class="overlay-wrapper">
        <div class="overlay">
          <div class="overlay-left">
            <h2>Already have an account?</h2>
            <p>Sign in with your Face ID</p>
            <!-- @click=slide activates or deactivates the transition between the login and sign-up forms -->
            <button class="invert" id="login" @click="slide = !slide">
              Capture Face ID
            </button>
          </div>
          <div class="overlay-right">
            <h2>New look? Can't recognize face?</h2>
            <p>Login with credentials</p>
            <button class="invert" id="sign-up" @click="slide = !slide">
              Login In
            </button>
          </div>
        </div>
      </div>
      <form class="login" action="#">
        <h2>TimelessVisage</h2>
        <div>Sign in with your Face ID</div>
        <!-- <div style="position: relative;">
          <video id="dte-video" />
          <canvas id="dte-canvas" style="position: absolute; top:0 ; left:0;" />
        </div> -->
        <!-- <input type="text" placeholder="Name" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" /> -->
        <button @click.prevent="() => capture = true">Capture Face ID</button>
      </form>
      <form class="sign-up" action="#">
        <h2>TimelessVisage</h2>
        <div>To continue, log in to TimelessVisage</div>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <a href="#">Forgot password?</a>
        <button>Sign in</button>
      </form>
    </div>

    <div class="modal" :style="{ display: capture ? 'flex' : 'none' }">
      <button @click.prevent="() => capture = false"
        style="height: 40px; margin:0px; padding: 0px; background-color: transparent; border: none; color: red;; position: absolute; right: 20px">x</button>
      <div style="position: relative; margin-top: 40px; margin-bottom: 10px; align-self: center ">
        <video id="dte-video" height="400px" />
        <canvas id="dte-canvas" style="position: absolute; top:0 ; left:0;" />
      </div>
      <button @click.prevent="handleCapture()"
        style="width: max-content; align-self: center !important; margin-top: 20px;">Capture</button>
    </div>
  </article>
</template>
<!-- JavaScript activates or deactivates slide transition effect-->

<script>
import { dteSDK } from "../js/modern.js";

let faceDetection;
export default {
  components: {
  },
  data: () => {
    return {
      slide: false,
      capture: false,
    };
  },
  mounted() {
    const config = {
      fastappEndpoint: "",
      LivenessEndpoint: "",
      faceDetection: {
        snapshotLength: 10,
        enableLogs: true,
      }
    }
    let sdk = new dteSDK(config);
    console.log(sdk)

    faceDetection = sdk.initFaceDetection();
  },
  methods: {
    handleCapture() {
      console.log(faceDetection.getDetectedFace())
    }
  },
};
</script>

<style lang="scss" scoped>
.modal {
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 900;
  top: 10%;
  width: 900px;
  height: 600px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2), 0 10px 10px rgba(0, 0, 0, 0.2);
  background: linear-gradient(to bottom, #efefef, #ccc);
}

.wrapper {
  position: relative;
  width: 868px;
  height: 480px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2), 0 10px 10px rgba(0, 0, 0, 0.2);
  background: linear-gradient(to bottom, #efefef, #ccc);

  .overlay-wrapper {
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: transform 0.5s ease-in-out;
    z-index: 100;
  }

  .overlay {
    position: relative;
    left: -100%;
    height: 100%;
    width: 200%;
    background: linear-gradient(90deg,
        rgba(248, 73, 27, 1) 0%,
        rgba(241, 47, 63, 1) 50%,
        rgba(220, 24, 96, 1) 100%);
    color: #fff;
    transform: translateX(0);
    transition: transform 0.5s ease-in-out;
  }

  /* @mixin include for left and right overlays */

  @mixin overlays($property) {
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
    padding: 70px 40px;
    width: calc(50% - 80px);
    height: calc(100% - 140px);
    text-align: center;
    transform: translateX($property);
    transition: transform 0.5s ease-in-out;
  }

  .overlay-left {
    @include overlays(-20%);
  }

  .overlay-right {
    @include overlays(0);
    right: 0;
  }
}

h2 {
  margin: 0;
}

p {
  margin: 20px 0 30px;
}

a {
  color: #222;
  text-decoration: none;
  margin: 15px 0;
  font-size: 1rem;
}

button {
  border-radius: 20px;
  border: 1px solid #fff;
  background-color: rgba(220, 24, 96, 1);
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  padding: 10px 40px;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.1s ease-in;

  &:active {
    transform: scale(0.9);
  }

  &:focus {
    outline: none;
  }
}

button.invert {
  background-color: transparent;
  border-color: #fff;
}

form {
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  padding: 90px 60px;
  width: calc(50% - 120px);
  height: calc(100% - 180px);
  text-align: center;
  background: linear-gradient(to bottom, #efefef, #ccc);
  transition: all 0.5s ease-in-out;

  div {
    font-size: 1rem;
  }

  input {
    background-color: #eee;
    border: none;
    padding: 8px 15px;
    margin: 6px 0;
    width: calc(100% - 30px);
    border-radius: 15px;
    border-bottom: 1px solid #ddd;
    /* color transition effect on form fields*/
    overflow: hidden;

    &:focus {
      outline: none;
      background-color: #fff;
    }
  }
}

.login {
  left: 0;
  z-index: 2;
}

.sign-up {
  left: 0;
  z-index: 1;
  opacity: 0;
}

.slide-enter-signup {
  .login {
    transform: translateX(100%);
  }

  .sign-up {
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
    animation: show 0.5s;
  }

  .overlay-wrapper {
    transform: translateX(-100%);
  }

  .overlay {
    transform: translateX(50%);
  }

  .overlay-left {
    transform: translateX(0);
  }

  .overlay-right {
    transform: translateX(20%);
  }
}

@keyframes show {
  0% {
    opacity: 0;
    z-index: 1;
  }

  49% {
    opacity: 0;
    z-index: 1;
  }

  50% {
    opacity: 1;
    z-index: 10;
  }
}
</style>

