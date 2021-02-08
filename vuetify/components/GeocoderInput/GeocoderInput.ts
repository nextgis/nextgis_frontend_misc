import { Vue, Component, Prop, Watch, Model } from 'vue-property-decorator';
import { Geocoder, SearchItem, NominatimProvider } from '@nextgis/geocoder';
import { DebounceDecorator } from '@nextgis/utils';

@Component({
  components: {},
})
export default class SnapshotFilter extends Vue {
  @Model('change', { default: '' }) readonly search!: string;

  @Prop() readonly label!: string;
  @Prop({ default: 'Введите адрес' }) readonly placeholder!: string;
  @Prop({ default: 'mdi-magnify' }) readonly prependInnerIcon!: string;
  @Prop({ default: true }) readonly dense!: boolean;
  @Prop({ default: true }) readonly outlined!: boolean;
  @Prop({ default: true }) readonly hideDetails!: boolean;

  isLoading = false;
  suggests: SearchItem[] = [];
  query = '';
  select = null;

  geocoder?: Geocoder;

  get items() {
    return this.suggests.map((x) => ({ text: x.text, value: x._id }));
  }

  @Watch('search')
  onModelChange() {
    this.query = this.search;
  }

  @Watch('query')
  @DebounceDecorator(500)
  onQueryChange(query: string): void {
    this.suggest(query);
    this.$emit('change', query);
  }

  @Watch('select')
  async onSuggestClick(id: number): Promise<void> {
    // const item: SearchItem = this.suggests[id];
    const item = this.suggests.find((x) => x._id === id);
    if (item && item.result) {
      this.geocoder?.abort();
      const result = await item.result();
      if (result) {
        this.$emit('result', result);
      }
    }
  }

  mounted(): void {
    this.query = this.search;
    this.geocoder = new Geocoder({ providers: [new NominatimProvider()] });
  }

  clean() {
    this.geocoder?.abort();
    this.suggests = [];
  }

  async suggest(query: string) {
    this.clean();
    const suggests: SearchItem[] = [];
    const geocoder = this.geocoder;
    if (geocoder && this.query) {
      this.isLoading = true;
      try {
        const results = geocoder.search(query);
        for await (const res of results) {
          suggests.push(res);
        }
      } catch (er) {
        //
      }
      this.suggests = suggests;
      this.isLoading = false;
    }
  }
}
