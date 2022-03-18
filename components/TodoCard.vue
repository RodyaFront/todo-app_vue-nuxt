<template>
  <div :class="`todo__card ${todo.done ? 'done' : ''}`" @mousedown="tapHandler">
    <div>
      <div class="todo__title">{{ todo.title }}</div>
      <div class="todo__content">{{ todo.content }}</div>
      <div class="todo__sub-tasks" v-if="todo.subtasks">
        <TodoCardSubTask
          v-for="task in todo.subtasks"
          :key="task.id"
          :data="task"
        />
      </div>
    </div>
    <div class="todo__buttons">
      <div>
        <vs-tooltip left>
          <vs-switch success v-model="todo.done" />
          <template #tooltip> Are we done? </template>
        </vs-tooltip>
      </div>
      <div>
        <vs-button circle warn icon @click="$emit('edit', todo)">
          <i class="bx bx-edit-alt"></i>
        </vs-button>
        <vs-button circle danger icon @click="handleDeleteTodo(todo.id)">
          <i class="bx bx-x"></i>
        </vs-button>
      </div>
    </div>
  </div>
</template>

<script>
import TodoCardSubTask from '~/components/TodoCardSubTask'
export default {
  name: 'TodoCard',
  components: {
    TodoCardSubTask,
  },
  props: {
    cardData: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    todo: null,
    lastTap: null,
    timeout: null,
  }),
  beforeMount() {
    this.todo = this.cardData
  },
  methods: {
    handleDeleteTodo(id) {
      this.$emit('delete', id)
    },
    tapHandler(e) {
      const curTime = new Date().getTime()
      const tapLen = curTime - this.lastTap
      if (tapLen < 200 && tapLen > 0) {
        this.todo.done = !this.todo.done
        e.preventDefault()
      } else {
        this.timeout = setTimeout(() => {
          clearTimeout(this.timeout)
        }, 200)
      }
      this.lastTap = curTime
    },
  },
}
</script>
