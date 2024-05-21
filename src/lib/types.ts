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

export type RecordType = {
  id: number;
  cp: string;
  calle: string;
  colonia: string;
};

export type Meta = {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: string | null;
  previousPageUrl: string | null;
};

export type RecordPaginated = {
  meta: Meta,
  data: RecordType[]
};
