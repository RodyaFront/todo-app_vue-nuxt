<template>
  <vs-dialog
    v-model="dialog"
    class="edit-todo-modal"
    @close="$emit('closeModal')"
  >
    <template #header>
      <h4 class="not-margin">Edit <b>TODO</b></h4>
    </template>

    <div class="add-todo-modal__form">
      <vs-input
        v-model="editTitle"
        label="Todo title"
        placeholder="Enter title"
        name="editTitle"
        @blur="handleEditInputBlur"
      >
        <template
          v-if="$v.editTitle.$dirty && !$v.editTitle.required"
          slot="message-danger"
        >
          Title field must be not empty
        </template>
      </vs-input>
      <vs-input
        v-model="editContent"
        label="Todo content"
        placeholder="Enter something..."
        name="editContent"
        @blur="handleEditInputBlur"
      >
        <template
          v-if="$v.editContent.$dirty && !$v.editContent.required"
          slot="message-danger"
        >
          Content field must be not empty
        </template>
      </vs-input>
    </div>

    <template #footer>
      <div class="footer-dialog">
        <vs-button
          :disabled="!isEditFormValid"
          block
          @click="handleEditTodoSave"
        >
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
    formData: {
      type: Object,
      default: null,
    },
  },
  validations: {
    editTitle: { required },
    editContent: { required },
  },
  data: () => ({
    editTitle: '',
    editContent: '',
    dialog: false,
    editedTodo: {},
    isEditFormValid: false,
  }),
  watch: {
    active(value) {
      this.dialog = value
    },
    formData(data) {
      const { title, content } = data
      this.editTitle = title
      this.editContent = content
      this.editedTodo = data
      this.handleEditFormDataInvalid()
    },
    editTitle() {
      this.handleEditFormDataInvalid()
    },
    editContent() {
      this.handleEditFormDataInvalid()
    },
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
    },
    clearEditTodoFormData() {
      this.editTitle = ''
      this.editContent = ''
      const { editTitle, editContent } = this.$v
      editTitle.$reset()
      editContent.$reset()
    },
    handleEditFormDataInvalid() {
      const { editTitle, editContent } = this.$v
      if (editTitle.required && editContent.required) {
        return (this.isEditFormValid = true)
      }
      this.isEditFormValid = false
    },
    handleEditInputBlur(e) {
      const { name } = e.target
      this.$v[name].$touch()
      this.handleEditFormDataInvalid()
    },
    handleEditTodoSave() {
      const editedData = Object.assign(this.editedTodo, {
        title: this.editTitle,
        content: this.editContent,
      })
      this.$emit('saveData', editedData)
      this.clearEditTodoFormData()
      this.closeModal()
    },
  },
}
</script>
