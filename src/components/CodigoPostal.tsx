import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { ChangeEvent, FunctionComponent, useEffect, useState } from "react";
import { FIELDS_DATA } from "@/lib/constants";

interface CodigoPostalProps {
  onBlur?: (values: BlurProps) => void,
  CPvalue?:  string
}

export type BlurProps = {
  name: string,
  value: number
}

const CodigoPostal: FunctionComponent<CodigoPostalProps> = (props) => {
  const { onBlur, CPvalue } = props

  const [Cp, setCp] = useState<string>("");
  const handleOnBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if((Number(value) || '') && onBlur) {
      onBlur({name, value: Number(value)})
    }
  }
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if(value.length > 5) return
    if(Number(value) || value === FIELDS_DATA.CP) {
      setCp(value)
    }
  }

  const ChangeCPValue = (value: string) => {
    setCp(value)
  }
  useEffect(() => {
    if(CPvalue)
      ChangeCPValue(CPvalue)
  }, [CPvalue]);
  
  return (
    <>
      <Label className="font-semibold text-sm" htmlFor="cp">Codigo Postal</Label>
      <Input
        name="codigo_postal"
        type="cp"
        placeholder="Código postal"
        value={Cp}
        onChange={handleOnChange}
        onBlur={handleOnBlur}
      />
    </>
  );
}

export default CodigoPostal;
