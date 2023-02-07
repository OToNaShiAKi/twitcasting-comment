<template>
  <v-list id="comment" dense three-line>
    <v-fab-transition group origin="center left">
      <v-list-item
        class="rounded-lg"
        :style="item.style.card"
        v-for="item of comments"
        :key="item.id"
        v-show="config.includes(item.config)"
      >
        <v-list-item-avatar>
          <v-img referrepolicy="no-referrer" :src="item.avatar" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title
            class="d-flex align-center font-weight-bold"
            :style="item.style.title"
            v-html="item.title"
          />
          <v-list-item-subtitle
            class="d-flex align-center"
            :style="item.style.message"
            v-html="item.message"
          />
          <v-list-item-subtitle :style="item.style.message">
            {{ item.translate }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-fab-transition>
  </v-list>
</template>

<script>
export default {
  name: "CommentList",
  props: { comments: Array, config: Array },
};
</script>
