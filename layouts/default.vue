<template>
  <div class="container">
    <Nuxt />
  </div>
</template>

<script>
export default {
  methods: {
    openNotification({ text, title, color = 'primary' }) {
      this.$vs.notification({
        position: 'top-right',
        title,
        text,
        color,
      })
    },
  },
  computed: {
    getMessage() {
      return this.$store.getters.message
    },
  },
  watch: {
    getMessage(data) {
      this.openNotification(data)
    },
  },
}
</script>
