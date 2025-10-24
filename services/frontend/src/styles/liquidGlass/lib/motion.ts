// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   motion.ts                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/10/24 11:55:08 by jeportie          #+#    #+#             //
//   Updated: 2025/10/24 11:59:02 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

export type Subscriber<T> = (value: T) => void;

export class MotionValue<T> {
    private _value: T;
    private subscribers: Subscriber<T>[] = [];

    constructor(initial: T) {
        this._value = initial;
    }

    get(): T {
        return this._value;
    }

    set(v: T): void {
        this._value = v;
        this.subscribers.forEach((fn) => fn(v));
    }

    onChange(fn: Subscriber<T>): () => void {
        this.subscribers.push(fn);
        fn(this._value);
        return () => {
            this.subscribers = this.subscribers.filter((f) => f !== fn);
        };
    }
}

/** Derived reactive value */
export function useTransform<A, B>(
    source: MotionValue<A>,
    transform: (v: A) => B
): MotionValue<B> {
    const mv = new MotionValue(transform(source.get()));
    source.onChange((v) => mv.set(transform(v)));
    return mv;
}

/** Spring interpolation (basic physics) */
export function useSpring(
    source: MotionValue<number>,
    opts: { stiffness: number; damping: number }
): MotionValue<number> {
    const mv = new MotionValue(source.get());
    let vel = 0;
    const dt = 1 / 60;

    const update = () => {
        const target = source.get();
        const x = mv.get();
        const fSpring = opts.stiffness * (target - x);
        const fDamp = opts.damping * vel;
        const a = (fSpring - fDamp);
        vel += a * dt;
        mv.set(x + vel * dt);
        requestAnimationFrame(update);
    };
    update();
    source.onChange(() => { }); // keep alive
    return mv;
}

