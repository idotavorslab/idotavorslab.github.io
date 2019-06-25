declare const isIphone: boolean;
declare const home: Elem;
declare type TNavbarSpanChild = INavbar["research"] | INavbar["people"] | INavbar["publications"] | INavbar["photos"] | INavbar["contact"];
interface INavbar extends Elem {
    home: Img;
    research: Span;
    people: Span;
    publications: Span;
    photos: Span;
    contact: Span;
    tau: Img;
    select: (child: TNavbarSpanChild) => void;
}
declare const navbar: INavbar;
