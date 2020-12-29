import { mdiCalendar, mdiClock } from '@mdi/js';
import { Vue, Component, Model, Prop, Watch } from 'vue-property-decorator';

import { format, parse } from 'date-fns';
const DEFAULT_DATE = '';
const DEFAULT_TIME = '00:00:00';
const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';
const DEFAULT_TIME_FORMAT = 'HH:mm:ss';
const DEFAULT_DIALOG_WIDTH = 340;
const DEFAULT_CLEAR_TEXT = 'CLEAR';
const DEFAULT_OK_TEXT = 'OK';

@Component({
  components: {},
})
export default class DatetimePicker extends Vue {
  @Model('input') datetime!: string | Date;

  @Prop({}) readonly disabled!: boolean;
  @Prop({}) readonly loading!: boolean;
  @Prop({}) readonly readonly!: boolean;
  @Prop({
    default: '',
  })
  readonly label!: string;
  @Prop({
    default: DEFAULT_DIALOG_WIDTH,
  })
  readonly dialogWidth!: number;
  @Prop({
    default: DEFAULT_DATE_FORMAT,
  })
  readonly dateFormat!: string;
  @Prop({
    default: 'HH:mm',
  })
  readonly timeFormat!: string;
  @Prop({
    default: DEFAULT_CLEAR_TEXT,
  })
  readonly clearText!: string;
  @Prop({
    default: DEFAULT_OK_TEXT,
  })
  readonly okText!: string;
  @Prop({
    type: Object,
  })
  readonly textFieldProps!: Record<string, any>;
  @Prop({
    type: Object,
  })
  readonly datePickerProps!: Record<string, any>;
  @Prop({
    type: Object,
  })
  readonly timePickerProps!: Record<string, any>;

  display = false;
  activeTab = 0;
  date = DEFAULT_DATE;
  time = DEFAULT_TIME;
  icons = {
    calendar: mdiCalendar,
    time: mdiClock,
  };

  get dateTimeFormat(): string {
    return this.dateFormat + ' ' + this.timeFormat;
  }
  get defaultDateTimeFormat(): string {
    return DEFAULT_DATE_FORMAT + ' ' + DEFAULT_TIME_FORMAT;
  }
  get formattedDatetime(): string {
    return this.selectedDatetime
      ? format(this.selectedDatetime, this.dateTimeFormat)
      : '';
  }
  get selectedDatetime(): Date | null {
    if (this.date && this.time) {
      let datetimeString = this.date + ' ' + this.time;
      if (this.time.length === 5) {
        datetimeString += ':00';
      }
      return parse(datetimeString, this.defaultDateTimeFormat, new Date());
    } else {
      return null;
    }
  }
  get dateSelected(): boolean {
    return !this.date;
  }

  @Watch('datetime')
  init(): void {
    if (!this.datetime) {
      return;
    }
    let initDateTime: number | Date | undefined = undefined;
    if (this.datetime instanceof Date) {
      initDateTime = this.datetime;
    } else if (typeof this.datetime === 'string') {
      // see https://stackoverflow.com/a/9436948
      initDateTime = parse(this.datetime, this.dateTimeFormat, new Date());
    }
    if (initDateTime) {
      this.date = format(initDateTime, DEFAULT_DATE_FORMAT);
      this.time = format(initDateTime, DEFAULT_TIME_FORMAT);
    }
  }

  mounted(): void {
    this.init();
  }

  okHandler(): void {
    this.resetPicker();
    this.$emit('input', this.selectedDatetime);
  }
  clearHandler(): void {
    this.resetPicker();
    this.date = DEFAULT_DATE;
    this.time = DEFAULT_TIME;
    this.$emit('input', null);
  }
  resetPicker(): void {
    this.display = false;
    this.activeTab = 0;
    if (this.$refs.timer) {
      (this.$refs.timer as any).selectingHour = true;
    }
  }
  showTimePicker(): void {
    this.activeTab = 1;
  }
}
