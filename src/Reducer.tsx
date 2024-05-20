import { CodigoPostalType } from "./lib/types";

export type ActionType = {
  type: ActionTypes
  payload: Partial<CodigoPostalType>
}

// eslint-disable-next-line react-refresh/only-export-components
export const initialState: CodigoPostalType = {
  cp: "",
  estado: {
    clave: "",
    pais: "",
    nombreEstado: ""
  },
  municipio: {
    clave: "",
    estado: "",
    descripcion: ""
  },
  localidad: {
    clave: "",
    estado: "",
    descripcion: ""
  }
}

type ActionTypes = 'SET_CODIGO_POSTAL'

// eslint-disable-next-line react-refresh/only-export-components
export function setCodigoPostal(cp: Partial<CodigoPostalType>): ActionType {
  return {
    type: 'SET_CODIGO_POSTAL',
    payload: cp
  }
}

export function DirectionReducer(state = initialState, action: ActionType) {
  switch (action.type) {
    case 'SET_CODIGO_POSTAL':
      // eslint-disable-next-line no-case-declarations
      const { estado, municipio, localidad } = action.payload
      return {
        ...state,
        estado: {
          ...state.estado,
          ...estado
        },
        municipio: {
          ...state.municipio,
          ...municipio
        },
        localidad: {
          ...state.localidad,
          ...localidad
        },
      }
    default:
      return state
  }
}