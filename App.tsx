import { ElButton, ElCard, ElInput } from "element-plus"
import { defineComponent, ref } from "vue"

export const App = defineComponent({
  setup() {
    let value = ref('')
    return () => <>
      <ElInput v-model={value.value} ></ElInput>
      {value.value}
    </>
  },
})
