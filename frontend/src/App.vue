<template>
  <div style="padding: 24px">
    <a-card bordered>
      <template #title>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>Registered Users</span>
          <a-button type="primary" @click="showAddUserModal">New user</a-button>
        </div>
      </template>

      <a-table
        :columns="columns"
        :data-source="users"
        :loading="loading"
        row-key="_id"
        :pagination="{ pageSize: 5 }"
      />

      <!-- Modal de criação -->
      <ModalAddUser
        :open="isAddModalVisible"
        :loading="loading"
        :user="selectedUser"
        @update:open="val => isAddModalVisible = val"
        @user-added="handleUserAdded"
      />

      <!-- Modal de edição -->
      <ModalEditUser
        :open="isEditModalVisible"
        :loading="loading"
        :user="selectedUser"
        @update:open="val => isEditModalVisible = val"
        @user-edited="handleUserChanged"
      />
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted, h, nextTick } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import ModalAddUser from './components/ModalAddUser.vue'
import ModalEditUser from './components/ModalEditUser.vue'

const users = ref([])
const loading = ref(false)
const isAddModalVisible = ref(false)
const isEditModalVisible = ref(false)
const selectedUser = ref(null)

// Abrir modal de adicionar
const showAddUserModal = () => {
  selectedUser.value = null
  isAddModalVisible.value = true
}

const handleUserAdded = () => {
  fetchUsers()
}

// Abrir modal de editar
const showEditModal = (user) => {
  console.log('Editando usuário ID:', user._id);

  selectedUser.value = user
  isEditModalVisible.value = true
}

// Exemplo de deletar (ainda a implementar)
const showDeleteModal = (user) => {
  Modal.confirm({
    title: `Delete user ${user.firstName}?`,
    content: 'This action cannot be undone.',
    okText: 'Yes',
    cancelText: 'No',
    onOk: async () => {
      try {
        const response = await fetch(`http://localhost:8080/users/${user._id}`, {
          method: 'DELETE'
        })

        if (!response.ok) throw new Error('Error deleting user')

        message.success('User successfully deleted!')
        fetchUsers()  // Atualiza a lista
      } catch (error) {
        message.error('Error deleting user: ' + error.message)
      }
    }
  })
}


// Buscar usuários
const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await fetch('http://localhost:8080/users')
    users.value = await response.json()
  } catch (error) {
    console.error('Error searching for users:', error)
  } finally {
    loading.value = false
  }
}

// Atualiza lista após salvar ou editar
const handleUserChanged = () => {
  fetchUsers()
}

// Colunas da tabela
const columns = [
  {
    title: 'Name',
    key: 'name',
    customRender: ({ record }) => `${record.firstName || record.username}`,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Actions',
    key: 'actions',
    customRender: ({ record }) =>
      h('div', { style: 'display: flex; gap: 10px;' }, [
        h(EditOutlined, {
          style: { color: 'blue', cursor: 'pointer' },
          onClick: () => showEditModal(record),
        }),
        h(DeleteOutlined, {
          style: { color: 'red', cursor: 'pointer' },
          onClick: () => showDeleteModal(record),
        }),
      ]),
  },
]

onMounted(() => {
  fetchUsers()
})
</script>
