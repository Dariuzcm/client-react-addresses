export type CodigoPostalType = {
  cp: string;
  estado: EstadoType;
  municipio: MunicipioType;
  localidad: LocalidadType;
  colonia: ColoniaType;
};

export type EstadoType = {
  clave: string;
  pais: string;
  nombreEstado: string;
};

export type MunicipioType = {
  clave: string;
  estado: string;
  descripcion: string;
};

export type LocalidadType = MunicipioType;
export type ColoniaType = {
  clave: string;
  cp: string;
  descripcion: string;
};
