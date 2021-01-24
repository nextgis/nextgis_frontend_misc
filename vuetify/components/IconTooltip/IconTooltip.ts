import { Component, Prop, Vue } from 'vue-property-decorator';
import { VTooltip } from 'vuetify/lib';

@Component({
  components: { VTooltip },
})
export default class IconTooltip extends Vue {
  @Prop({ default: 'mdi-help-circle' }) readonly icon!: string;
}
