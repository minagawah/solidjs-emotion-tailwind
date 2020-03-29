/** @prettier */

import { map, addIndex } from 'ramda';
import { int, mapKeys } from '@/lib/utils';
import { importPIXI, removeChildren } from '@/lib/pixi';
import { getDotSize, getLabelSize } from '../helper';

import { getRadius } from './step1.js';

const DOT_KEYS = ['a'];

const DEFAULT_PROPERTIES = {
  dot: { size: 1, x: 0, y: 0, fill: '#ffffff' },
  label: {
    x: 0,
    y: 0,
    style: {
      fontFamily: 'Arial',
      fontSize: 1,
      fill: '#ffffff',
    },
  },
};

let PIXI;

export const createStep2 = async (options = {}) => {
  if (!PIXI) {
    PIXI = await importPIXI();
  }

  const { fill = '#ffffff' } = options;

  const $_ = {};

  let status;

  $_.getStatus = () => status;

  $_.reset = () => {
    // console.log('[anim/Compass] (Hexagon: Step 2) ++++ reset()');
    $_.data = { dot: {}, label: {} };

    map(key => {
      $_.data.dot[key] = { ...DEFAULT_PROPERTIES['dot'] };
      $_.data.dot[key].x = 0;
      $_.data.dot[key].y = 0;
      $_.data.dot[key].fill = PIXI.utils.string2hex(fill);

      $_.data.label[key] = { ...DEFAULT_PROPERTIES['label'] };
      $_.data.label[key].x = 0;
      $_.data.label[key].y = 0;
      $_.data.label[key].style.fontSize = 10;
      $_.data.label[key].style.fill = fill;
    }, DOT_KEYS);

    $_.atOnce = false;

    if ($_.dot) {
      mapKeys(key => {
        $_.dot[key] && $_.dot[key].clear(); // Clear graphics.
      }, $_.dot);
    }

    status = 'WAIT';
  };

  $_.destroy = () => {
    // console.log('[anim/Compass] (Hexagon: Step 2) ++++ destroy()');
    $_.reset();
    $_.ct && removeChildren($_.ct);
    map(
      key => {
        $_[key] &&
          mapKeys(key2 => {
            $_[key][key2] && $_[key][key2].destroy();
          }, $_[key]);
      },
      ['dot', 'label']
    );
    $_.data = $_.dot = $_.label = $_.ct = status = void 0;
  };

  $_.init = () => {
    // console.log('[anim/Compass] (Hexagon: Step 2) ++++ init()');
    status = 'WAIT';
    $_.reset();
    $_.ct = new PIXI.Container();

    // Create graphics and texts.
    $_.dot = {};
    $_.label = {};
    map(key => {
      $_.dot[key] = new PIXI.Graphics();
      $_.label[key] = new PIXI.Text(key.toUpperCase());
      $_.ct.addChild($_.dot[key], $_.label[key]);
    }, DOT_KEYS);
  };

  $_.resize = (view = {}) => {
    // console.log('[anim/Compass] (Hexagon: Step 2) ++++ resize()');
    const { width, height } = view;

    if (!width || !height) return;

    const dotsize = getDotSize(view);
    const labelsize = getLabelSize(view);

    const getDotPos = {
      a: (view = {}) => {
        const { width, height } = view;
        const radius = getRadius(view);
        return {
          x: int(width / 2),
          y: int(height - (height / 2 - radius)),
        };
      },
    };

    // Calculate size, x, and y.
    addIndex(map)((key, i) => {
      const dotpos = getDotPos[key](view);
      $_.data.dot[key].size = dotsize;
      $_.data.dot[key].x = dotpos.x;
      $_.data.dot[key].y = dotpos.y;
      $_.data.label[key].style.fontSize = labelsize;
      $_.data.label[key].x = dotpos.x + labelsize / 2;
      $_.data.label[key].y = dotpos.y - labelsize;
    }, DOT_KEYS);

    $_.ct.x = 0;
    $_.ct.y = 0;

    // Draw DOTS
    map(key => {
      const { size, x, y, fill } = $_.data.dot[key];
      $_.dot[key].clear();
      $_.dot[key].lineStyle(0);
      $_.dot[key].beginFill(fill, 1);
      $_.dot[key].drawCircle(x, y, size);
      $_.dot[key].endFill();
      $_.dot[key].visible = false;
    }, DOT_KEYS);

    // Draw LABELS
    map(key => {
      const { x, y, style } = $_.data.label[key];
      $_.label[key].style = style;
      $_.label[key].x = x;
      $_.label[key].y = y;
      $_.label[key].visible = false;
    }, DOT_KEYS);
  };

  $_.update = (delta = 0) => {
    const isVisible = status === 'PROGRESS';
    map(key => {
      $_.dot[key].visible = isVisible;
      $_.label[key].visible = isVisible;
    }, DOT_KEYS);
  };

  $_.run = (view, options = {}) => {
    const { atOnce } = options;
    $_.reset();
    if (typeof atOnce === 'boolean') {
      $_.atOnce = atOnce;
    }
    $_.resize(view);
    status = 'PROGRESS';
  };

  $_.runAtOnce = (view, options) => {
    $_.run(view, { atOnce: true, ...options });
  };

  $_.pause = () => (status = 'WAIT');
  $_.resume = () => (status = 'PROGRESS');
  $_.stop = () => (status = 'SUCCESS');

  $_.init();

  return $_;
};
