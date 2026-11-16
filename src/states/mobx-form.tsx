// external dependencies
import { makeAutoObservable } from "mobx";
import { IOpeningTimes } from "../queries/office";
import { configure } from "mobx";
import { IOptionalInformation } from "../queries/officeGuideline";

// configure({
//   useProxies: "never",
// });
export interface FieldError {
  field: string;
  error: string;
}

export interface FormError {
  errors: FieldError[];
}

export interface StateClass {}

type types =
  | string
  | number
  | ""
  | boolean
  | null
  | StateClass
  | File
  | FileData
  | Date
  | undefined
  | IOpeningTimes
  | IOptionalInformation
  | string[]
  | any;

export class ValueState<T extends types> {
  private _value: T;
  private _error: string;
  private _touched: boolean;

  constructor(value: T) {
    this._value = value;
    this._error = "";
    this._touched = false;
    makeAutoObservable(this);
  }

  get value(): T {
    return this._value;
  }

  set value(value: T) {
    this._value = value;
    this._touched = true;
    this._error = "";
  }

  get error(): string {
    return this._error;
  }

  set error(error: string) {
    this._error = error;
  }

  get touched(): boolean {
    return this._touched;
  }

  set touched(touched: boolean) {
    this._touched = touched;
  }

  clearError() {
    this._error = "";
  }
}

export interface FileData {
  uuid?: string;
  file?: File;
}

export class ArrayValueState<T extends types | undefined> {
  private _values: ValueState<T>[];
  private _error: string;
  private _touched: boolean;

  constructor(value: T[]) {
    this._values = value?.map((v) => new ValueState(v));
    this._error = "";
    this._touched = false;
    makeAutoObservable(this);
  }

  get values() {
    return this._values;
  }

  getElement(index: number): ValueState<T> {
    return this._values[index];
  }

  setElementValue(index: number, value: T) {
    this._values[index].value = value;
    this._touched = true;
    this._error = "";
  }

  pushElementValue(value: T) {
    this._values.push(new ValueState(value));
    this._touched = true;
    this._error = "";
  }

  deleteElementValue(index: number) {
    if (index === -1) return;
    this._values.splice(index, 1);
    this._touched = true;
    this._error = "";
  }

  updateElementValue(value: T, index: number) {
    this._values.splice(index, 1, new ValueState(value));
    this._touched = true;
    this._error = "";
  }

  get error(): string {
    return this._error;
  }

  set error(error: string) {
    this._error = error;
  }

  get touched(): boolean {
    return this._touched;
  }

  set touched(touched: boolean) {
    this._touched = touched;
  }

  clearError() {
    this._values?.forEach((v) => v.clearError());
  }
}
