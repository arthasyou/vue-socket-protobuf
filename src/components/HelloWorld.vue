<template>
  <v-container>
   <v-btn @click="test">
     test
   </v-btn>
  </v-container>
</template>

<script>
  export default {
    name: 'HelloWorld',

    data: () => ({
      
    }),

    methods: {
      test() {
        window.net.send(1001, {
          aa: "11"
        })
      }
    }
  }
</script>

