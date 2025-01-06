import { ProductCategory } from "@components/user/client/products/product.types";
import * as yup from "yup";

interface FormDataCategoryCreate extends Omit<ProductCategory, "id"> {
  id?: number;
}

interface AdminCategoryCreateProps {
  codigo?: string;
  nombre?: string;
  descripcion?: string;
  onSubmit: (data: FormDataCategoryCreate) => void;
}

const schema = yup.object().shape({
  codigo: yup.string().optional(),
  nombre: yup.string().required("Nombre es requerido"),
  descripcion: yup.string().required("Descripción es requerida"),
});

export { schema };
export type { AdminCategoryCreateProps, FormDataCategoryCreate };
