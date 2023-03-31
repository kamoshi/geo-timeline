import * as t from 'io-ts'
import * as J from 'fp-ts/Json'
import * as E from "fp-ts/Either"
import {pipe} from "fp-ts/function"
import type {Option} from "fp-ts/Option";


const _GeoLocation = t.type({
  timestampMs: t.string,
  latitudeE7: t.number,
  longitudeE7: t.number,
})

const _LocationData = t.type({
  locations: t.array(_GeoLocation),
})

export type GeoLocation = t.TypeOf<typeof _GeoLocation>;
export type LocationData = t.TypeOf<typeof _LocationData>;

export function validate(str: Option<string>) {
  return pipe(
    str,
    E.fromOption(() => "No data provided"),
    E.chain(J.parse),
    E.chainW(_LocationData.decode),
  )
}
