import { CodigoPostalType, EstadoType, RecordType } from "@/lib/types"

export type ActionTypes = 'SET_CODIGO_POSTAL' | 'SET_ESTADOS' | 'SET_RECORDS' | 'ADD_RECORD' | 'DELETE_RECORD'

export type ActionType = {
  type: ActionTypes
  payload: Partial<CodigoPostalType> | EstadoType[] | RecordType[] | RecordType | number
}

// eslint-disable-next-line react-refresh/only-export-components
export function setCodigoPostal(cp: Partial<CodigoPostalType>): ActionType {
  return {
    type: 'SET_CODIGO_POSTAL',
    payload: cp
  }
}

export function setEstados(estados: EstadoType[]): ActionType {
  return {
    type: 'SET_ESTADOS',
    payload: estados
  }
}

export function setGlobalRecords(records: RecordType[]): ActionType {
  return {
    type: 'SET_RECORDS',
    payload: records
  }
}

export function addGlobalRecords(record: RecordType): ActionType {
  return {
    type: 'ADD_RECORD',
    payload: record
  }
}

export function deleteGlobalRecords(id: number): ActionType {
  return {
    type: 'DELETE_RECORD',
    payload: id
  }
}