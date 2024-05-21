import { ActionType } from "./Actions/Actions";
import { CodigoPostalType, EstadoType } from "./lib/types";



// eslint-disable-next-line react-refresh/only-export-components
export const initialState: CodigoPostalType & { estados: EstadoType []} = {
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
  },
  colonia: {
    clave: "",
    cp: "",
    descripcion: '',
  },
  estados: []
}


export function DirectionReducer(state = initialState, action: ActionType) {
  switch (action.type) {
    case 'SET_CODIGO_POSTAL':
      // eslint-disable-next-line no-case-declarations
      const { estado, municipio, localidad } = action.payload as CodigoPostalType
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
    case 'SET_ESTADOS' :
      return {
        ...state,
        estados: action.payload
      }
    default:
      return state
  }
}

