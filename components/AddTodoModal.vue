<template>
  <vs-dialog
    v-model="dialog"
    class="add-todo-modal"
    @close="closeModal"
    prevent-close
  >
    <template #header>
      <h4 class="not-margin">Add <b>TODO</b></h4>
    </template>

    <div class="add-todo-modal__form">
      <vs-input
        v-model="title"
        label="Todo title"
        placeholder="Enter title"
        name="title"
        @blur="handleInputBlur"
      >
        <template
          v-if="$v.title.$dirty && !$v.title.required"
          slot="message-danger"
        >
          Title field must be not empty
        </template>
      </vs-input>
      <vs-input
        v-model="content"
        label="Todo content"
        placeholder="Enter something..."
        name="content"
        @blur="handleInputBlur"
      >
        <template
          v-if="$v.content.$dirty && !$v.content.required"
          slot="message-danger"
        >
          Content field must be not empty
        </template>
      </vs-input>
    </div>

    <template #footer>
      <div class="footer-dialog">
        <vs-button :disabled="!isFormValid" block @click="addTodo">
          Save
        </vs-button>
      </div>
    </template>
  </vs-dialog>
</template>

<script>
import required from 'vuelidate/lib/validators/required'

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
    title() {
      this.handleFormDataInvalid()
    },
    content() {
      this.handleFormDataInvalid()
    },
  },
  data: () => ({
    title: '',
    content: '',
    subtasks: [],
    isFormValid: false,
    dialog: false,
  }),
  validations: {
    title: { required },
    content: { required },
  },
  methods: {
    closeModal() {
      this.clearTodoFormData()
      this.$emit('closeModal')
    },
    clearTodoFormData() {
      this.title = ''
      this.content = ''
      const { title, content } = this.$v
      title.$reset()
      content.$reset()
    },
    handleInputBlur(e) {
      const { name } = e.target
      this.$v[name].$touch()
      this.handleFormDataInvalid()
    },
    handleFormDataInvalid() {
      const { title, content } = this.$v
      if (title.required && content.required) {
        return (this.isFormValid = true)
      }
      this.isFormValid = false
    },
    addTodo() {
      const newTodo = {
        id: new Date().getTime(),
        title: this.title,
        content: this.content,
        done: false,
      }
      this.clearTodoFormData()
      this.closeModal()
      this.$emit('saveData', newTodo)
      this.$store.commit('setMessage', {
        title: 'Todo',
        text: 'New todos successfully created!',
        color: 'success',
      })
    },
  },
}
</script>
