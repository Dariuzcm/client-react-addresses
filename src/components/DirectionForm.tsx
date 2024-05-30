import {
  ChangeEvent,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import CodigoPostal, { BlurProps } from "./CodigoPostal";
import { FIELDS_DATA } from "@/lib/constants";
import {
  createRecord,
  getColonias,
  getEstados,
  getLocalidades,
  getMunicipios,
  searchByCodigoPostal,
} from "@/api/apiHandler";
import type {
  CodigoPostalType,
  ColoniaType,
  EstadoType,
  LocalidadType,
  MunicipioType,
} from "@/lib/types";

import { CPContext } from "@/Provider";
import { useToast } from "./ui/use-toast";
import { Label } from "./ui/label";
import SelectCollections from "./SelectColections";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { PrimitiveSpanProps } from "@radix-ui/react-select";
import {
  addGlobalRecords,
  setCodigoPostal,
  setEstados,
} from "@/Actions/Actions";

interface DirectionFormProps {}

type ValuesTypes = {
  estados: EstadoType[];
  municipios: MunicipioType[];
  localidades: LocalidadType[];
  colonias: ColoniaType[];
};

export type SelectionsType = {
  estado?: string;
  municipio?: string;
  localidad?: string;
  colonia?: string;
};

const DirectionForm: FunctionComponent<DirectionFormProps> = () => {
  const [Values, setValues] = useState<ValuesTypes>({
    estados: [],
    municipios: [],
    localidades: [],
    colonias: [],
  });
  const [Selections, setSelections] = useState<SelectionsType>();
  const [CPAvailables, setCPAvailables] = useState<Map<string, string>>();
  const [CPValue, setCPValue] = useState<string | undefined>();
  const [InputValue, setInputValue] = useState("");
  const [Loading, setLoading] = useState<
    "estado" | "municipio" | "localidad" | "colonia" | "saving" | undefined
  >();

  const { dispatch, state } = useContext(CPContext)!;
  const { toast } = useToast();

  const handleOnBlur = async ({ name, value }: BlurProps) => {
    if (name.length < 6) return;
    else if (name === FIELDS_DATA.CP) {
      try {
        const cp_object: CodigoPostalType = await searchByCodigoPostal(value);
        dispatch(setCodigoPostal(cp_object));
        setCPValue(cp_object.cp);
        dispatch(setCodigoPostal({ cp: value.toString() }));

        toast({
          title: "Codigo Postal",
          description: `Getting information for ${cp_object.cp}`,
          variant: "default",
        });

        if (cp_object.estado !== null) {
          setSelections({
            estado: cp_object.estado?.clave,
          });
          await getCollection("municipio", cp_object.estado.clave);

          if (cp_object.municipio !== null) {
            setSelections({
              estado: cp_object.estado.clave,
              municipio: cp_object.municipio?.clave,
            });
            await getCollection(
              "localidad",
              cp_object.municipio.clave,
              cp_object.estado.clave
            );
            if (cp_object.localidad !== null) {
              setSelections({
                estado: cp_object.estado?.clave,
                municipio: cp_object.municipio?.clave,
                localidad: cp_object.localidad?.clave,
              });
              await getCollection(
                "colonia",
                cp_object.municipio.clave,
                cp_object.estado.clave,
                cp_object.localidad.clave
              );
            }
          }
        }
        setSelections({
          estado: cp_object.estado?.clave,
          municipio: cp_object.municipio?.clave,
          localidad: cp_object.localidad?.clave,
          colonia: cp_object.colonia?.clave,
        });
      } catch (error) {
        const { message } = error as Error;
        console.error(error);
        toast({
          title: "Error al obtener Codigo Postal",
          description: message || "Unexpected",
          variant: "destructive",
        });
      }
    }
  };

  const handleOnSelectValue = (value: string | undefined, name?: string) => {
    if (name) {
      const key = name as keyof SelectionsType;

      if (key === "estado") {
        getCollection("municipio", value!);
        setValues((prev) => ({
          ...prev,
          localidades: [],
          colonias: [],
        }));
        setSelections({
          [key]: value,
          municipio: "",
          localidad: "",
          colonia: "",
        });
      } else if (key === "municipio") {
        getCollection("localidad", value!, Selections!.estado!);
        setSelections((prev) => ({
          ...prev,
          [key]: value,
          localidad: "",
          colonia: "",
        }));
      } else if (key === "localidad") {
        getCollection(
          "colonia",
          Selections!.municipio!,
          Selections!.estado!,
          value!
        );
        setSelections((prev) => ({
          ...prev,
          [key]: value,
          colonia: "",
        }));
      } else if (key === "colonia") {
        setCPValue(CPAvailables?.get(value!));
        setSelections((prev) => ({
          ...prev,
          [key]: value,
        }));
      }
    }
  };

  async function getCollection(key: "estado"): Promise<EstadoType[]>;
  async function getCollection(
    key: "municipio",
    claveMunicipio: string
  ): Promise<MunicipioType[]>;
  async function getCollection(
    key: "localidad",
    claveMunicipio: string,
    claveEstado: string
  ): Promise<MunicipioType[]>;
  async function getCollection(
    key: "colonia",
    claveMunicipio: string,
    claveEstado: string,
    claveLocalidad: string
  ): Promise<ColoniaType[]>;
  async function getCollection(
    key: keyof SelectionsType,
    claveMunicipio?: string,
    claveEstado?: string,
    claveLocalidad?: string
  ): Promise<
    void | EstadoType[] | MunicipioType[] | ColoniaType[] | undefined
  > {
    setLoading(key);
    let promise: Promise<EstadoType[] | MunicipioType[] | ColoniaType[]>;
    const Switcher = {
      estado: () => promise = getEstados(),
      municipio: () => promise = getMunicipios(claveMunicipio!),
      localidad: () => promise = getLocalidades(claveMunicipio!, claveEstado!),
      colonia: () => promise = getColonias(claveEstado!, claveMunicipio!, claveLocalidad!)
    }
    Switcher[key]();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return promise
      .then((data) => {
        const values = {
          estado: "estados" ,
          municipio: "municipios" ,
          localidad: "localidades" ,
          colonia: "colonias" ,
        }
        setValues((prev) => ({
          ...prev,
          [values[key]]: data,
        }));
        if (key === "colonia") {
          const ColoniaMap = new Map();

          data.forEach((element) => {
            const item = element as ColoniaType;
            ColoniaMap.set(item.clave, item.cp);
          });

          setCPAvailables(ColoniaMap);
          setLoading(undefined);
          return data;
        }
      })
      .catch(({ message }) => {
        setValues((prev) => ({
          ...prev,
          [key]: [],
        }));
        toast({
          title: `Error al obtener ${key.toUpperCase}`,
          description: message || "Unexpected",
          variant: "destructive",
        });
        setLoading(undefined);
      });
  }

  const handleOnSave = async () => {
    setLoading("saving");
    console.log(state);
    createRecord({
      calle: InputValue,
      colonia: Selections?.colonia,
      cp: state.cp,
    })
      .then((record) => {
        dispatch(addGlobalRecords(record));
        setLoading(undefined);
      })
      .catch(({ message }) => {
        setLoading(undefined);
        toast({
          title: "Error al obtener Municipios",
          description: message || "Unexpected",
          variant: "destructive",
        });
      });
  };

  const validateButton = () => {
    let flag = false;
    const validFields = ["estado", "municipio", "localidad"];
    if (Selections) {
      const keys = Object.keys(Selections);
      flag =
        validFields.every((item) => keys.includes(item)) &&
        InputValue.length > 3;
    }
    return flag;
  };

  const handleOnChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputValue(value);
  };

  useEffect(() => {
    getEstados().then((estados) => {
      setValues((prev) => ({
        ...prev,
        estados,
      }));
      dispatch(setEstados(estados));
    });
  }, []);

  return (
    <section className="bg-zinc-100 p-4 w-[700px] flex flex-col gap-3 px-10 mx-auto pb-10 rounded-lg shadow-xl">
      <h1 className="text-2xl text-center">
        Formulario de captura de dirección
      </h1>

      <div className="w-[500px]">
        <CodigoPostal CPvalue={CPValue} onBlur={handleOnBlur} />
      </div>
      <div className="flex gap-6">
        <div>
          <Label className="flex gap-3 items-center pb-2">
            Estado
            {Loading === "estado" && <Loader />}
          </Label>
          <SelectCollections
            onValueChange={handleOnSelectValue}
            name={"estado"}
            value={Selections?.estado}
            title={"Seleccione su estado"}
            collection={Values.estados}
            type={"EstadoType"}
          />
        </div>
        <div>
          <Label className="flex gap-3 items-center pb-2">
            Municipio
            {Loading === "municipio" && <Loader />}
          </Label>
          <SelectCollections
            onValueChange={handleOnSelectValue}
            name={"municipio"}
            disabled={!Selections?.estado}
            value={Selections?.municipio}
            title={"Seleccione su municipio"}
            collection={Values.municipios}
            type={"MunicipioType"}
          />
        </div>
      </div>
      <div className="flex gap-6">
        <div>
          <Label className="flex gap-3 items-center pb-2">
            Localidad
            {Loading === "localidad" && <Loader />}
          </Label>
          <SelectCollections
            onValueChange={handleOnSelectValue}
            name={"localidad"}
            disabled={!Selections?.municipio}
            value={Selections?.localidad}
            title={"Seleccione su localidad"}
            collection={Values.localidades}
            type={"LocalidadType"}
          />
        </div>
        <div>
          <Label className="flex gap-3 items-center pb-2">
            Colonia
            {Loading === "colonia" && <Loader />}
          </Label>
          <SelectCollections
            onValueChange={handleOnSelectValue}
            name={"colonia"}
            disabled={!Selections?.localidad || Values.colonias.length === 0}
            value={Selections?.colonia}
            title={"Seleccione su colonia"}
            collection={Values.colonias}
            type={"ColoniaType"}
          />
        </div>
      </div>
      <div>
        <Label className="flex gap-3 items-center pb-2">Calle y número</Label>
        <Input
          className="w-full"
          value={InputValue}
          placeholder="Calle y número"
          onChange={handleOnChangeInput}
        />
      </div>
      <Button
        disabled={!validateButton()}
        className={`mt-6`}
        size={"lg"}
        onClick={handleOnSave}
      >
        {Loading === "saving" && (
          <Loader className="text-white transition-transform animate-spin" />
        )}
        Continuar
      </Button>
    </section>
  );
};

function Loader(props: PrimitiveSpanProps) {
  return (
    <span
      className="text-blue-600 transition-transform animate-spin"
      {...props}
    >
      <Loader2 className="scale-75" />
    </span>
  );
}
export default DirectionForm;
