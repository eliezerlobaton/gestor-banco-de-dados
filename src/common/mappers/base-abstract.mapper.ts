export abstract class BaseAbstractMapper<I, O> {
  abstract mapTo(src: I): O;
  abstract mapFrom(dest: O): I;
}
