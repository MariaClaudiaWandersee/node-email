<template>
  <a-modal
    title="Confirmar exclusão"
    :open="visible"
    :confirm-loading="loading"
    ok-text="Excluir"
    ok-type="danger"
    @ok="onOk"
    @cancel="onCancel"
    centered
  >
    Tem certeza que deseja excluir
    <strong>{{ userName }}</strong>?
  </a-modal>
</template>

<script setup>
import { defineProps, defineEmits, watch, ref } from 'vue';

const props = defineProps({
  visible: Boolean,
  loading: Boolean,
  userName: String,
});

const emit = defineEmits(['confirm', 'cancel']);

function onOk() {
  emit('confirm');
}

function onCancel() {
  emit('cancel');
}
</script>
