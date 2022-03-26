<template>
  <div class="main-page">
    <div class="container">
      <div class="todo">
        <div class="todo__wrapper">
          <div class="todo__header">
            <div class="todo__panel">
              <vs-button @click="addTodoDialog = !addTodoDialog">
                <i class="bx bx-edit-alt"></i>
                Add Todo
              </vs-button>
              <vs-button @click="importDialog = !importDialog" border>
                <i class="bx bx-import"></i>
                Import todo's
              </vs-button>
            </div>
            <div class="todo__search">
              <vs-input
                v-model="searchQuery"
                placeholder="Search"
                icon
                :loading="searchLoading"
                type="search"
              >
                <template #icon>
                  <i class="bx bx-search"></i>
                </template>
              </vs-input>
            </div>
          </div>
          <transition-group
            v-if="todos.length && filteredTodos && filteredTodos.length === 0"
            name="todos"
            tag="div"
            class="todo__list"
          >
            <TodoCard
              v-for="todo in todos"
              :key="todo.id"
              :card-data="todo"
              @delete="handleDeleteTodo"
              @edit="handleEditTodo"
            />
          </transition-group>
          <transition-group
            v-if="filteredTodos && filteredTodos.length"
            name="todos"
            tag="div"
            class="todo__list"
          >
            <TodoCard
              v-for="todo in filteredTodos"
              :key="todo.id"
              :card-data="todo"
              @delete="handleDeleteTodo"
              @edit="handleEditTodo"
            />
          </transition-group>
          <div v-if="!todos.length" class="todo__empty-message">
            Is there someone here?...
          </div>
          <div class="todo__footer">
            <transition name="todos">
              <small>{{ getTip }}</small>
            </transition>
          </div>
        </div>
      </div>
      <ImportModal
        :modelValue="todos"
        :active="importDialog"
        @rewriteTodo="todos = $event"
        @closeModal="importDialog = false"
      />
      <ConfirmModal
        :active="confirmDialog"
        @closeModal="confirmDialog = false"
        @accept="handleConfirmDeleteTodo"
      />
      <AddTodoModal
        :active="addTodoDialog"
        @closeModal="addTodoDialog = false"
        @saveData="handleSaveNewTodo"
      />
      <EditTodoModal
        :active="editTodoDialog"
        :form-data="editedTodo"
        @closeModal="handleCloseEditModal"
        @saveData="handleSaveEditedTodo"
      />
      <nuxt-link to="/home" class="hp-link"
        >About me <i class="bx bx-info-circle"></i
      ></nuxt-link>
    </div>
  </div>
</template>

<script>
import EditTodoModal from '~/components/EditTodoModal'
import AddTodoModal from '~/components/AddTodoModal'
import ConfirmModal from '~/components/ConfirmModal'
import ImportModal from '~/components/ImportModal'
import TodoCard from '~/components/TodoCard'
import { SESSION_STORAGE_NAMES, MOCK_TODOS } from '~/utils/defaultData'

export default {
  components: {
    EditTodoModal,
    AddTodoModal,
    TodoCard,
    ConfirmModal,
    ImportModal,
  },
  data: () => ({
    todos: MOCK_TODOS,
    searchQuery: '',
    filteredTodos: [],
    addTodoDialog: false,
    editTodoDialog: false,
    confirmDialog: false,
    importDialog: false,
    editedTodo: {},
    searchTimeout: null,
    searchLoading: false,
    tips: [
      'Double tap on a card if u want to set it done. 🙂',
      'If you need your todos in another application, you can export them. 😃',
      "Don't forget to clear completed tasks. 😄",
    ],
    tipCounter: 0,
  }),
  computed: {
    getTip() {
      return this.tips[this.tipCounter]
    },
  },
  watch: {
    todos(value) {
      window.sessionStorage.setItem(
        SESSION_STORAGE_NAMES.TODOS,
        JSON.stringify(value)
      )
    },
    searchQuery(value) {
      window.sessionStorage.setItem(
        SESSION_STORAGE_NAMES.TODO_FILTER_QUERY_TEXT,
        value
      )
      if (value === '') {
        return this.setFilteredTodos([])
      }
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.searchLoading = true
        this.filterTodoByQuery(value)
        setTimeout(() => (this.searchLoading = false), 1000)
      }, 500)
    },
  },
  beforeMount() {
    const sessionTodos = window.sessionStorage.getItem(
      SESSION_STORAGE_NAMES.TODOS
    )
    const todoQueryText = window.sessionStorage.getItem(
      SESSION_STORAGE_NAMES.TODO_FILTER_QUERY_TEXT
    )
    if (sessionTodos) {
      this.todos = JSON.parse(sessionTodos)
    }
    if (todoQueryText && todoQueryText !== '') {
      this.searchQuery = todoQueryText
    }
  },
  mounted() {
    setInterval(this.changeTip, 7000)
    window.onbeforeunload = () =>
      window.sessionStorage.setItem(
        SESSION_STORAGE_NAMES.TODOS,
        JSON.stringify(this.todos)
      )
  },
  methods: {
    changeTip() {
      this.tipCounter++
      if (this.tipCounter > this.tips.length - 1) {
        return (this.tipCounter = 0)
      }
    },
    handleDeleteTodo(id) {
      this.confirmDialog = true
      this.idOfTodoOnDeleting = id
    },
    handleConfirmDeleteTodo() {
      this.todos = this.todos.filter(
        (todo) => todo.id !== this.idOfTodoOnDeleting
      )
      this.$store.commit('setMessage', {
        title: 'Todo',
        text: 'Todo deleted!',
        color: 'warn',
      })
      this.confirmDialog = false
      this.idOfTodoOnDeleting = null
    },
    filterTodoByQuery(string = '') {
      const query = string.toLowerCase()
      const filtered = this.todos.filter((todo) =>
        todo.title.toLowerCase().includes(query)
      )
      this.setFilteredTodos(filtered)
    },
    setFilteredTodos(data) {
      this.filteredTodos = data
    },
    handleEditTodo(data) {
      this.editTodoDialog = true
      this.editedTodo = data
    },
    handleSaveEditedTodo(editedTodo) {
      const idx = this.todos.findIndex((todo) => todo.id === editedTodo.id)
      this.todos[idx] = editedTodo
    },
    handleSaveNewTodo(newTodo) {
      this.todos.push(newTodo)
    },
    handleCloseEditModal() {
      this.editTodoDialog = false
      this.editedTodo = ''
    },
  },
}
</script>

<style lang="scss">
.todos-enter-active {
  opacity: 1;
}

.todos-leave-active {
  opacity: 0;
}
</style>
