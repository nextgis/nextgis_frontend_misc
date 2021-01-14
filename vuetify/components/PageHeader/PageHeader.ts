import { Component, Prop, Vue } from 'vue-property-decorator';
import { VSpacer } from 'vuetify/lib';

@Component({
  components: { VSpacer },
})
export default class PageHeader extends Vue {
  @Prop({}) readonly title!: string;
}
