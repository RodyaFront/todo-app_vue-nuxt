<template>
  <vs-dialog width="550px" not-center v-model="dialog" @close="closeModal">
    <template #header>
      <h4 class="not-margin">Are you sure?</h4>
    </template>

    <div class="con-content">
      <p>Are you sure you want to delete this todo?</p>
    </div>

    <template #footer>
      <div class="modal__footer">
        <vs-button @click="$emit('accept')" transparent> Ok </vs-button>
        <vs-button @click="$emit('close')" dark transparent> Cancel </vs-button>
      </div>
    </template>
  </vs-dialog>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    active(value) {
      this.dialog = value
    },
  },
  data: () => ({
    dialog: false,
  }),
  methods: {
    closeModal() {
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss">
.modal {
  &__footer {
    display: flex;
    gap: 20px;
    justify-content: flex-end;
  }
}
</style>
