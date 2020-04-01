/** @prettier */

import { map } from 'ramda';
import { int, mapKeys } from '@/lib/utils';
import { str_to_hex } from '@/lib/color';
import { createStateMachine } from '@/lib/statemachine';
import { white, pink } from '@/constants/colors';
import {
  importPIXI,
  removeSpriteTexturesFromCache,
  removeChildren,
  makeSprite,
} from '@/lib/pixi';

import { getDotSize, getLabelSize } from '../helper';

let PIXI;

const SPEED = Math.PI * 0.05;
const BEG_ANGLE = 0;
const END_ANGLE = Math.PI * 2;

const DOT_KEYS = ['o'];

const DEFAULT_PROPERTIES = {
  dot: { size: 1, x: 0, y: 0, fill: white },
  label: {
    x: 0,
    y: 0,
    style: {
      fontFamily: 'Arial',
      fontSize: 1,
      fill: white,
    },
  },
  arc: {
    stroke: null,
    cx: 0, // Center of the arc (X).
    cy: 0, // Center of the arc (Y).
    beg: BEG_ANGLE, // Starting angle (radian) for the arc.
    end: BEG_ANGLE, // Ending angle (radian) for the arc.
    radius: 1,
  },
  atOnce: false, // No gradual draw, but draw at once.
};

/** @private */
const getDotPos = {
  o: ({ width, height }) => ({
    x: width / 2,
    y: height / 2,
  }),
};

export const getRadius = (view = {}) => Math.min(view.width, view.height) * 0.4;

export const createStep1 = async (options = {}) => {
  if (!PIXI) {
    PIXI = await importPIXI();
  }

  const { stroke = pink, fill = pink } = options;

  const $_ = {};

  let machine;
  let cnt = 0;

  $_.destroy = () => {
    console.log('[anim/Compass] (Hexagon: Step 1) ++++ destroy()');
    $_.reset();
    $_.ct && removeChildren($_.ct);
    map(
      type => {
        $_[type] &&
          mapKeys(key => {
            if ($_[type][key]) {
              $_[type][key].destroy();
            }
          }, $_[type]);
      },
      ['dot', 'label']
    );
    $_.arc && $_.arc.destroy();
    $_.dummy && $_.dummy.g && $_.dummy.g.destroy();
    $_.data = $_.dot = $_.label = $_.arc = $_.ct = machine = void 0;
  };

  $_.reset = () => {
    $_.data = { dot: {}, label: {}, arc: {} };

    // Reset data for ARC.
    $_.data.arc = { ...DEFAULT_PROPERTIES['arc'] };
    // Use "PIXI.utils.string2hex" alternatively.
    $_.data.arc.stroke = str_to_hex(stroke);

    // Reset data for DOTS and LABELS.
    map(key => {
      $_.data.dot[key] = { ...DEFAULT_PROPERTIES['dot'] };
      $_.data.dot[key].fill = str_to_hex(fill);
      $_.data.label[key] = { ...DEFAULT_PROPERTIES['label'] };
      $_.data.label[key].style.fontSize = 10;
      $_.data.label[key].style.fill = fill;
    }, DOT_KEYS);

    $_.atOnce = false;

    // Removing texture cache.
    map(
      type => {
        if ($_[type]) {
          mapKeys(key => {
            if ($_[type][key]) {
              removeSpriteTexturesFromCache($_[type][key]);
            }
          }, $_[type]);
        }
      },
      ['dot', 'label']
    );

    $_.arc && $_.arc.clear();

    machine.WAIT();

    cnt = 0;
  };

  $_.init = () => {
    machine = createStateMachine();

    $_.reset();

    $_.ct = new PIXI.Container();

    $_.dummy = { g: new PIXI.Graphics() };
    $_.ct.addChild($_.dummy.g);

    $_.arc = new PIXI.Graphics();
    $_.arc.rotation = Math.PI * 0.5; // Begins at the bottom.
    $_.ct.addChild($_.arc);

    $_.dot = {};
    $_.label = {};

    map(key => {
      $_.dot[key] = makeSprite(new PIXI.Graphics());
      $_.label[key] = makeSprite(new PIXI.Text('dummy'));
      $_.ct.addChild($_.dot[key], $_.label[key]);
    }, DOT_KEYS);
  };

  $_.resize = (view = {}) => {
    const { width, height } = view;

    if (!width || !height) return;

    const dotsize = getDotSize(view);
    const labelsize = getLabelSize(view);

    $_.data.arc.radius = getRadius(view);
    $_.data.arc.cx = 0;
    $_.data.arc.cy = 0;

    map(key => {
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

    map(key => {
      const { size, x, y, fill } = $_.data.dot[key];
      const g = new PIXI.Graphics();
      g.lineStyle(0);
      g.beginFill(fill, 1);
      g.drawCircle(0, 0, size);
      g.endFill();
      // Simply replacing the texture.
      $_.dot[key] = makeSprite(g, $_.dot[key]);
      $_.dot[key].pivot.x = size; // sprite needs pivotting
      $_.dot[key].pivot.y = size; // sprite needs pivotting
      $_.dot[key].x = x;
      $_.dot[key].y = y;
      $_.dot[key].visible = false;
      g.destroy();
    }, DOT_KEYS);

    map(key => {
      const { x, y, style } = $_.data.label[key];
      const text = new PIXI.Text(key.toUpperCase(), style);
      text.updateText();
      // Simply replacing the texture.
      $_.label[key] = makeSprite(text, $_.label[key]);
      $_.label[key].x = x;
      $_.label[key].y = y;
      $_.label[key].visible = false;
      // text.destroy()
    }, DOT_KEYS);

    // ARC is NOT drawn here, but every "resize".
    $_.arc.x = width / 2;
    $_.arc.y = height / 2;

    if (machine.IN_PROGRESS()) {
      $_.data.arc.end = BEG_ANGLE;
    }
  };

  $_.update = (delta = 0) => {
    const inProgress = machine.IN_PROGRESS();

    map(key => {
      $_.dot[key].visible = inProgress;
      $_.label[key].visible = inProgress;
    }, DOT_KEYS);

    if (inProgress) {
      if ($_.data.arc.end < END_ANGLE) {
        if ($_.atOnce) {
          $_.data.arc.end = END_ANGLE; // Draw the arc at once.
        } else {
          $_.data.arc.end += SPEED; // Gradually draw.
        }
        $_.arc.clear();
        $_.arc.lineStyle(1, $_.data.arc.stroke);
        $_.arc.arc(
          $_.data.arc.cx,
          $_.data.arc.cy,
          $_.data.arc.radius,
          $_.data.arc.beg,
          $_.data.arc.end
        );
      }
    }
    // cnt++;
  };

  $_.run = (view, options = {}) => {
    const { atOnce, stroke } = options;
    $_.reset();

    if (typeof atOnce === 'boolean') {
      $_.atOnce = atOnce;
    }

    if (stroke) {
      $_.data.arc.stroke = str_to_hex(stroke);
    }
    $_.resize(view);

    machine.PROGRESS();
  };

  $_.pause = () => machine.WAIT();
  $_.resume = () => machine.PROGRESS();
  $_.stop = () => machine.SUCCESS();

  $_.init();

  return $_;
};
