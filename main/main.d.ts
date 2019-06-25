declare const isIphone: boolean;
declare const home: Elem;
declare type TNavbarDivChild = INavbar["research"] | INavbar["people"] | INavbar["publications"] | INavbar["photos"] | INavbar["contact"];
interface INavbar extends Elem {
    home: Img;
    research: Div;
    people: Div;
    publications: Div;
    photos: Div;
    contact: Div;
    tau: Img;
    select: (child: TNavbarDivChild) => void;
}
declare const navbar: INavbar;
