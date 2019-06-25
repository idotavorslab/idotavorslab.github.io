declare type TPersonViewer = {
    init: () => void;
    e: Div;
    isopen: boolean;
    open: () => void;
    populate: (name: string, image: string, cv: string, email: string) => void;
};
declare const PeoplePage: () => {
    init: () => Promise<void>;
};
