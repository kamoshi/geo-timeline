type Dayjs = import("dayjs").Dayjs;

type Immutable<T> =
  // Dayjs date objects are immutable by default
  T extends Dayjs           ? T :
  T extends Function        ? T :
  T extends Array<infer U>  ? ReadonlyArray<Immutable<U>> :
  T extends Object          ? { readonly [K in keyof T]: Immutable<T[K]> } :
  T;

type ImmutableReturn<T> = Immutable<ReturnType<T>>;


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
