<template>
  <v-treeview :items="items" :active="active" :open="open" activatable>
    <template slot="label" slot-scope="{ item }">
      <router-link :to="{ name: item.to }" v-if="item.to && !item.children">{{
        item.name
      }}</router-link>
      <span v-else>{{ item.name }}</span>
    </template>
  </v-treeview>
</template>

<script src="./NavTree.ts">
</script>