import { Vue, Component, Prop } from 'vue-property-decorator';
import { VMain, VLayout, VProgressCircular, VContainer } from 'vuetify/lib';

@Component({
  components: { VMain, VLayout, VProgressCircular, VContainer },
})
export default class PageLoading extends Vue {
  // @Prop({ type: String }) readonly text!: string;
  @Prop({ default: 'primary' }) readonly color!: string;
  @Prop({ default: 50 }) readonly size!: string;
  @Prop({ default: 4 }) readonly width!: number;
}
