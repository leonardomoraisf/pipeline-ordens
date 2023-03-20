<template>
  <div class="">
    <BoardKanban></BoardKanban>
  </div>
</template>

<script>
// @ is an alias to /src
import BoardKanban from "@/components/BoardKanban";


export default {
  name: "HomeView",
  components: {
    BoardKanban,
  },
};
</script>
