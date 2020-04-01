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

import { getRadius } from './step1.js';

let PIXI;

const SPEED = Math.PI * 0.05;
const BEG_ANGLE = 0;
const END_ANGLE = Math.PI;

const DOT_KEYS = ['a', 'b', 'f'];

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
};

/** @private */
const getDotPos = (() => {
  const a = (view = {}) => {
    const { width, height } = view;
    const radius = getRadius(view);
    return {
      x: width / 2,
      y: height / 2 + radius,
    };
  };

  const b = (view = {}) => {
    const apos = a(view);
    const radius = getRadius(view);
    return {
      x: apos.x - (radius * Math.sqrt(3)) / 2,
      y: apos.y - radius / 2,
    };
  };

  const f = (view = {}) => {
    const apos = a(view);
    const radius = getRadius(view);
    return {
      x: apos.x + (radius * Math.sqrt(3)) / 2,
      y: apos.y - radius / 2,
    };
  };

  return { a, b, f };
})();

export const createStep2 = async (options = {}) => {
  if (!PIXI) {
    PIXI = await importPIXI();
  }

  const { stroke = pink, fill = pink } = options;

  const $_ = {};

  let machine;
  let cnt = 0;

  $_.getStatus = () => status;

  $_.destroy = () => {
    console.log('[anim/Compass] (Hexagon: Step 2) ++++ destroy()');
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
    $_.arc && $_.arc.destroy();
    $_.dummy && $_.dummy.g && $_.dummy.g.destroy();
    $_.data = $_.dot = $_.label = $_.ct = $_.dummy = machine = void 0;
  };

  $_.reset = () => {
    $_.data = { dot: {}, label: {}, arc: {} };

    // Reset data for ARC.
    $_.data.arc = { ...DEFAULT_PROPERTIES['arc'] };
    // Use "str_to_hex" alternatively.
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
    $_.arc.rotation = Math.PI; // Begins on the left.
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

    // (({ x, y }) => {
    //   const { g } = $_.dummy;
    //   // const fillColor = str_to_hex(fill);
    //   g.clear();
    //   g.lineStyle(1, 0xffffff);
    //   g.drawRect(0, y, width, 30);
    //   g.visible = false;
    // })(getDotPos.a(view));

    // ARC is NOT drawn here, but every "resize".
    (({ x, y }) => {
      $_.arc.x = x;
      $_.arc.y = y;
    })(getDotPos.a(view));

    if (machine.IN_PROGRESS()) {
      $_.data.arc.end = BEG_ANGLE;
    }
  };

  $_.update = (delta = 0) => {
    const inProgress = machine.IN_PROGRESS();

    $_.dummy.g.visible = inProgress;

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
    const { atOnce } = options;
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

  $_.runAtOnce = (view, options) => {
    $_.run(view, { atOnce: true, ...options });
  };

  $_.pause = () => machine.WAIT();
  $_.resume = () => machine.PROGRESS();
  $_.stop = () => machine.SUCCESS();

  $_.init();

  return $_;
};
