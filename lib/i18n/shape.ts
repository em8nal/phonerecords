// Solo tipos (no se carga en ejecución): comprobación de forma entre idiomas para lib/translations.ts.
// Shape<T> reduce cada hoja a su tipo (string, number, boolean) y conserva las claves y el largo de cada tupla.
export type Shape<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : { readonly [K in keyof T]: Shape<T[K]> };

// true solo si A y B tienen las mismas claves y los mismos largos de arreglo, a cualquier profundidad.
export type SameShape<A, B> = [Shape<A>] extends [Shape<B>] ? ([Shape<B>] extends [Shape<A>] ? true : false) : false;

// Da TS2344 si T no es `true`.
export type AssertTrue<T extends true> = T;
