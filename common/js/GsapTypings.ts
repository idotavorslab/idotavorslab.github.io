// GreenSock Animation Platform (GSAP) - http://www.greensock.com/get-started-js/
// JavaScript Docs http://api.greensock.com/js/
// Version 1.0

//com.greensock.core
interface Animation {
    data: any;
    ticker: any;
    // @ts-ignore
    timeline: SimpleTimeline;
    vars: object;
    
    Animation(duration: number, vars?: object);
    
    delay(value: number): any;
    
    duration(value: number): any;
    
    eventCallback(type: string, callback?: Function, params?: any[], scope?: any): any;
    
    invalidate(): any;
    
    kill(vars?: object, target?: object): any;
    
    pause(atTime?: any, suppressEvents?: boolean): any;
    
    paused(value?: boolean): any;
    
    play(from?: any, suppressEvents?: boolean): any;
    
    restart(includeDelay?: boolean, suppressEvents?: boolean): any;
    
    resume(from?: any, suppressEvents?: boolean): any;
    
    reverse(from?: any, suppressEvents?: boolean): any;
    
    reversed(value?: boolean): any;
    
    seek(time: any, suppressEvents?: boolean): any;
    
    // @ts-ignore
    startTime(value: number): any;
    
    time(value: number, suppressEvents?: boolean): any;
    
    timeScale(value: number): any;
    
    totalDuration(value: number): any;
    
    totalTime(time: number, suppressEvents?: boolean): any;
}

interface SimpleTimeline extends Animation {
    autoRemoveChildren: boolean;
    smoothChildTiming: boolean;
    
    insert(tween: any, time: any): any;
    
    render(time: number, suppressEvents?: boolean, force?: boolean): void;
}

//com.greensock
interface TimelineLite {
    addLabel(label: string, time: number): any;
    
    append(value: any, offset: number): any;
    
    appendMultiple(tweens: any[], offset: number, align: string, stagger: number): any;
    
    call(callback: Function, params?: any[], scope?: any, offset?: number, baseTimeOrLabel?: any): any;
    
    clear(labels?: boolean): any;
    
    duration(value: number): any;
    
    exportRoot(vars?: object, omitDelayedCalls?: boolean): TimelineLite;
    
    from(target: object, duration: number, vars: object, offset: number, baseTimeOrLabel?: any): any;
    
    fromTo(target: object, duration: number, fromVars: object, toVars: object, offset: number, baseTimeOrLabel?: any): any;
    
    getChildren(nested?: boolean, tweens?: boolean, timelines?: boolean, ignoreBeforeTime?: number): any[];
    
    getLabelTime(label: string): number;
    
    getTweensOf(target: object, nested?: boolean): any[];
    
    insert(value: any, timeOrLabel: any): any;
    
    insertMultiple(tweens: any[], timeOrLabel: any, align: string, stagger: number): any;
    
    invalidate(): any;
    
    progress(value: number): any;
    
    remove(value: any): any;
    
    removeLabel(label: string): any;
    
    seek(timeOrLabel: any, suppressEvents?: boolean): any;
    
    set(target: object, vars: object, offset: number, baseTimeOrLabel?: any): any;
    
    shiftChildren(amount: number, adjustLabels?: boolean, ignoreBeforeTime?: number): any;
    
    staggerFrom(targets: object[], duration: number, vars: object, stagger: number, offset: number, baseTimeOrLabel?: any, onCompleteAll?: Function, onCompleteAllParams?: any[], onCompleteAllScope?: any): any;
    
    staggerFromTo(targets: object[], duration: number, fromVars: object, toVars: object, stagger: number, offset: number, baseTimeOrLabel?: any, onCompleteAll?: Function, onCompleteAllParams?: any[], onCompleteAllScope?: any): any;
    
    staggerTo(targets: object[], duration: number, vars: object, stagger: number, offset: number, baseTimeOrLabel?: any, onCompleteAll?: Function, onCompleteAllParams?: any[], onCompleteAllScope?: any): any;
    
    stop(): any;
    
    to(target: object, duration: number, vars: object, offset: number, baseTimeOrLabel?: any): any;
    
    totalDuration(value: number): any;
    
    usesFrames(): boolean;
}


interface TweenLite extends Animation {
    // defaultEase: Easing.Ease;
    // defaultOverwrite: Overwrite,
    // target: object;
    // ticker: any;
    
    // delayedCall(delay: number, callback: Function, params?: any[], scope?: any, useFrames?: boolean): TweenLite;
    
    // from(target: object, duration: number, vars: object): TweenLite;
    
    // fromTo(target: object, duration: number, fromVars: object, toVars: ToVars): TweenLite;
    
    // getTweensOf(target: object): any[];
    
    // invalidate(): any;
    
    // killDelayedCallsTo(func: Function): void;
    
    // killTweensOf(target: object, vars?: object): void;
    
    // set(target: object, vars: object): TweenLite;
    
    // to(target: object, duration: number, vars: ToVars): TweenLite;
}

interface ToVars extends CssOptions {
    autoCSS?: boolean;
    callbackScope?: object;
    delay?: number;
    ease?: Easing.Ease;
    immediateRender?: boolean;
    lazy?: boolean;
    onComplete?: Function;
    onCompleteParams?: any[];
    onCompleteScope?: object;
    onOverwrite?: Function,
    onReverseComplete?: Function,
    onReverseCompleteParams?: Function,
    onReverseCompleteScope?: Function,
    onStart?: Function;
    onStartParams?: any[];
    onStartScope?: object;
    onUpdate?: Function,
    onUpdateParams?: any[],
    onUpdateScope?: object,
    overwrite?: Overwrite,
    paused?: boolean;
    repeat?: number;
    repeatDelay?: number;
    startAt?: object;
    useFrames?: boolean;
    yoyo?: boolean;
    
    
}

declare namespace Easing {
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

//com.greensock.plugins
interface BezierPlugin extends TweenPlugin {
    bezierThrough(values: any[], curviness?: number, quadratic?: boolean, correlate?: string, prepend?: object, calcDifs?: boolean): object;
    
    cubicToQuadratic(a: number, b: number, c: number, d: number): any[];
    
    quadraticToCubic(a: number, b: number, c: number): object;
}

interface ColorPropsPlugin extends TweenPlugin {

}

interface CSSPlugin extends TweenPlugin {

}

interface CSSRulePlugin extends TweenPlugin {
    getRule(selector: string): object;
}

interface EaselPlugin extends TweenPlugin {

}

interface RaphaelPlugin extends TweenPlugin {

}

interface RoundPropsPlugin extends TweenPlugin {

}

interface ScrollToPlugin extends TweenPlugin {

}

interface TweenPlugin {
    activate(plugins: any[]): boolean;
}


/*//com.greensock.core
// @ts-ignore
declare var Animation: Animation;
declare var SimpleTimeline: SimpleTimeline;

//com.greensock
declare var TimelineLite: TimelineLite;
declare var TweenLite: TweenLite;

//com.greensock.easing
declare var Back: Back;
declare var Bounce: Bounce;
declare var Circ: Circ;
declare var Cubic: Cubic;
declare var Ease: Ease;
declare var EaseLookup: EaseLookup;
declare var Elastic: Elastic;
declare var Expo: Expo;
declare var Linear: Linear;
declare var Power0: Power0;
declare var Power1: Power1;
declare var Power2: Power2;
declare var Power3: Power3;
declare var Power4: Power4;
declare var Quad: Quad;
declare var Quart: Quart;
declare var Quint: Quint;
declare var Sine: Sine;
declare var SlowMo: SlowMo;
declare var SteppedEase: SteppedEase;
declare var Strong: Strong;

//com.greensock.plugins
declare var BezierPlugin: BezierPlugin;
declare var ColorPropsPlugin: ColorPropsPlugin;
declare var CSSPlugin: CSSPlugin;
declare var CSSRulePlugin: CSSRulePlugin;
declare var EaselPlugin: EaselPlugin;
declare var RaphaelPlugin: RaphaelPlugin;
declare var RoundPropsPlugin: RoundPropsPlugin;
declare var ScrollToPlugin: ScrollToPlugin;
declare var TweenPlugin: TweenPlugin;

*/
