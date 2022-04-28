import express from 'express'
import fs from 'fs'
import { clone } from 'lodash';
import path from 'path'
import logger from '../../../Logger';
import { validate } from '@mapbox/mapbox-gl-style-spec'

const _styleJSON = JSON.parse(fs.readFileSync(path.join(__static, "styles/styles/osm_liberty.json")));

try {
  // let validationErrors = validate(_styleJSON)
  // if (validationErrors.length > 0) {
  //   logger.error(`The file "${params.style}" is not valid a valid style file:`);
  //   for (const err of validationErrors) {
  //     logger.error(`${err.line}: ${err.message}`);
  //   }
  // }

  for (const obj of _styleJSON.layers) {
    if (obj['type'] === 'symbol') {
      if (obj['layout']['text-font']) {
        obj['layout']['text-font'] = ['Noto Sans Regular']
      }
    }
  }

} catch (error) {
  logger.error(error)
}

const fixUrl = (req, url) => {
  if (!url || (typeof url !== 'string') || url.indexOf('local://') !== 0) {
    return url;
  }


  return url.replace('local://', `http://${req.headers.host}/`).replace('{id}', req.task.id)
}

var StyleRouter = {
  init: function () {
    const app = express().disable('x-powered-by');

    app.get('/style.json', (req, res, next) => {
      const task = req.task;
      if (!task) return res.sendStatus(404);

      const styleJSON = clone(_styleJSON);
      for (const name of Object.keys(styleJSON.sources)) {
        const source = styleJSON.sources[name];
        source.url = fixUrl(req, source.url)
      }

      if (styleJSON.sprite) {
        styleJSON.sprite = fixUrl(req, styleJSON.sprite)
      }
      if (styleJSON.glyphs) {
        styleJSON.glyphs = fixUrl(req, styleJSON.glyphs)
      }
      return res.send(styleJSON)
    })

    return app;
  }
}

export default StyleRouter