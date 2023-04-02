<svelte:options immutable/>

<script lang="ts">
  import {clamp, createFilter, getEventCoords} from "../utils";
  import {range, filter, histogram} from "../logic/store";
  

  let slider: HTMLElement;
  let dragging = false;
  let model: Immutable<SliderSelection> = {s: 0.33, e: 1};
  
  $: bounds = createFilter($range, model) as Immutable<DateRange>;
  range.subscribe(range => $filter = createFilter(range, model));

  function draggable(node: HTMLElement) {
    const hookGrab = [['mousedown', grab], ['touchstart', grab]] as const;

    function grab(e: MouseEvent | TouchEvent) {
      const hooks = [['mousemove', move], ['touchmove', move], ['mouseup', release], ['touchend', release]] as const;
      const [oldX, _] = getEventCoords(e);
      const baseline = {...model, x: oldX};
      dragging = true;

      function move(e: MouseEvent | TouchEvent) {
        const [x, _] = getEventCoords(e);
        const detail: SliderDragEvent = {x, baseline};
        node.dispatchEvent(new CustomEvent('dragged', {detail}));
      }

      function release(_: MouseEvent | TouchEvent) {
        for (const [type, func] of hooks)
          document.removeEventListener(type, func);
        dragging = false;
        $filter = createFilter($range, model);
      }

      for (const [type, func] of hooks)
        document.addEventListener(type, func);
    }

    for (const [type, func] of hookGrab)
      node.addEventListener(type, func);
    return {
      destroy() {
        for (const [type, func] of hookGrab)
          node.removeEventListener(type, func);
      }
    }
  }

  function moveHandles(side: 'l' | 'r') {
    return function (e: CustomEvent<SliderDragEvent>) {
      const { left, width } = slider.getBoundingClientRect();
      const percent = clamp((e.detail.x - left) / width, 0, 1);
      switch (side) {
        case "l": return model = {s: percent, e: Math.max(model.e, percent)};
        case "r": return model = {s: Math.min(model.s, percent), e: percent};
      }
    }
  }

  function shiftSlider(e: CustomEvent<SliderDragEvent>) {
    const { width } = slider.getBoundingClientRect();
    const { x, baseline } = e.detail;
    const range = baseline.e - baseline.s;
    const shift = (x - baseline.x) / width;
    model = {
      s: clamp(baseline.s + shift, 0, 1 - range),
      e: clamp(baseline.e + shift, range, 1),
    }
  }
</script>


<div class="container" class:dragging style="--s:{model.s};--e:{model.e}">
  <div class="histogram">
    {#each $histogram as bin}
    <div class="bin" style="--percent: {bin.scaled}">
      {bin.count}
    </div>
    {/each}
  </div>

  <div class="slider" bind:this={slider}>
    <div class="range"
      use:draggable
      on:dragged|preventDefault|stopPropagation={shiftSlider}>
    </div>
    <div class="handle left" data-date={bounds.s.format("DD-MM-YYYY")}
      use:draggable
      on:dragged|preventDefault|stopPropagation={moveHandles('l')}>
    </div>
    <div class="handle right" data-date={bounds.e.format("DD-MM-YYYY")}
      use:draggable
      on:dragged|preventDefault|stopPropagation={moveHandles('r')}>
    </div>
  </div>
</div>


<style lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 40em;
    height: 8em;
    user-select: none;
    white-space: nowrap;
    --s: 0;
    --e: 1;

    .histogram {
      display: flex;
      align-items: flex-end;
      justify-content: space-evenly;
      height: 4em;
      margin-bottom: 1em;

      .bin {
        position: relative;
        height: calc(100% * var(--percent));
        background-color: gray;
        writing-mode: vertical-rl;
        text-orientation: mixed;
      }
    }

    .slider {
      position: relative;
      width: 100%;
      height: 0.5em;
      border-radius: 1px;
      background-color: #e2e2e2;
      box-shadow: inset 0 7px 10px -5px #4a4a4a, inset 0 -1px 0 0 #9c9c9c;
    }

    .handle {
      position: absolute;
      top: 50%;
      width: 0;
      height: 0;

      &::after {
        content: ' ';
        box-sizing: border-box;
        position: absolute;
        border-radius: 50%;
        width: 1.4em;
        height: 1.4em;
        background-color: #fdfdfd;
        border: 1px solid #7b7b7b;
        transform: translate(-50%, -50%)
      }
      &:active::after {
        background-color: #ddd;
      }
      &.left {
        left: calc(100% * var(--s));
      }
      &.right {
        left: calc(100% * var(--e));
      }
    }

    .range {
      position: absolute;
      top: 0;
      bottom: 0;
      left: calc(100% * var(--s));
      right: calc(100% * (1 - var(--e)));
      background-color: #34a1ff;
    }

    &.dragging {
      .handle::before {
        content: attr(data-date);
        display: block;
        position: absolute;
        transform: translate(-50%, -150%);
        z-index: 10;
        padding: 0 0.4em;
        background-color: black;
        color: white;
        opacity: 0.5;
        border-radius: 4px;
      }
    }
  }
</style>
