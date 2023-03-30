import { writable } from 'svelte/store';
import dayjs from "dayjs";


export const range = writable<DateRange>({s: dayjs(0), e: dayjs()});
