import { Vue, Component } from 'vue-property-decorator';
import { VMain, VLayout, VContainer } from 'vuetify/lib';

@Component({
  components: { VMain, VLayout, VContainer },
})
export default class PlaceCentred extends Vue {}
