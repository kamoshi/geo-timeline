import dayjs from "dayjs";
import * as t from 'io-ts'
import * as J from 'fp-ts/Json'
import * as E from "fp-ts/Either"
import {pipe} from "fp-ts/function"
import type {Option} from "fp-ts/Option";


const UnixDate = new t.Type<Dayjs, string, unknown>(
  'UnixDate',
  (value): value is dayjs.Dayjs => value instanceof dayjs.Dayjs,
  (value, context) => pipe(
    t.string.validate(value, context),
    E.map(parseInt),
    E.map(dayjs),
    E.chain(date => date.isValid() ? t.success(date) : t.failure(value, context))
  ),
  date => String(date.unix()),
)

const CoordinateE7 = new t.Type<number, number, unknown>(
  'CoordinateE7',
  (value): value is number => typeof value === 'number',
  (value, context) => pipe(
    t.number.validate(value, context),
    E.map(n => n / 10000000),
  ),
  number => number * 10000000,
)

const GeoLocation = t.type({
  timestampMs: UnixDate,
  latitudeE7: CoordinateE7,
  longitudeE7: CoordinateE7,
})

const LocationData = t.type({
  locations: t.array(GeoLocation),
})

export function validate(str: Option<string>) {
  return pipe(
    str,
    E.fromOption(() => "No data provided"),
    E.chain(J.parse),
    E.chainW(LocationData.decode),
  )
}

export type GeoLocation = t.TypeOf<typeof GeoLocation>;
export type LocationData = t.TypeOf<typeof LocationData>;
