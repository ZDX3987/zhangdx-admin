<template>
  <div class="hp-bg" :style="bg_img[0]"></div>
</template>

<script>
export default {
  name: "Bg",
  data() {
    return {
      bg_img: ["background-image: url('https://file.zhangdx.cn/login-bg.jpg');"],
      img: ['http://file.zhangdx.cn/hp-bg.jpg', '/static/images/hp-bg.jpg']
    };
  }
};
</script>

<style>
.hp-bg {
  background-size: cover;
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  z-index: -100;
}
</style>
