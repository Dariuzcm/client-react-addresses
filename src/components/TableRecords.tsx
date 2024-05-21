import { FunctionComponent, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { ColoniaType, EstadoType, Meta, RecordType } from "@/lib/types";
import { getEstados, getRecords } from "@/api/apiHandler";

import { Trash2, RefreshCcw } from "lucide-react";
import { Button } from "./ui/button";
import Paginator from "./Paginator";
import { useToast } from "./ui/use-toast";

interface TableRecordsProps {}

const labels: string[] = ["id", "cp", "calle", "colonia", "estado"];
const TableRecords: FunctionComponent<TableRecordsProps> = () => {
  const [Records, setRecords] = useState<RecordType[]>([]);
  const [MetaFields, setMeta] = useState<Meta>();
  const [Colonias, setColonias] = useState<ColoniaType[]>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [CodigosPostales, setCodigosPostales] = useState<any[]>();
  const [Estados, setEstados] = useState<EstadoType[]>();

  const { toast } = useToast();

  const getRecordsInit = () => {
    try {
      getRecords().then((recordsPaginated) => {
        const { records, colonias, codigosPostales } = recordsPaginated;
        setRecords(records.data);
        setMeta(records.meta);
        setColonias(colonias);
        setCodigosPostales(codigosPostales);
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch ({ message }: any) {
      toast({
        title: "Error al cargar registros",
        description: message || "Unexpected",
        variant: "destructive",
      });
    }
  };

  const findEstados = (record: RecordType) => {
    const estado = CodigosPostales?.find((cp) => cp.cp == record.cp)?.estado
    const finded = Estados?.find((item) => item.clave === estado)
    return finded?.nombreEstado
  }

  useEffect(() => {
    getRecordsInit();
    getEstados().then((data) => {
      setEstados(data)
    })
  }, []);
  return (
    <div className="bg-zinc-100 p-4 w-[700px] mx-auto mt-3 rounded-lg shadow-lg">
      <Table>
        <TableCaption>Lista de registros de Direcciones</TableCaption>
        <TableHeader>
          <TableRow>
            {labels.map((item, index) => (
              <TableHead key={`header-${index}`}>
                {item.toUpperCase()}
              </TableHead>
            ))}
            <TableHead>
              <Button className="size-9 p-1" onClick={getRecordsInit}>
                <RefreshCcw />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Records?.map((record, index) => (
            <TableRow key={`record-${index}`}>
              <TableCell>{record.id}</TableCell>
              <TableCell>{record.cp}</TableCell>
              <TableCell>{record.calle}</TableCell>
              <TableCell>
                {Colonias &&
                  Colonias.find((colonia) => colonia.clave == record.colonia)
                    ?.descripcion}
              </TableCell>
              <TableCell>
                {findEstados(record)}
              </TableCell>
              <TableCell>
                <Button className="size-9 p-1 bg-red-600">
                  <Trash2 />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {MetaFields && <Paginator meta={MetaFields} />}
    </div>
  );
};

export default TableRecords;
