<template>
  <a-modal
    :open="open"
    :title="'Add user'"
    @ok="submitForm"
    @cancel="handleCancel"
    :confirm-loading="loading"
    destroy-on-close
  >
    <a-form
      ref="formRef"
      layout="vertical"
      :model="formState"
      :validate-trigger="['submit']"
    >
      <a-form-item
        label="Name"
        :name="['firstName']"
        :rules="[{ required: true, message: 'Enter name' }]"
      >
        <a-input v-model:value="formState.firstName" />
      </a-form-item>

      <a-form-item
        label="Last name"
        :name="['lastName']"
        :rules="[{ required: true, message: 'Enter last name' }]"
      >
        <a-input v-model:value="formState.lastName" />
      </a-form-item>

      <a-form-item
        label="Email"
        :name="['email']"
      >
        <a-input disabled v-model:value="formState.email" />
      </a-form-item>

      <a-form-item
        label="Password"
        :name="['password']"
        :rules="[{ required: true, message: 'Enter password' }]"
      >
        <a-input-password v-model:value="formState.password" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts" setup>
import { ref, watch, nextTick, reactive } from 'vue'
import { message } from 'ant-design-vue'

interface FormState {
  firstName: string
  lastName: string
  email: string
  password: string
}

const props = defineProps<{
  open: boolean
  loading: boolean
  user: FormState | null
}>()

const emit = defineEmits(['update:open', 'user-added'])

const formRef = ref()
const formState = reactive<FormState>({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
})

// Quando abrir o modal, preencher os campos
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      formState.firstName = props.user?.firstName || ''
      formState.lastName = props.user?.lastName || ''
      formState.email = props.user?.email || ''
      formState.password = ''
    }
  }
)

// Gerar email automaticamente ao preencher nome + sobrenome
watch(
  () => [formState.firstName, formState.lastName],
  async ([firstName, lastName]) => {
    if (firstName && lastName && !props.user) {
      try {
        const response = await fetch('http://localhost:8080/generate-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ firstName, lastName })
        })

        if (!response.ok) throw new Error('Erro ao gerar e-mail')

        const data = await response.json()
        formState.email = data.email
      } catch (error) {
        console.error('Erro ao gerar email automático:', error)
      }
    }
  }
)

const handleCancel = () => {
  emit('update:open', false)
}

const submitForm = async () => {
  await nextTick()
  try {
    await formRef.value.validate()

    const response = await fetch('http://localhost:8080/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formState)
    })

    if (!response.ok) throw new Error('Error creating user')

    message.success('User added successfully!')
    emit('update:open', false)
    emit('user-added')
  } catch (err) {
    console.error('Error creating user:', err)
  }
}
</script>
