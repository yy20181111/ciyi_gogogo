<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {

 mounted (){
    // 文字不允许被选中
    document.onselectstart = function(event){
    event.returnValue = false;
    }
  }
  
};
</script>

<style lang='less' scoped>
#app{
  width: 100%;
  height: 100%;
  background-color: #eee;
}
</style>
