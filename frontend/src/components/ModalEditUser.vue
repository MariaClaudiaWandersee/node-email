<template>
  <a-modal
    :open="open"
    title="Edit user"
    @ok="submitForm"
    @cancel="handleCancel"
    :confirm-loading="loading"
    destroy-on-close
  >
    <a-form
      ref="formRef"
      :model="formState"
      layout="vertical"
      :validate-trigger="['submit']"
    >
      <a-form-item
        label="Name"
        name="firstName"
        :rules="[]"
      >
        <a-input v-model:value="formState.firstName" />
      </a-form-item>

      <a-form-item
        label="Last name"
        name="lastName"
        :rules="[]"
      >
        <a-input v-model:value="formState.lastName" />
      </a-form-item>

      <a-form-item
        label="Email"
        name="email"
        :rules="[]"
      >
        <a-input disabled v-model:value="formState.email" />
      </a-form-item>

      <a-form-item
        label="Password"
        name="password"
        :rules="[]"
      >
        <a-input-password v-model:value="formState.password" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, nextTick } from 'vue'
import { message } from 'ant-design-vue'

// Tipagem do formulário
interface FormState {
  firstName: string
  lastName: string
  email: string
  password: string
}

// Props
const props = defineProps<{
  open: boolean
  loading: boolean
  user: {
    _id: string
    firstName: string
    lastName: string
    email: string
    password?: string
  } | null
}>()

// Emits
const emit = defineEmits(['update:open', 'user-edited'])

const formRef = ref()
const formState = reactive<FormState>({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
})

// Preenche os campos quando o usuário é passado
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen && props.user) {
      formState.firstName = props.user.firstName
      formState.lastName = props.user.lastName
      formState.email = props.user.email
      formState.password = props.user.password || ''
    }
  },
  { immediate: true }
)

// Fecha a modal
const handleCancel = () => {
  emit('update:open', false)
}

// Submete o formulário para edição
const submitForm = async () => {
  try {
    await formRef.value.validate()

    const response = await fetch(`http://localhost:8080/users/${props.user._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formState)
    })

    if (!response.ok) throw new Error('Error updating')

    message.success('User updated successfully!')

    emit('update:open', false)
    emit('user-edited')
  } catch (err) {
    console.error('Error updating user:', err)
  }
}
</script>
