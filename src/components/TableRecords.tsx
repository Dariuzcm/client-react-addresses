import { FunctionComponent, useContext, useEffect, useState } from "react";
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
import { deleteRecord, getRecords } from "@/api/apiHandler";

import { Trash2, RefreshCcw, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import Paginator from "./Paginator";
import { useToast } from "./ui/use-toast";
import { CPContext } from "@/Provider";
import { deleteGlobalRecords, setGlobalRecords } from "@/Actions/Actions";

interface TableRecordsProps {}

const labels: string[] = ["id", "cp", "calle", "colonia", "estado"];
const TableRecords: FunctionComponent<TableRecordsProps> = () => {
  const { state, dispatch } = useContext(CPContext)!;
  const { records: Records } = state;
  const [MetaFields, setMeta] = useState<Meta>();
  const [Colonias, setColonias] = useState<ColoniaType[]>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [CodigosPostales, setCodigosPostales] = useState<any[]>();
  const [Estados, setEstados] = useState<EstadoType[]>();
  const [Loading, setLoading] = useState<number | undefined>();

  const { toast } = useToast();

  const getRecordsInit = () => {
    setLoading(0);
    try {
      getRecords().then((recordsPaginated) => {
        const { records, colonias, codigosPostales } = recordsPaginated;
        dispatch(setGlobalRecords(records.data));
        setMeta(records.meta);
        setColonias(colonias);
        setCodigosPostales(codigosPostales);
        setLoading(undefined)
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch ({ message }: any) {
      toast({
        title: "Error al cargar registros",
        description: message || "Unexpected",
        variant: "destructive",
      });
      setLoading(undefined);
    }
  };

  const findEstados = (record: RecordType) => {
    const estado = CodigosPostales?.find((cp) => cp.cp == record.cp)?.estado;
    const finded = Estados?.find((item) => item.clave === estado);
    return finded?.nombreEstado;
  };

  const handleOnDelete = (id: number) => {
    setLoading(id);
    deleteRecord(id).then(() => { 
      dispatch(deleteGlobalRecords(id))
      toast({
        title: "Registro Eliminado con exito",
        description: "Registro eliminado",
        variant: "default",
      });
      setLoading(undefined)
    })
    .catch((e) => {
      const { message } = e
      setLoading(undefined)
      toast({
        title: "Error al eliminar registro",
        description: message || "Unexpected",
        variant: "destructive",
      });
    });

  };

  useEffect(() => {
    if (state) {
      setEstados(state.estados);
      getRecordsInit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.estado]);

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
              <Button
                className="size-9 p-1"
                onClick={getRecordsInit}
                variant={"outline"}
              >
                {Loading === 0 ? (
                  <RefreshCcw className={`transition-transform animate-spin`} />
                ) : (
                  <RefreshCcw className={`scale-90`} />
                )}
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="transition-all">
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
              <TableCell>{findEstados(record)}</TableCell>
              <TableCell>
                <Button
                  onClick={() => handleOnDelete(record.id)}
                  className="size-9 p-1"
                  variant={"destructive"}
                >
                  {Loading === record.id ? (
                    <span className="text-white transition-transform animate-spin">
                      <Loader2 className="scale-75" />
                    </span>
                  ) : (
                    <Trash2 />
                  )}
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
