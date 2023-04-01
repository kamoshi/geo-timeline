declare namespace svelteHTML {
  interface HTMLAttributes<T> {
    'on:dragged'?: (event: CustomEvent<SliderDragEvent>) => void;
  }
}
