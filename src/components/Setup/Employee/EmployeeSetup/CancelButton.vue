<template>
  <a-button type="secondary" @click="$router.push({name: 'setup-employee'})">{{
    $t('table.dialog.cancel')
  }}</a-button>
</template>
<script>
export default {
  name: 'CancelButton'
}
</script>
