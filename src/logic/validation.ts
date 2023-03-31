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

const GeoLocation = t.type({
  timestampMs: UnixDate,
  latitudeE7: t.number,
  longitudeE7: t.number,
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
