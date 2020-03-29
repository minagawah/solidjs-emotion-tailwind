/** @prettier */

import { map, addIndex } from 'ramda';
import { int, mapKeys } from '@/lib/utils';
import { importPIXI, removeChildren } from '@/lib/pixi';
import { getDotSize, getLabelSize } from '../helper';

const DOT_KEYS = ['o'];

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
  circle: {
    stroke: null,
    cx: 0, // Center of the arc (X).
    cy: 0, // Center of the arc (Y).
    beg: 0, // Starting angle (radian) for the arc.
    end: 0, // Ending angle (radian) for the arc.
    radius: 1,
  },
  atOnce: false, // No gradual draw, but draw at once.
};

const SPEED = Math.PI * 0.05;
const END_ANGLE = Math.PI * 2;

let PIXI;

export const getRadius = (view = {}) =>
  int(Math.min(view.width, view.height) * 0.4);

export const createStep1 = async (options = {}) => {
  if (!PIXI) {
    PIXI = await importPIXI();
  }

  const { stroke = '#ffffff', fill = '#ffffff' } = options;

  const $_ = {};

  let status;

  $_.getStatus = () => status;

  $_.reset = () => {
    // console.log('[anim/Compass] (Hexagon: Step 1) ++++ reset()');
    $_.data = { dot: {}, label: {}, circle: {} };

    $_.data.circle = { ...DEFAULT_PROPERTIES['circle'] };
    $_.data.circle.stroke = PIXI.utils.string2hex(stroke);

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

    $_.circle && $_.circle.clear();

    status = 'WAIT';
  };

  $_.destroy = () => {
    // console.log('[anim/Compass] (Hexagon: Step 1) ++++ destroy()');
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
    $_.circle && $_.circle.destroy();

    $_.data = $_.dot = $_.label = $_.circle = $_.ct = status = void 0;
  };

  $_.init = () => {
    // console.log('[anim/Compass] (Hexagon: Step 1) ++++ init()');
    status = 'WAIT';
    $_.reset();
    $_.ct = new PIXI.Container();

    $_.circle = new PIXI.Graphics();
    $_.circle.rotation = Math.PI * 0.5;
    $_.ct.addChild($_.circle);

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
    // console.log('[anim/Compass] (Hexagon: Step 1) ++++ resize()');
    const { width, height } = view;

    if (!width || !height) return;

    const dotsize = getDotSize(view);
    const labelsize = getLabelSize(view);

    const getDotPos = {
      o: (view = {}) => ({
        x: int(view.width / 2),
        y: int(view.height / 2),
      }),
    };

    // Calculate radius, cx, cy, x, and y.
    $_.data.circle.radius = getRadius(view);
    $_.data.circle.cx = 0;
    $_.data.circle.cy = 0;

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

    // CIRCLE is NOT drawn here, but every "resize".
    $_.circle.x = int(width / 2);
    $_.circle.y = int(height / 2);

    if (status === 'PROGRESS') {
      $_.data.circle.end = 0;
    }

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

    if (status === 'PROGRESS') {
      if ($_.data.circle.end < END_ANGLE) {
        if ($_.atOnce) {
          $_.data.circle.end = END_ANGLE; // Draw the circle at once.
        } else {
          $_.data.circle.end += SPEED; // Gradually draw.
        }
        $_.circle.clear();
        $_.circle.lineStyle(1, $_.data.circle.stroke);
        $_.circle.arc(
          $_.data.circle.cx,
          $_.data.circle.cy,
          $_.data.circle.radius,
          $_.data.circle.beg,
          $_.data.circle.end
        );
      }
    }
  };

  $_.run = (view, options = {}) => {
    // console.log('[anim/Compass] (Hexagon: Step 1) ++++ run()');
    const { atOnce, stroke } = options;
    $_.reset();
    if (typeof atOnce === 'boolean') {
      $_.atOnce = atOnce;
    }
    if (stroke) {
      $_.data.circle.stroke = PIXI.utils.string2hex(stroke);
    }
    $_.resize(view);
    status = 'PROGRESS';
  };

  $_.pause = () => (status = 'WAIT');
  $_.resume = () => (status = 'PROGRESS');
  $_.stop = () => (status = 'SUCCESS');

  $_.init();

  return $_;
};
