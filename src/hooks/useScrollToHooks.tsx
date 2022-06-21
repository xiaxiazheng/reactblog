const useScrollToHook = (ref: any) => {
    const scrollTo = (type: "top" | "bottom") => {
        ref?.current?.scroll({
            left: 0,
            top: type === "top" ? 0 : Number.MAX_SAFE_INTEGER,
            behavior: "smooth",
        });
    };

    return {
        scrollToTop: scrollTo.bind(null, "top"),
        scrollToBottom: scrollTo.bind(null, "bottom"),
    };
};

export default useScrollToHook;
