import * as Yup from "yup";

interface SearchProductFormValues {
  category?: string;
  search?: string;
}

const clientProductSearchSchema = Yup.object()
  .shape({
    category: Yup.string().optional(),
    search: Yup.string().optional(),
  })
  .test(
    "at-least-one",
    "Debe ingresar al menos un término de búsqueda o seleccionar una categoría.",
    (value) => {
      return !!(value.category || value.search);
    }
  );

export { clientProductSearchSchema };
export type { SearchProductFormValues };
