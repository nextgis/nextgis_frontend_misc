import { Vue, Component, Model, Prop, Watch } from 'vue-property-decorator';

import { format, parse, isMatch } from 'date-fns';
import type { FieldRule } from '../ItemForm';
import type { DatetimeMessages } from '../ItemForm/interfaces/Messages';

const DEFAULT_DATE = '';
const DEFAULT_TIME = '00:00:00';
const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd';
const DEFAULT_TIME_FORMAT = 'HH:mm:ss'; // 'HH:mm:ss';
const DEFAULT_DIALOG_WIDTH = 370;

const LOCALE: DatetimeMessages = {
  clear: 'Clear',
  ok: 'OK',
  date: 'Date',
  time: 'Time',
  timePlaceholder: DEFAULT_TIME_FORMAT,
  datePlaceholder: DEFAULT_DATE_FORMAT,
};

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
    default: DEFAULT_TIME_FORMAT,
  })
  readonly timeFormat!: string;
  @Prop({
    default: () => LOCALE,
  })
  readonly messages!: Record<string, string>;
  @Prop({
    type: Object,
  })
  readonly textFieldProps!: Record<string, any>;
  @Prop({
    type: Object,
  })
  readonly datePickerProps!: Record<string, any>;

  display = false;
  timeMenu = false;

  date = DEFAULT_DATE;
  dateInput = DEFAULT_DATE;
  time = DEFAULT_TIME;
  timeInput = DEFAULT_TIME;
  locale: Record<string, string> = {};

  get dateRules(): FieldRule[] {
    return [(v) => !v || isMatch(v, this.dateFormat)];
  }

  get timeRules(): FieldRule[] {
    return [(v) => !v || isMatch(v, this.timeFormat)];
  }

  get dateTimeFormat(): string {
    return this.dateFormat + ' ' + this.timeFormat;
  }
  get defaultDateTimeFormat(): string {
    return this.dateFormat + ' ' + this.timeFormat;
  }
  get formattedDatetime(): string {
    return this.selectedDatetime
      ? format(this.selectedDatetime, this.dateTimeFormat)
      : '';
  }
  get selectedDatetime(): Date | null {
    if (isMatch(this.date, this.dateFormat) && this.time) {
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
      this.date = format(initDateTime, this.dateFormat);
      this.dateInput = this.date;
      this.time = format(initDateTime, this.timeFormat);
      this.timeInput = this.time;
    }
  }

  @Watch('dateInput')
  onDateInput() {
    if (isMatch(this.dateInput, this.dateFormat)) {
      this.date = this.dateInput;
    } else {
      this.date = '';
    }
  }

  @Watch('timeInput')
  onTimeInput() {
    if (isMatch(this.timeInput, this.timeFormat)) {
      this.time = this.timeInput;
    } else {
      this.time = DEFAULT_TIME;
    }
  }

  @Watch('time')
  onTime() {
    if (this.time && this.time !== DEFAULT_TIME) {
      if (this.time.length === 5) {
        this.time += ':00';
      }
      this.timeInput = this.time;
    }
  }

  @Watch('date')
  onDate() {
    if (this.date) {
      this.dateInput = this.date;
    }
  }

  mounted(): void {
    this.init();
    this.locale = { ...LOCALE, ...this.messages } as Record<string, string>;
    this.locale.timePlaceholder =
      this.locale.timePlaceholder || this.timeFormat;
    this.locale.datePlaceholder =
      this.locale.datePlaceholder || this.dateFormat;
  }

  okHandler(): void {
    this.resetPicker();
    this.$emit('input', this.selectedDatetime);
  }
  clearHandler(): void {
    this.resetPicker();
    this.date = DEFAULT_DATE;
    this.dateInput = this.date;
    this.time = DEFAULT_TIME;
    this.timeInput = DEFAULT_TIME;
    this.$emit('input', null);
  }
  resetPicker(): void {
    this.display = false;
    this.timeMenu = false;
    if (this.$refs.timer) {
      (this.$refs.timer as any).selectingHour = true;
    }
  }
}
