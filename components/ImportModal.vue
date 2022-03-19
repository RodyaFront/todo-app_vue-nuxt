<template>
  <vs-dialog
    v-model="dialog"
    class="import-todo-modal"
    prevent-close
    @close="closeModal"
  >
    <template #header>
      <h4 class="not-margin">Import <b>TODO's</b></h4>
    </template>

    <div class="import-todo-modal__form">
      <vs-input
        v-model="importQuery"
        label="Query"
        placeholder="Enter import query"
        name="importQuery"
        @blur="handleInputBlur"
      >
        <template
          v-if="$v.importQuery.$dirty && !$v.importQuery.required"
          slot="message-danger"
        >
          Title field must be not empty
        </template>
      </vs-input>
    </div>

    <template #footer>
      <div class="footer-dialog flex">
        <vs-button block border @click="exportTodos"> Export</vs-button>
        <vs-button :disabled="!isFormValid" block @click="importTodos">
          Import
        </vs-button>
      </div>
    </template>
  </vs-dialog>
</template>

<script>
import required from 'vuelidate/lib/validators/required'

export default {
  name: 'ImportModal',
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    dialog: false,
    isFormValid: false,
    importQuery: '',
  }),
  validations: {
    importQuery: { required },
  },
  watch: {
    active(value) {
      this.dialog = value
    },
    importQuery() {
      this.handleFormDataInvalid()
    },
  },
  methods: {
    exportTodos() {
      const parentTodos = JSON.stringify(this.modelValue)
      const error = this.copyTextToClipboard(parentTodos)
      if (error) {
        return this.$store.commit('setMessage', {
          title: 'Todo',
          text: 'Something is wrong. Failed to copy.',
          color: 'danger',
        })
      }
      this.$store.commit('setMessage', {
        title: 'Todo',
        text: "Todo's query successfully copied! 😄",
        color: 'success',
      })
      this.closeModal()
    },
    handleInputBlur(e) {
      const { name } = e.target
      this.$v[name].$touch()
      this.handleFormDataInvalid()
    },
    closeModal() {
      this.clearTodoFormData()
      this.$emit('closeModal')
    },
    clearTodoFormData() {
      this.importQuery = ''
      const { importQuery } = this.$v
      importQuery.$reset()
    },
    importTodos() {
      try {
        const parsed = JSON.parse(this.importQuery)
        this.$emit('rewriteTodo', parsed)
        this.$store.commit('setMessage', {
          title: 'Todo',
          text: "Hooray, here are your new todo's! 😄",
          color: 'success',
        })
      } catch (e) {
        this.$store.commit('setMessage', {
          title: 'Todo',
          text: 'Failed to import 😢',
          color: 'danger',
        })
      }
      this.closeModal()
    },
    handleFormDataInvalid() {
      const { importQuery } = this.$v
      if (importQuery.required) {
        return (this.isFormValid = true)
      }
      this.isFormValid = false
    },
    copyTextToClipboard(text) {
      console.log('this')
      const textArea = document.createElement('textarea')
      textArea.style.position = 'fixed'
      textArea.style.top = 0
      textArea.style.left = 0
      textArea.style.width = '2em'
      textArea.style.height = '2em'
      textArea.style.padding = 0
      textArea.style.border = 'none'
      textArea.style.outline = 'none'
      textArea.style.boxShadow = 'none'
      textArea.style.background = 'transparent'
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        document.execCommand('copy')
      } catch (err) {
        return true
      }
      document.body.removeChild(textArea)
      return false
    },
  },
}
</script>
