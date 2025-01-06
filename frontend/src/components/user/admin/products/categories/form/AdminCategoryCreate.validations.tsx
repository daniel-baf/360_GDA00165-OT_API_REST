import { ProductCategory } from "@components/user/client/products/product.types";
import * as yup from "yup";

interface FormDataCategoryCreate extends Omit<ProductCategory, "id"> {
  id?: number;
}

interface AdminCategoryCreateProps {
  id?: number;
  nombre?: string;
  descripcion?: string;
  onSubmit: (data: FormDataCategoryCreate) => void;
}

const schema = yup.object().shape({
  id: yup.number().optional(),
  nombre: yup.string().required("Nombre es requerido"),
  descripcion: yup.string().required("Descripción es requerida"),
});

export { schema };
export type { AdminCategoryCreateProps, FormDataCategoryCreate };
