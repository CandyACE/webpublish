export var fixTileJSONCenter = tileJSON => {
  if (tileJSON.bounds && !tileJSON.center) {
    if (tileJSON.bounds && !tileJSON.center) {
      const fitWidth = 1024;
      const tiles = fitWidth / 256;
      tileJSON.center = [
        (tileJSON.bounds[0] + tileJSON.bounds[2]) / 2,
        (tileJSON.bounds[1] + tileJSON.bounds[3]) / 2,
        Math.round(
          -Math.log((tileJSON.bounds[2] - tileJSON.bounds[0]) / 360 / tiles) /
          Math.LN2
        )
      ];
    }
  }
}