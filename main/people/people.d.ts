declare type TPersonViewer = {
    e: Div;
    isopen: boolean;
    open: (name: string, image: string, cv: string, email: string) => void;
    populate: (name: string, image: string, cv: string, email: string) => void;
};
declare const PeoplePage: () => {
    init: () => Promise<void>;
};
