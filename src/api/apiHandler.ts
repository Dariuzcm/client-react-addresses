import { CodigoPostalType, EstadoType, LocalidadType, MunicipioType } from "@/lib/types";
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

export const getColonias = async (estado: string, municipio: string, localidad: string) => {
  return await apiHandler(`/colonias`, {
    method: 'POST',
    body: JSON.stringify({
      estado,
      municipio,
      localidad
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}