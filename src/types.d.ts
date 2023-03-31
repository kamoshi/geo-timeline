type Dayjs = import("dayjs").Dayjs;

interface SliderDragEvent {
  x: number;
  baseline: {
    x: number;
    s: number;
    e: number;
  }
}

interface SliderSelection {
  s: number;
  e: number;
}

interface MarkerData {
  date: Dayjs;
}

interface DateRange {
  s: Dayjs;
  e: Dayjs;
}
