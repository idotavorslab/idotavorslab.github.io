declare namespace Gsap {
    class Animation {
        /**
         * Base class for all TweenLite, TweenMax, TimelineLite, and TimelineMax classes, providing core methods/properties/() => voidality, but there is no reason to create an instance of this
         * class directly.
         */
        constructor(duration?: number, vars?: Gsap.Vars);
        
        /**
         * A place to store any data you want (initially populated with vars.data if it exists).
         */
        data: any;
        
        /** [Read-only] Parent timeline. */
        readonly timeline: Gsap.SimpleTimeline;
        
        /** The vars object passed into the constructor which stores configuration variables like onComplete, onUpdate, etc. */
        vars: Gsap.Vars;
        
        /** Gets or sets the animation's initial delay which is the length of time in seconds (or frames for frames-based tweens) before the animation should begin. */
        delay(): number;
        delay(value: number): Gsap.Animation;
        
        /** Gets or sets the animation's duration, not including any repeats or repeatDelays (which are only available in TweenMax and TimelineMax). */
        duration(): number;
        duration(value: number): Gsap.Animation;
        
        /** Returns the time at which the animation will finish according to the parent timeline's local time. */
        endTime(includeRepeats?: boolean): number;
        
        /**
         * Gets or sets an event callback like "onComplete", "onUpdate", "onStart", "onReverseComplete" or "onRepeat" (onRepeat only applies to TweenMax or TimelineMax instances) along with any
         * parameters that should be passed to that callback.
         */
        eventCallback(type: Gsap.EventCallback): (...args: any[]) => void;
        eventCallback(type: Gsap.EventCallback, callback: (...args: any[]) => void, params?: any[], scope?: any): Gsap.Animation;
        
        /**
         * Clears any initialization data (like starting/ending values in tweens) which can be useful if, for example, you want to restart a tween without reverting to any previously recorded
         * starting values.
         */
        invalidate(): Gsap.Animation;
        
        /**
         * Indicates whether or not the animation is currently active (meaning the virtual playhead is actively moving across this instance's time span and it is not paused, nor are any of its
         * ancestor timelines).
         */
        isActive(): boolean;
        
        /** Kills the animation entirely or in part depending on the parameters. */
        kill(vars: Gsap.Vars, target?: Gsap.Target): Gsap.Animation;
        
        /** Pauses the instance, optionally jumping to a specific time. */
        pause(atTime?: any, suppressEvents?: boolean): Gsap.Animation;
        
        /** Gets or sets the animation's paused state which indicates whether or not the animation is currently paused. */
        paused(): boolean;
        paused(value: boolean): Gsap.Animation;
        
        /** Begins playing forward, optionally from a specific time (by default playback begins from wherever the playhead currently is). */
        play(from?: any, suppressEvents?: boolean): Gsap.Animation;
        
        /**
         * Gets or sets the animations's progress which is a value between 0 and 1 indicating the position of the virtual playhead (excluding repeats) where 0 is at the beginning, 0.5 is at the
         * halfway point, and 1 is at the end (complete).
         */
        progress(): number;
        progress(value: number, suppressEvents?: boolean): Gsap.Animation;
        
        /** Restarts and begins playing forward from the beginning. */
        restart(includeDelay?: boolean, suppressEvents?: boolean): Gsap.Animation;
        
        /** Resumes playing without altering direction (forward or reversed), optionally jumping to a specific time first. */
        resume(from?: any, suppressEvents?: boolean): Gsap.Animation;
        
        /** Reverses playback so that all aspects of the animation are oriented backwards including, for example, a tween's ease. */
        reverse(from?: any, suppressEvents?: boolean): Gsap.Animation;
        
        /** Gets or sets the animation's reversed state which indicates whether or not the animation should be played backwards. */
        reversed(): boolean;
        reversed(value: boolean): Gsap.Animation;
        
        /** Jumps to a specific time without affecting whether or not the instance is paused or reversed. */
        seek(time: any, suppressEvents?: boolean): Gsap.Animation;
        
        /** Gets or sets the time at which the animation begins on its parent timeline (after any delay that was defined). */
        startTime(): number;
        startTime(value: number): Gsap.Animation;
        
        /**
         * Gets or sets the local position of the playhead (essentially the current time), described in seconds (or frames for frames-based animations) which will never be less than 0 or greater
         * than the animation's duration.
         */
        time(): number;
        time(value: number, suppressEvents?: boolean): Gsap.Animation;
        
        /** Factor that's used to scale time in the animation where 1 = normal speed (the default), 0.5 = half speed, 2 = double speed, etc. */
        timeScale(): number;
        timeScale(value: number): Gsap.Animation;
        
        /** Gets or sets the animation's total duration including any repeats or repeatDelays (which are only available in TweenMax and TimelineMax). */
        totalDuration(): number;
        totalDuration(value: number): Gsap.Animation;
        
        /**
         * Gets or sets the animation's total progress which is a value between 0 and 1 indicating the position of the virtual playhead (including repeats) where 0 is at the beginning, 0.5 is at
         * the halfway point, and 1 is at the end (complete).
         */
        totalProgress(): number;
        totalProgress(value: number, suppressEvents?: boolean): Gsap.Animation;
        
        /** Gets or sets the position of the playhead according to the totalDuration which includes any repeats and repeatDelays (only available in TweenMax and TimelineMax). */
        totalTime(): number;
        totalTime(time: number, suppressEvents?: boolean): Gsap.Animation;
    }
    
    class Ticker {
        addEventListener(type: "tick", callback: (...args: any[]) => void, scope: object, useParams: boolean, priority: number)
        
        removeEventListener(type: "tick", callback: (...args: any[]) => void)
        
        useRAF(turnOn: boolean)
        
        fps(val: number)
    }
    
    class Tween extends Gsap.Animation {
        constructor(target: any, duration: number, vars: any);
        
        /** Provides An easy way to change the default easing equation. */
        static defaultEase: Gsap.Easing.Ease;
        
        /** Provides An easy way to change the default overwrite mode. */
        static defaultOverwrite: Gsap.Overwrite;
        
        /** A function that should be called when any tween gets overwritten by another tween (great for debugging).*/
        static onOverwrite: (overwrittenTween: Gsap.Animation, overwritingTween: Gsap.Animation, target: Gsap.Target, overwrittenProperties: any[]) => any;
        
        /** The selector engine (like jQuery) that should be used when a tween receives a string as its target, like TweenLite.to("#myID", 1, {x:"100px"}). */
        static selector: (query: QuerySelector) => any;
        
        
        /** Target object (or array of objects) whose properties the tween affects. */
        readonly target: Gsap.Target;
        
        /**
         * The object that dispatches a "tick" event each time the engine updates, making it easy for you to add your own listener(s) to run custom logic after each update
         * (great for game developers).
         */
        static ticker: Gsap.Ticker;
        
        
        /** Provides a simple way to call a () => void after a set amount of time (or frames). */
        delayedCall(delay: number, callback: (...args: any[]) => void, params?: any[], scope?: any, useFrames?: boolean): Gsap.Tween;
        
        /**
         * Static method for creating a TweenLite instance that tweens backwards - you define the BEGINNING values and the current values are used as the destination values which is great for doing
         * things like animating objects onto the screen because you can set them up initially the way you want them to look at the end of the tween and then animate in from elsewhere.
         */
        from(target: Gsap.Target, duration: number, vars: Gsap.Vars): Gsap.Tween;
        
        /**
         * Static method for creating a TweenLite instance that allows you to define both the starting and ending values (as opposed to to() and from() tweens which are based on the target's
         * current values at one end or the other).
         */
        fromTo(target: Gsap.Target, duration: number, fromVars: any, toVars: ToVars): Gsap.Tween;
        
        /**
         * Returns an array containing all the tweens of a particular target (or group of targets) that have not been released for garbage collection yet which typically happens within a few
         * seconds after the tween completes.
         */
        getTweensOf(target: any, onlyActive?: boolean): Gsap.Tween[];
        
        /**
         * [override] Clears any initialization data (like starting/ending values in tweens) which can be useful if, for example, you want to restart a tween without reverting to any previously
         * recorded starting values.
         */
        invalidate(): Gsap.Tween;
        
        /** Immediately kills all of the delayedCalls to a particular () => void. */
        killDelayedCallsTo(func: (...args: any[]) => void): void;
        
        /** Kills all the tweens (or specific tweening properties) of a particular object or delayedCalls to a particular () => void. */
        killTweensOf(target: object | object[], onlyActive?: boolean, vars?: object): void;
        
        /** Permits you to control what happens when too much time elapses between two ticks (updates) of the engine, adjusting the core timing mechanism to compensate and avoid "jumps". */
        lagSmoothing(threshold: number, adjustedLag: number): void;
        
        /**
         * Forces a render of all active tweens which can be useful if, for example, you set up a bunch of from() tweens and then you need to force an immediate render (even of "lazy" tweens) to
         * avoid a brief delay before things render on the very next tick.
         */
        render(): void;
        
        /** Immediately sets properties of the target accordingly - essentially a zero-duration to() tween with a more intuitive name. */
        set(target: any, vars: object): Gsap.Tween;
        
        /** Static method for creating a TweenLite instance that animates to the specified destination values (from the current values). */
        to(target: object, duration: number, vars: ToVars): Gsap.Tween;
    }
    
    class SimpleTimeline extends Animation {
        /**
         * SimpleTimeline is the base class for TimelineLite and TimelineMax, providing the most basic timeline () => voidality and it is used for the root timelines in TweenLite but is only
         * intended for internal use in the GreenSock tweening platform. It is meant to be very fast and lightweight.
         */
        constructor(vars?: any);
        
        /** If true, child tweens/timelines will be removed as soon as they complete. */
        autoRemoveChildren: boolean;
        
        /** Controls whether or not child tweens/timelines are repositioned automatically (changing their startTime) in order to maintain smooth playback when properties are changed on-the-fly. */
        smoothChildTiming: boolean;
        
        /** Adds a TweenLite, TweenMax, TimelineLite, or TimelineMax instance to the timeline at a specific time. */
        add(child: any, position?: any, align?: string, stagger?: number): SimpleTimeline;
        
        /** renders */
        render(time: number, suppressEvents?: boolean, force?: boolean): SimpleTimeline;
    }
    
    namespace Easing {
        class Ease {
            constructor(func?: (...args: any[]) => void, extraParams?: any[], type?: number, power?: number);
            
            /** Translates the tween's progress ratio into the corresponding ease ratio. */
            getRatio(p: number): number;
        }
        
        interface EaseLookup {
            find(name: string): Ease;
        }
        
        class Back extends Ease {
            static easeIn: Back;
            static easeInOut: Back;
            static easeOut: Back;
            
            config(overshoot: number): Elastic;
        }
        
        class Bounce extends Ease {
            static easeIn: Bounce;
            static easeInOut: Bounce;
            static easeOut: Bounce;
        }
        
        class Circ extends Ease {
            static easeIn: Circ;
            static easeInOut: Circ;
            static easeOut: Circ;
        }
        
        class Cubic extends Ease {
            static easeIn: Cubic;
            static easeInOut: Cubic;
            static easeOut: Cubic;
        }
        
        class Elastic extends Ease {
            static easeIn: Elastic;
            static easeInOut: Elastic;
            static easeOut: Elastic;
            
            config(amplitude: number, period: number): Elastic;
        }
        
        class Expo extends Ease {
            static easeIn: Expo;
            static easeInOut: Expo;
            static easeOut: Expo;
        }
        
        class Linear extends Ease {
            static ease: Linear;
            static easeIn: Linear;
            static easeInOut: Linear;
            static easeNone: Linear;
            static easeOut: Linear;
        }
        
        class Quad extends Ease {
            static easeIn: Quad;
            static easeInOut: Quad;
            static easeOut: Quad;
        }
        
        class Quart extends Ease {
            static easeIn: Quart;
            static easeInOut: Quart;
            static easeOut: Quart;
        }
        
        class Quint extends Ease {
            static easeIn: Quint;
            static easeInOut: Quint;
            static easeOut: Quint;
        }
        
        class Sine extends Ease {
            static easeIn: Sine;
            static easeInOut: Sine;
            static easeOut: Sine;
        }
        
        class SlowMo extends Ease {
            static ease: SlowMo;
            
            config(linearRatio: number, power: number, yoyoMode: boolean): SlowMo;
        }
        
        class SteppedEase extends Ease {
            constructor(staps: number);
            
            config(steps: number): SteppedEase;
        }
        
        interface RoughEaseConfig {
            clamp?: boolean;
            points?: number;
            randomize?: boolean;
            strength?: number;
            taper?: "in" | "out" | "both" | "none";
            template?: Ease;
        }
        
        class RoughEase extends Ease {
            static ease: RoughEase;
            
            constructor(vars: RoughEaseConfig);
            
            config(steps?: number): RoughEase;
        }
        
        const Power0: typeof Linear;
        const Power1: typeof Quad;
        const Power2: typeof Cubic;
        const Power3: typeof Quart;
        const Power4: typeof Quint;
        const Strong: typeof Quint;
    }
    type Target = object | object[];
    type Overwrite =
        2 | "auto" | // default
        1 | true | "all" |
        0 | false | "none" |
        3 | "concurrent" |
        4 | "allOnStart" |
        5 | "preexisting";
    
    interface BaseVars extends CssOptions {
        callbackScope?: object;
        delay?: number;
        onComplete?: (...args: any[]) => void;
        onCompleteParams?: any[];
        onCompleteScope?: object;
        onReverseComplete?: (...args: any[]) => void;
        onReverseCompleteParams?: any[];
        onReverseCompleteScope?: object;
        onStart?: (...args: any[]) => void;
        onStartParams?: any[];
        onStartScope?: object;
        onUpdate?: (...args: any[]) => void;
        onUpdateParams?: any[];
        onUpdateScope?: object,
        paused?: boolean;
        repeat?: number;
        repeatDelay?: number;
        useFrames?: boolean;
        yoyo?: boolean;
    }
    
    interface Vars extends BaseVars {
        autoRemoveChildren?: boolean;
        onRepeat?: (...args: any[]) => void;
        onRepeatParams?: any[];
        onRepeatScope?: object;
        smoothChildTiming: boolean;
    }
    
    
    interface ToVars extends BaseVars {
        autoCSS?: boolean;
        ease?: Gsap.Easing.Ease;
        immediateRender?: boolean;
        lazy?: boolean;
        onOverwrite?: (...args: any[]) => void;
        overwrite?: Gsap.Overwrite,
        startAt?: object;
        
        
    }
    
    interface FromVars extends ToVars {
        cycle?: object;
        onRepeat?: (...args: any[]) => void;
        onRepeatParams?: any[];
        onRepeatScope?: object;
        stagger?: number | object | Function,
    }
    
    type EventCallback = "onComplete" | "onUpdate" | "onStart" | "onReverseComplete" | string;
}
declare const Power2;
declare const TweenLite;
