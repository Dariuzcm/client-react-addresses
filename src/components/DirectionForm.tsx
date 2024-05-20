import { FunctionComponent, useContext, useEffect, useState } from "react";
import CodigoPostal, { BlurProps } from "./CodigoPostal";
import { FIELDS_DATA } from "@/lib/constants";
import {
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

import { setCodigoPostal } from "@/Reducer";
import { CPContext } from "@/Provider";
import { useToast } from "./ui/use-toast";
import { Label } from "./ui/label";
import SelectCollections from "./SelectColections";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface DirectionFormProps {}

type ValuesTypes = {
  estados: EstadoType[];
  municipios: MunicipioType[];
  localidades: LocalidadType[];
  colonias: ColoniaType[];
};

type SelectionsType = {
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
  const [CPAvailables, setCPAvailables] = useState<Map<string,string>>();
  const [CPValue, setCPValue] = useState<string | undefined>();

  const { dispatch } = useContext(CPContext)!;
  const { toast } = useToast();

  const handleOnBlur = async ({ name, value }: BlurProps) => {
    if (name === FIELDS_DATA.CP) {
      try {
        const cp_object: CodigoPostalType = await searchByCodigoPostal(value);
        dispatch(setCodigoPostal(cp_object));
        toast({
          title: "Codigo Postal",
          description: `Getting information for ${cp_object.cp}`,
          variant: "default",
        });
        setValues((prev) => ({
          ...prev,
          municipios: [cp_object.municipio],
          localidades: [cp_object.localidad],
          colonias: [cp_object.colonia],
        }));
        setSelections({
          estado: cp_object.estado.clave,
          municipio: cp_object.municipio.clave,
          localidad: cp_object.localidad.clave,
          colonia: cp_object.colonia.clave,
        });
      } catch (error) {
        const { message } = error as Error;
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
      if (key && value)
        setSelections((prev) => ({
          ...prev,
          [key]: value,
        }));

      if (key === "estado") getCollection("municipio", value!);
      else if (key === "municipio")
        getCollection("localidad", value!);
      else if (key === "localidad")
        getCollection("colonia", value!);
      else if (key === 'colonia')
        setCPValue(CPAvailables?.get(value!))
    }
  };

  const getCollection = (key: keyof SelectionsType, comparKey: string) => {
    switch (key) {
      case "municipio":
        getMunicipios(comparKey).then((data) => {
          setValues((prev) => ({
            ...prev,
            municipios: data,
          }));
        });
        break;
      case "localidad":
        getLocalidades(Selections!.estado!).then((data) => {
          setValues((prev) => ({
            ...prev,
            localidades: data,
          }))
        })
        break
      case "colonia":
        getColonias( Selections!.estado!, Selections!.municipio!, comparKey)
        .then((data) => {
          setValues((prev) => ({
            ...prev,
            colonias: data
          }))

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const ColoniaMap = new Map()

          data.forEach((element: ColoniaType) => {
            ColoniaMap.set(element.clave, element.cp)
          });

          setCPAvailables(ColoniaMap)
          
        })
        .catch(({ message }) => {
          setValues((prev) => ({
            ...prev,
            colonias: []
          }))
          toast({
            title: "Error al obtener Colonias",
            description: message || "Unexpected",
            variant: "destructive",
          });
        })
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getEstados().then((estados) => {
      setValues((prev) => ({
        ...prev,
        estados,
      }));
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
          <Label>Estado</Label>
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
          <Label>Municipio</Label>
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
          <Label>Localidad</Label>
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
          <Label>Colonia</Label>
          <SelectCollections
            onValueChange={handleOnSelectValue}
            name={"colonia"}
            disabled={!Selections?.localidad}
            value={Selections?.colonia}
            title={"Seleccione su colonia"}
            collection={Values.colonias}
            type={"ColoniaType"}
          />
        </div>
      </div>
      <div>
        <Label>Calle y número</Label>
        <Input className="w-full" placeholder="Calle y número" />
      </div>
      <Button className="mt-6" size={"lg"}>
        Continuar
      </Button>
    </section>
  );
};

export default DirectionForm;
