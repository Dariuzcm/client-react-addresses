import { ActionType } from "./Actions/Actions";
import { CodigoPostalType, EstadoType, RecordType } from "./lib/types";

// eslint-disable-next-line react-refresh/only-export-components
export const initialState: CodigoPostalType & {
  estados: EstadoType[];
  records: RecordType[];
} = {
  cp: "",
  estado: {
    clave: "",
    pais: "",
    nombreEstado: "",
  },
  municipio: {
    clave: "",
    estado: "",
    descripcion: "",
  },
  localidad: {
    clave: "",
    estado: "",
    descripcion: "",
  },
  colonia: {
    clave: "",
    cp: "",
    descripcion: "",
  },
  estados: [],
  records: [],
};

export function DirectionReducer(state = initialState, action: ActionType) {
  switch (action.type) {
    case "SET_CODIGO_POSTAL":
      // eslint-disable-next-line no-case-declarations
      const { estado, municipio, localidad, cp } =
        action.payload as CodigoPostalType;
      return {
        ...state,
        cp,
        estado: {
          ...state.estado,
          ...estado,
        },
        municipio: {
          ...state.municipio,
          ...municipio,
        },
        localidad: {
          ...state.localidad,
          ...localidad,
        },
      };
    case "SET_ESTADOS":
      return {
        ...state,
        estados: action.payload,
      };
    case "SET_RECORDS":
      return {
        ...state,
        records: action.payload,
      };
    case "ADD_RECORD":
      return {
        ...state,
        records: [action.payload, ...state.records],
      };
    case "DELETE_RECORD":
      return {
        ...state,
        records: state.records.filter(item => item.id !== action.payload),
      };
    default:
      return state;
  }
}
