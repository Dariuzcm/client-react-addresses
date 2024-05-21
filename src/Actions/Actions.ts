import { CodigoPostalType, EstadoType } from "@/lib/types"

export type ActionTypes = 'SET_CODIGO_POSTAL' | 'SET_ESTADOS'

export type ActionType = {
  type: ActionTypes
  payload: Partial<CodigoPostalType> | EstadoType[]
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