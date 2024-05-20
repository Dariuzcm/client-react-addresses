import { FunctionComponent } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  ColoniaType,
  EstadoType,
  LocalidadType,
  MunicipioType,
} from "@/lib/types";

interface SelectCollectionsProps<T> {
  title: string;
  collection: T[];
  type: "EstadoType" | "MunicipioType" | "LocalidadType" | "ColoniaType";
  value?: string;
  name?: string;
  disabled?: boolean;
  onValueChange?: (value: string, name?: string) => void;
}

const SelectCollections: FunctionComponent<
  SelectCollectionsProps<
    EstadoType | MunicipioType | LocalidadType | ColoniaType
  >
> = (props) => {
  const { title, collection, type, value, onValueChange, name, disabled } =
    props;

  return (
    <>
      <Select
        value={value}
        disabled={disabled}
        onValueChange={(value: string) =>
          onValueChange && onValueChange(value, name)
        }
      >
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder={title} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {collection.map((item) => {
              const { nombreEstado } = item as EstadoType;
              const { descripcion } = item as MunicipioType;
              return (
                <SelectItem key={`${type}-${item.clave}`} value={item.clave}>
                  {descripcion || nombreEstado}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
};

export default SelectCollections;
