import {
  CodigoPostalType,
  ColoniaType,
  EstadoType,
  LocalidadType,
  MunicipioType,
  RecordPaginated,
  RecordType,
} from "@/lib/types";
import { apiHandler } from "./apiConfig";

export const searchByCodigoPostal = async (
  cp: number
): Promise<CodigoPostalType> => {
  return await apiHandler(`/cp/${cp}`);
};

export const getEstados = async (): Promise<EstadoType[]> => {
  return await apiHandler("/estados");
};

export const getMunicipios = async (
  claveMunicipio: string
): Promise<MunicipioType[]> => {
  return await apiHandler(`/municipios/${claveMunicipio}`);
};

export const getLocalidades = async (
  claveLocalidad: string
): Promise<LocalidadType[]> => {
  return await apiHandler(`/localidades/${claveLocalidad}`);
};

export const getColonias = async (
  estado: string,
  municipio: string,
  localidad: string
) => {
  return await apiHandler(`/colonias`, {
    method: "POST",
    body: JSON.stringify({
      estado,
      municipio,
      localidad,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getRecords = async (
  page?: number,
  size?: number
): Promise<{
  records: RecordPaginated;
  colonias: ColoniaType[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  codigosPostales: any[];
}> => {
  const params = [];
  if (page && page > 0) {
    params.push(`page=${page}`);
  }
  if (size && size > 10) {
    params.push(`size=${size}`);
  }

  let url = "/records";
  if (params.length > 0) {
    url = `/records?${params.join("&")}`;
  }
  return await apiHandler(url);
};

export const createRecord = async (
  record: Partial<RecordType>
): Promise<RecordType> => {
  const rec = await apiHandler('/records', {
    method: 'POST',
    body: JSON.stringify(record),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return rec
};
