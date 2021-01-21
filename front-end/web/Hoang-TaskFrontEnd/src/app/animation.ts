import {
  trigger,
  animate,
  transition,
  style,
  query,
  group,
  animateChild,
  keyframes,
} from '@angular/animations';

// Basic
export const fader = trigger('routeAnimations', [
  transition('* <=> *', [
    // Starting point //
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          width: '100%',
          opacity: 0,
        }),
      ],
      { optional: true }
    ),
    query(
      ':leave',
      [style({ opacity: 1 }), animate('0.3s', style({ opacity: 0 }))],
      { optional: true }
    ),
    // query(
    //   ':enter',
    //   [style({ opacity: 0 }), animate('0.3s', style({ opacity: 1 }))],
    //   { optional: true }
    // ),
  ]),
]);
