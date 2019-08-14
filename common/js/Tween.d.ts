declare namespace gsap {
    type Target = object | object[];
    type Overwrite =
        2 | "auto" | // default
        1 | true | "all" |
        0 | false | "none" |
        3 | "concurrent" |
        4 | "allOnStart" |
        5 | "preexisting";
    
    class TweenLite extends Animation {
        constructor(target: any, duration: number, vars: any);
        
        /** Provides An easy way to change the default easing equation. */
        static defaultEase: Easing.Ease;
        
        /** Provides An easy way to change the default overwrite mode. */
        static defaultOverwrite: Overwrite;
        
        /** A function that should be called when any tween gets overwritten by another tween (great for debugging).*/
        static onOverwrite: (overwrittenTween: Animation, overwritingTween: Animation, target: Target, overwrittenProperties: any[]) => any;
        
        /** The selector engine (like jQuery) that should be used when a tween receives a string as its target, like TweenLite.to("#myID", 1, {x:"100px"}). */
        static selector: (query: string) => any;
        
        /** Target object (or array of objects) whose properties the tween affects. */
        readonly target: Target;
        
        /**
         * The object that dispatches a "tick" event each time the engine updates, making it easy for you to add your own listener(s) to run custom logic after each update
         * (great for game developers).
         */
        static ticker: any;
        
        /** Provides a simple way to call a () => void after a set amount of time (or frames). */
        static delayedCall(delay: number, callback: (...args: any[]) => void, params?: any[], scope?: any, useFrames?: boolean): TweenLite;
        
        /**
         * Static method for creating a TweenLite instance that tweens backwards - you define the BEGINNING values and the current values are used as the destination values which is great for doing
         * things like animating objects onto the screen because you can set them up initially the way you want them to look at the end of the tween and then animate in from elsewhere.
         */
        static from(target: any, duration: number, vars: any): TweenLite;
        
        /**
         * Static method for creating a TweenLite instance that allows you to define both the starting and ending values (as opposed to to() and from() tweens which are based on the target's
         * current values at one end or the other).
         */
        static fromTo(target: any, duration: number, fromVars: any, toVars: ToVars): TweenLite;
        
        /**
         * Returns an array containing all the tweens of a particular target (or group of targets) that have not been released for garbage collection yet which typically happens within a few
         * seconds after the tween completes.
         */
        static getTweensOf(target: any, onlyActive?: boolean): TweenLite[];
        
        /**
         * [override] Clears any initialization data (like starting/ending values in tweens) which can be useful if, for example, you want to restart a tween without reverting to any previously
         * recorded starting values.
         */
        invalidate(): TweenLite;
        
        /** Immediately kills all of the delayedCalls to a particular () => void. */
        static killDelayedCallsTo(func: (...args: any[]) => void): void;
        
        /** Kills all the tweens (or specific tweening properties) of a particular object or delayedCalls to a particular () => void. */
        static killTweensOf(target: object | object[], onlyActive?: boolean, vars?: object): void;
        
        /** Permits you to control what happens when too much time elapses between two ticks (updates) of the engine, adjusting the core timing mechanism to compensate and avoid "jumps". */
        static lagSmoothing(threshold: number, adjustedLag: number): void;
        
        /**
         * Forces a render of all active tweens which can be useful if, for example, you set up a bunch of from() tweens and then you need to force an immediate render (even of "lazy" tweens) to
         * avoid a brief delay before things render on the very next tick.
         */
        static render(): void;
        
        /** Immediately sets properties of the target accordingly - essentially a zero-duration to() tween with a more intuitive name. */
        static set(target: any, vars: object): TweenLite;
        
        /** Static method for creating a TweenLite instance that animates to the specified destination values (from the current values). */
        static to(target: object, duration: number, vars: ToVars): TweenLite;
    }
    
}
