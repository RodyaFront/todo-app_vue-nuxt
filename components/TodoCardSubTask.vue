<template>
  <div class="sub-task__item">
    <div class="sub-task__content">
      <div class="sub-task__title">{{ data.title }}</div>
      <div class="sub-task__content">{{ data.content }}</div>
    </div>
    <div class="sub-task__tasks" v-if="data.subtasks">
      <TodoCardSubTask
        v-for="task in data.subtasks"
        :key="task.id"
        :data="task"
      />
    </div>
  </div>
</template>

<script>
import TodoCardSubTask from '~/components/TodoCardSubTask'
export default {
  name: 'TodoCardSubTask',
  components: {
    TodoCardSubTask,
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
}
</script>
