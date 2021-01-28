<template>
  <v-treeview 
    :items="items" 
    :active="active" 
    :open="open" 
    activatable 
    open-on-click
    @update:active="openRoute">
    <template slot="label" slot-scope="{ item }">
      <template v-if="item.to && !item.children">{{
        item.name
      }}</template>
      <span v-else>{{ item.name }}</span>
    </template>
  </v-treeview>
</template>

<script src="./NavTree.ts">
</script>